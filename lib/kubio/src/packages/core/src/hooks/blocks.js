import { Utils } from '@kubio/style-manager';
import { compareVersions, getBrowser } from '@kubio/utils';
import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from '@wordpress/element';
import { addFilter, applyFilters } from '@wordpress/hooks';
import classnames from 'classnames';
import { first, has, map, omit, set } from 'lodash';
import shortid from 'shortid';
import { useCallback } from 'use-memo-one';
import { useOwnerDocumentContext, useRootElementContext } from '..';
import { getStyledElementClassName } from '../common/hocs';
import { withCopyStyleToolbar } from '../common/hocs/with-copy-style';
import { useKubioBlockContext } from '../context';
import withInspectorControlsColibriJson from '../dev/colibri-json-inspector';
import { addKubioSupport } from '../support';
import './filters';
import { useDeepMemo } from './use-deep-memo';

export const addStylesSupport = ( settings, name ) => {
	const blocksStyles = applyFilters( 'kubio.registerBlockStyle', {} );
	if ( blocksStyles && blocksStyles[ name ] ) {
		return addKubioSupport( settings, blocksStyles[ name ] );
	}
	return settings;
};

export const addKubioAttribute = ( settings ) => {
	// allow blocks to specify their own attribute definition with default values if needed.
	if ( has( settings.attributes, [ 'kubio', 'type' ] ) ) {
		return settings;
	}

	if ( hasBlockSupport( settings, 'kubio' ) ) {
		settings.attributes = {
			...settings.attributes,
			kubio: {
				type: 'object',
			},
		};
	}

	return settings;
};

export const addKubioProps = ( props, blockType, attributes ) => {
	const { name } = blockType;
	if ( name.match( /kubio/ ) || name.match( /cspromo/ ) ) {
		return props;
	}

	const supportsKubio = getBlockSupport( blockType, 'kubio' );

	if ( supportsKubio ) {
		const { kubio = {} } = attributes;
		let className = '';

		if ( kubio.styleRef ) {
			const defaultStyledElement =
				first(
					map( supportsKubio.elementsByName, ( item, key ) => ( {
						key,
						default: item.default,
					} ) )
				)?.key || 'default';

			className = getStyledElementClassName( {
				styleRef: kubio.styleRef,
				localId: kubio?.id ?? shortid.generate(),
				name: defaultStyledElement,
				blockName: `kubio-${ name }`,
			} );

			const hiddenByMedia = {
				desktop: kubio?.props?.isHidden,
				tablet: kubio?.props?.media?.tablet?.isHidden,
				mobile: kubio?.props?.media?.mobile?.isHidden,
			};

			const hiddenClasses = Utils.mapHideClassesByMedia( hiddenByMedia );

			props.className = classnames(
				className,
				props.className,
				hiddenClasses
			);
		}
	}
	return props;
};

export const deprecateKubioLocalIdProp = ( blockAttributes, blockType ) => {
	if ( blockType.name.match( /kubio/ ) ) {
		blockAttributes = omit( blockAttributes, 'kubio.id' );
		return blockAttributes;
	}

	return blockAttributes;
};

addFilter(
	'blocks.getBlockAttributes',
	'kubio.style.deprecateLocalIdProp',
	deprecateKubioLocalIdProp
);

export const modifiySavedElement = ( element ) => {
	return element;
};

addFilter( 'blocks.registerBlockType', 'kubio.style', addStylesSupport );

addFilter(
	'blocks.registerBlockType',
	'kubio.style.addAttribute',
	addKubioAttribute
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'kubio.style.addProp',
	addKubioProps
);

addFilter(
	'blocks.getSaveElement',
	'kubio.style.modifyElement',
	modifiySavedElement
);

addFilter( 'editor.BlockEdit', 'kubio.dev', withInspectorControlsColibriJson );

addFilter(
	'editor.BlockListBlock',
	'kubio.withCopyStyleToolbar',
	withCopyStyleToolbar
);

const isHiddenStyleMapper = ( { dataHelper } ) => {
	const hiddenByMedia =
		dataHelper?.getPropByMedia( 'isHidden', false, { fromRoot: true } ) ||
		{};
	const hiddenClasses = Utils.mapHideClassesByMedia( hiddenByMedia );

	return hiddenClasses.length
		? {
				[ dataHelper?.wrapperStyledComponent ]: {
					className: hiddenClasses,
				},
		  }
		: {};
};

addFilter(
	'kubio.style-mappers',
	'kubio.style-mappers.handle-is-hidden',
	( styleMappers ) => {
		styleMappers.push( isHiddenStyleMapper );
		return styleMappers;
	}
);

const useAppearanceEffectStyleMapper = ( { dataHelper } ) => {
	const appearanceAttributes = {};
	const appearanceEffect = dataHelper.getAttribute(
		'appearanceEffect',
		'none'
	);

	if ( appearanceEffect !== 'none' ) {
		set( appearanceAttributes, 'data-kubio-aos', appearanceEffect );
		set(
			appearanceAttributes,
			'className',
			`animated kubio-aos-hide-animation ${ appearanceEffect }`
		);
	}

	return {
		[ dataHelper?.wrapperStyledComponent ]: {
			...appearanceAttributes,
		},
	};
};

