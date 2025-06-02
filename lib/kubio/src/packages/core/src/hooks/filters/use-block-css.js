import {
	BlockStyleRender,
	createWorkerPromise,
	styleManagerInstance,
	types,
} from '@kubio/style-manager';
import {
	compose,
	createHigherOrderComponent,
	usePrevious,
} from '@wordpress/compose';
import { useRegistry } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';
import { get } from 'lodash';
import { useDataHelperDefaultOptionsContext } from '../../context';
import { getCachedMergedAttributes } from '../../data-wrapper/access';
import { mergeMainAttribute } from '../../utils/merge';
import {
	useBlockDataDetails,
	useBlockDataDetails2,
} from '../use-parent-block-data';
import { useLocalId } from './local-id';
import { useRootElementContext } from './root-element';

const worker = createWorkerPromise( 'block-style-renderer' );

const renderBlockStyle = (
	data,
	parentDetails,
	canUseHtml,
	document,
	callback
) => {
	const styleManager = styleManagerInstance( document );

	if ( worker && styleManager ) {
		worker( 'EXPORT_CSS', {
			data,
			parentDetails,
			canUseHtml,
		} )
			.then( ( payload ) => {
				const { css, styleRef, localId, fonts } = payload;
				if ( localId && localId !== 'undefined' ) {
					styleManager.updateLocalRules( localId, css.local );
				}
				styleManager.updateSharedRules( styleRef, css.shared );
				styleManager.updateRules();
				callback?.();
				doAction( 'kubio.google-fonts.load', fonts );
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
					).render();
					callback?.();
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
		).render();
		callback?.();
	}
};

const renderStyle = ( {
	kubioAttribute,
	parentBlockDetails,
	localId,
	block,
	blockType,
	ownerDocument,
	canUseHtml,
	callback,
} ) => {
	const { styleRef, hash = '' } = kubioAttribute || {};

	if ( ! styleRef ) {
		callback?.();
		return;
	}

	let mergedAttribute = getCachedMergedAttributes( styleRef, hash );

	if ( ! mergedAttribute ) {
		mergedAttribute = mergeMainAttribute(
			{
				...window.structuredClone( kubioAttribute ),
				id: localId,
			},
			block.name
		);
	} else {
		mergedAttribute = {
			...mergedAttribute,
			id: localId,
		};
	}

	renderBlockStyle(
		{
			blockData: {
				attributes: {
					...block.attributes,
					kubio: mergedAttribute,
				},
				clientId: block.clientId,
			},
			blockType,
		},
		parentBlockDetails,
		canUseHtml,
		ownerDocument,
		callback
	);
};

const mainAttrChanged = ( prevMainAttribute, mainAttribute ) => {
	return (
		prevMainAttribute?.styleRef !== mainAttribute?.styleRef ||
		prevMainAttribute?.hash !== mainAttribute?.hash
	);
};

const isStylingDisabled = ( blockType ) =>
	get(
		blockType,
		`supports.${ types.constants.support.mainAttributeKey }.stylingDisabled`,
		false
	);

const isUsingParentPrefix = ( blockType ) =>
	get(
		blockType,
		`supports.${ types.constants.support.mainAttributeKey }.useParentPrefix`,
		false
	);

const getBlockStyleRef = ( blockData ) =>
	get( blockData, 'block.attributes.kubio.styleRef' );

const useBlockCss = ( { block, blockType } = {}, parentBlockDetails ) => {
	const kubioAttribute = block?.attributes?.kubio;
	const prevParentStyleRef = usePrevious(
		getBlockStyleRef( parentBlockDetails )
	);

	const { defaultOptions } = useDataHelperDefaultOptionsContext();
	const canUseHtml = ! defaultOptions?.inheritedAncestor;
	const registry = useRegistry();

	const localId = useLocalId();

	const rootElement = useRootElementContext();
	const ownerDocument = rootElement?.ownerDocument;

	const prevKubioAttribute = usePrevious(
		ownerDocument ? kubioAttribute || {} : null
	);

	useEffect( () => {
		if ( ! ownerDocument ) {
			return;
		}

		if (
			isStylingDisabled( blockType ) ||
			! kubioAttribute ||
			! kubioAttribute?.styleRef
		) {
			return;
		}

		// skip render style if the kubio attribute was not changed and the parent styleRef remained the same.
		if ( ! mainAttrChanged( prevKubioAttribute, kubioAttribute ) ) {
			const parentBlockStyleRefChanges =
				getBlockStyleRef( parentBlockDetails ) !== prevParentStyleRef;
			const isAffectedByParent =
				isUsingParentPrefix( blockType ) && parentBlockStyleRefChanges;

			if ( ! isAffectedByParent ) {
				return;
			}
		}

		renderStyle( {
			kubioAttribute,
			parentBlockDetails,
			localId,
			block,
			blockType,
			ownerDocument,
			canUseHtml,
			registry,
		} );
	}, [
		block,
		blockType,
		canUseHtml,
		kubioAttribute,
		localId,
		ownerDocument,
		parentBlockDetails,
		prevKubioAttribute,
		prevParentStyleRef,
		registry,
	] );
};

const KubioUseBlockCss = compose( [
	createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const rootElement = useRootElementContext();

			let rootClientId = ownProps?.rootClientId;

			// block seems to be in block preview - use the parent as the block outside the preview
			if ( rootElement?.closest( '[data-block]' ) ) {
				const parentClientId = rootElement
					?.closest( '[data-block]' )
					?.getAttribute( 'data-block' );

				if ( parentClientId ) {
					rootClientId = parentClientId;
				}
			}

			const parentBlockDetails = useBlockDataDetails( rootClientId );
			const blockDetails = useBlockDataDetails2( ownProps );

			const kubioContext = {
				blockDetails,
				parentBlockDetails,
			};
			return <WrappedComponent { ...ownProps } { ...kubioContext } />;
		},
		'KubioUseBlockCss/prepare'
	),
	createHigherOrderComponent( ( BlockListBlock ) => {
		return ( props ) => {
			const { blockDetails, parentBlockDetails, ...rest } = props;

			useBlockCss( blockDetails, parentBlockDetails );

			return <BlockListBlock { ...rest } />;
		};
	}, 'KubioUseBlockCss' ),
] );

export { KubioUseBlockCss, renderStyle };
