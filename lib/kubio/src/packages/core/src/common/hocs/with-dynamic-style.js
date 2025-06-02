import {
	BlockStyleRender,
	createWorkerPromise,
	styleManagerInstance,
} from '@kubio/style-manager';
import { getBlockType } from '@wordpress/blocks';
import { compose, createHigherOrderComponent } from '@wordpress/compose';
import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { get, merge } from 'lodash';
import isEqual from 'react-fast-compare';
import {
	useDataHelperDefaultOptionsContext,
	useKubioBlockContext,
} from '../../context';
import { useBlockDataDetails, useRootElementContext } from '../../hooks';

const worker = createWorkerPromise( 'block-style-renderer-dynamic' );

const renderBlockStyle = (
	data,
	parentDetails,
	canUseHtml,
	document,
	dynamicStyle
) => {
	const { styleRef } = get( data.blockData, 'attributes.kubio', {} );

	if ( ! styleRef ) {
		return;
	}

	const styleManager = styleManagerInstance( document );
	if ( worker ) {
		worker( 'EXPORT_CSS', {
			data: { ...data, dynamicStyle },
			parentDetails,
			canUseHtml,
		} )
			.then( ( payload ) => {
				const { styleRef: responseStyleRef, dynamicRules } = payload;
				if ( responseStyleRef ) {
					styleManager.updateDynamicRules(
						responseStyleRef,
						dynamicRules
					);
					styleManager.updateRules();
				}
			} )
			.catch( ( error ) => {
				if ( error === 'WORKER_FAILED' ) {
					// eslint-disable-next-line no-console
					console.warn(
						'STYLING WORKER FAILED! Use main thread to render style'
					);
					new BlockStyleRender(
						data,
						parentDetails,
						canUseHtml,
						document
					).render( dynamicStyle );
				} else {
					// eslint-disable-next-line no-console
					console.error( error );
				}
			} );
	} else {
		new BlockStyleRender(
			data,
			parentDetails,
			canUseHtml,
			document
		).render( dynamicStyle );
	}
};

/**
 *
 * @param {function({dataHelper}) : Object} dynamicStylesMapper
 * @return {*}
 */
const withDynamicStyles = ( dynamicStylesMapper ) => {
	return compose( [
		createHigherOrderComponent(
			( WrappedComponent ) => ( ownProps ) => {
				const { name } = ownProps;
				const blockSupport = getBlockType( name );
				const parentBlockDetails = useBlockDataDetails(
					ownProps?.rootClientId
				);
				const { ownerDocument } = useRootElementContext() || {};
				const kubioContext = {
					ownerDocument,
					blockSupport,
					parentBlockDetails,
				};
				return <WrappedComponent { ...ownProps } { ...kubioContext } />;
			},
			'withDynamicStyles/prepare'
		),
		createHigherOrderComponent(
			( WrappedComponent ) => ( ownProps ) => {
				const {
					attributes,
					ownerDocument,
					blockSupport,
					parentBlockDetails,
				} = ownProps;

				const { dataHelper } = useKubioBlockContext();
				const [ style, setStyle ] = useState( {
					merged: {},
					dynamic: {},
				} );
				const setStyleRef = useRef();

				setStyleRef.current = setStyle;
				// cache dynamic style value in a local state reduce BlockStyleRender rerenders
				useLayoutEffect( () => {
					if ( ! attributes?.kubio?.styleRef ) {
						return;
					}

					const dynamicStyle = dynamicStylesMapper( dataHelper );
					const mergedAttribute = dataHelper.mergedData();
					const styleData = {
						supports: ownProps.supports,
						attributes: ownProps.attributes,
						clientId: ownProps.clientId,
					};
					const mergedStyle = merge( {}, styleData, {
						attributes: {
							kubio: mergedAttribute,
						},
					} );

					setStyle( ( currentStyle ) => {
						let newStyle = {
							...currentStyle,
						};
						let shouldUpdate = false;

						if ( ! isEqual( mergedStyle, currentStyle.merged ) ) {
							shouldUpdate = true;
							newStyle = {
								...newStyle,
								merged: mergedStyle,
							};
						}

						if ( ! isEqual( dynamicStyle, currentStyle.dynamic ) ) {
							shouldUpdate = true;
							newStyle = {
								...newStyle,
								dynamic: dynamicStyle,
							};
						}

						if ( shouldUpdate ) {
							return newStyle;
						}

						return style;
					} );
				}, [
					attributes?.kubio?.styleRef,
					dataHelper,
					ownProps.attributes,
					ownProps.clientId,
					ownProps.supports,
					style,
				] );

				const { defaultOptions } = useDataHelperDefaultOptionsContext();
				const canUseHtml = ! defaultOptions?.inheritedAncestor;

				const stylingDisabled = get(
					blockSupport,
					`supports.kubio.stylingDisabled`,
					false
				);

				useEffect( () => {
					if ( stylingDisabled ) {
						return;
					}

					if ( ! ownerDocument ) {
						return;
					}

					renderBlockStyle(
						{
							blockData: style.merged,
							blockType: blockSupport,
						},
						parentBlockDetails,
						canUseHtml,
						ownerDocument,
						style.dynamic
					);
				}, [
					style,
					ownerDocument,
					parentBlockDetails,
					stylingDisabled,
					blockSupport,
					canUseHtml,
				] );

				return <WrappedComponent { ...ownProps } />;
			},
			'withDynamicStyles/useCss'
		),
	] );
};

export { withDynamicStyles };