addFilter(
	'kubio.style-mappers',
	'kubio.style-mappers.handle-appearance-effect',
	( styleMappers ) => {
		styleMappers.push( useAppearanceEffectStyleMapper );
		return styleMappers;
	}
);

const getComputedAnimationDelay = ( target ) => {
	const { getComputedStyle } = target.ownerDocument.defaultView;
	const animationDelay = getComputedStyle( target ).animationDelay;

	if ( animationDelay.includes( 'ms' ) ) {
		return parseInt( animationDelay.replace( 'ms', '' ) ) || 0;
	}

	if ( animationDelay.includes( 's' ) ) {
		return parseFloat( animationDelay.replace( 's', '' ) ) * 1000 || 0;
	}
	if ( ! isNaN( parseFloat( animationDelay ) ) ) {
		return parseFloat( animationDelay );
	}

	return 0;
};

const withAppearanceEffect = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { dataHelper } = useKubioBlockContext();
		const appearanceEffect = dataHelper.getAttribute(
			'appearanceEffect',
			'none'
		);

		let animationDependencies = {
			appearanceEffect,
		};

		if ( appearanceEffect !== 'none' ) {
			const appearanceEffectRefreshKey = dataHelper.getContextProp(
				'appearanceEffectRefreshKey',
				''
			);

			animationDependencies = {
				...animationDependencies,
				appearanceEffectRefreshKey,
			};
		}

		const animationDependenciesMemoized = useDeepMemo( () => {
			return animationDependencies;
		}, [ animationDependencies ] );

		const isFirstTime = useRef( true );

		const { ownerDocument } = useOwnerDocumentContext();
		const onAnimationEnd = useCallback( function () {
			const node = this;
			node.removeEventListener( 'animationend', onAnimationEnd );
			node.classList.add( 'kubio-aos-hide-animation' );
		}, [] );

		useLayoutEffect( () => {
			let to = null;
			if ( ownerDocument ) {
				const node = ownerDocument?.querySelector(
					`[data-block='${ dataHelper.clientId }']`
				);

				if ( ! node ) {
					return;
				}

				const { appearanceEffect: effect = 'none' } =
					animationDependenciesMemoized || {};

				if ( effect === 'none' ) {
					return;
				}

				if ( isFirstTime.current ) {
					node.classList.add( 'kubio-aos-hide-animation' );
					isFirstTime.current = false;
					return;
				}

				node.addEventListener( 'animationend', onAnimationEnd );
				node.classList.add( 'force-hide' );
				const delay = Math.max( 0, getComputedAnimationDelay( node ) );

				to = setTimeout( () => {
					node.classList.remove( 'force-hide' );
				}, delay );

				node.classList.remove( 'kubio-aos-hide-animation' );
			}

			return () => {
				if ( to ) {
					clearTimeout( to );
				}
			};
		}, [ animationDependenciesMemoized, ownerDocument ] );

		return <BlockEdit { ...props } />;
	};
}, 'withAppearanceEffect' );

addFilter( 'editor.BlockEdit', 'kubio.appearanceEffect', withAppearanceEffect );

const withKubioThirdPartyBlockControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const { name } = props;

			const Content = useMemo( () => {
				const panels = applyFilters(
					'kubio.registerBlockStyle.contentPanel',
					{}
				);
				return panels[ name ] || null;
			}, [ name ] );

			const Style = useMemo( () => {
				const panels = applyFilters(
					'kubio.registerBlockStyle.stylePanel',
					{}
				);
				return panels[ name ] || null;
			}, [ name ] );

			return (
				<>
					<BlockEdit { ...props } />
					{ !! Content && <Content /> }
					{ !! Style && <Style /> }
				</>
			);
		};
	},
	'withKubioBlockInspectorControls'
);

addFilter(
	'editor.BlockEdit',
	'kubio.third-party-controls',
	withKubioThirdPartyBlockControls
);

const withKubioPolyfills = createHigherOrderComponent( ( Component ) => {
	return ( props ) => {
		const { ownerDocument } = useRootElementContext() || {};
		useEffect( () => {
			const rootEl = ownerDocument?.children?.[ 0 ];
			// gap polyfill
			if ( rootEl && ! rootEl.classList.contains( 'kubio-gap-tested' ) ) {
				const browser = getBrowser();
				if ( browser.name === 'safari' ) {
					if ( compareVersions( browser.version, '<=', '14' ) ) {
						rootEl.classList.add( 'kubio-enable-gap-fallback' );
					}
				}

				rootEl.classList.add( 'kubio-gap-tested' );
			}
		}, [ ownerDocument ] );

		return <Component { ...props } />;
	};
} );

addFilter(
	'editor.BlockListBlock',
	'kubio.withKubioPolyfills',
	withKubioPolyfills
);

const addKubioAIAttribute = ( settings ) => {
	// allow blocks to specify their own attribute definition with default values if needed.
	if ( has( settings.attributes, [ 'kubioAI', 'type' ] ) ) {
		return settings;
	}

	if ( hasBlockSupport( settings, 'kubio' ) ) {
		settings.attributes = {
			...settings.attributes,
			kubioAI: {
				type: 'object',
				default: {},
			},
		};
	}

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'kubio.ai.addKubioAIAttribute',
	addKubioAIAttribute
);
