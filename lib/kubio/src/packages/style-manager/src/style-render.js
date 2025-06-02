import { LodashBasic } from './core/lodash-basic';
import { Config, Utils } from './core/utils';
import { statesById } from './states';
import { StyleParser } from './style-parser';
import { types } from './types';
import { differenceObj } from './utils/difference-object';

class ElementStyleStateRender {
	constructor( name, style ) {
		this.name = name;
		this.style = style;
	}

	toCss( options = null ) {
		// console.error('options ->', options);
		return StyleParser.getInstance().transform(
			LodashBasic.omit( this.style, 'ancestor' ),
			options
		);
	}
}

class ElementStyleMediaRender {
	static DEFAULT_STATE = 'normal';

	name;
	style;
	byState = {};

	constructor( mediaName, mediaStyle ) {
		this.name = mediaName;
		this.style = mediaStyle;

		if ( mediaStyle ) {
			const defaultStateStyle =
				mediaStyle[ ElementStyleMediaRender.DEFAULT_STATE ];
			LodashBasic.each( mediaStyle, ( stateStyle, stateName ) => {
				if ( Object.keys( stateStyle ) ) {
					this.byState[ stateName ] = new ElementStyleStateRender(
						stateName,
						LodashBasic.merge( {}, defaultStateStyle, stateStyle )
					);
				}
			} );
		}
	}

	toCss( options = null ) {
		const result = {};
		result[ ElementStyleMediaRender.DEFAULT_STATE ] = this.byState[
			ElementStyleMediaRender.DEFAULT_STATE
		]
			? this.byState[ ElementStyleMediaRender.DEFAULT_STATE ].toCss(
					options
			  )
			: {};

		LodashBasic.each( this.byState, ( stateStyle, stateName ) => {
			if ( stateName !== ElementStyleMediaRender.DEFAULT_STATE ) {
				const stateCss = stateStyle.toCss( options );
				if ( stateCss ) {
					result[ stateName ] = differenceObj(
						stateCss,
						result[ ElementStyleMediaRender.DEFAULT_STATE ]
					);
				}
			}
		} );
		return result;
	}
}

class ElementStyleRender {
	constructor( name, style ) {
		this.name = name;
		this.byMedias = {};
		LodashBasic.each( style, ( mediaStyle, mediaName ) => {
			if ( mediaStyle ) {
				this.byMedias[ mediaName ] = new ElementStyleMediaRender(
					mediaName,
					mediaStyle
				);
			}
		} );
	}

	toCss( options = null ) {
		const result = {};
		LodashBasic.each( this.byMedias, ( mediaStyle, mediaName ) => {
			result[ mediaName ] = mediaStyle.toCss( options );
		} );
		return result;
	}
}

class AncestorStyleRender {
	constructor( name, style ) {
		this.name = name;
		this.elementsByName = {};
		LodashBasic.each( style, ( elementStyle, elementName ) => {
			this.elementsByName[ elementName ] = new ElementStyleRender(
				elementName,
				elementStyle
			);
		} );
	}

	toCss( options ) {
		const result = {};
		const allowedElements = options.allowedElements;

		LodashBasic.each( allowedElements, ( elementName ) => {
			const elementStyle = LodashBasic.get(
				this.elementsByName,
				elementName,
				false
			);
			if ( elementStyle ) {
				result[ elementName ] = elementStyle.toCss(
					LodashBasic.merge( {}, options, {
						styledElement: elementName,
					} )
				);
			}
		} );
		return result;
	}
}

class AncestorsStyleContext {
	constructor( model = {}, allowedElements = [], htmlSupport = true ) {
		this.model = model;
		this.allowedElements = allowedElements;
		this.htmlSupport = htmlSupport;
	}
}

class AncestorsStyleRender {
	constructor( style, context = {} ) {
		this.ancestorsByName = {};
		this.context = context;
		const ancestor = LodashBasic.get( style, 'ancestor', [] );
		const ancestors = LodashBasic.merge(
			{ default: LodashBasic.omit( style, 'ancestor' ) },
			ancestor
		);
		const orderedAncestors = LodashBasic.uniq(
			[ 'default' ].concat( LodashBasic.keys( ancestors ) )
		);
		// let defaultAncestorNormalized = null;
		LodashBasic.each( orderedAncestors, ( ancestorName ) => {
			const ancestorStyle = ancestors[ ancestorName ];
			const normalized = Utils.normalizeStyle( ancestorStyle, {
				allowedElements: context.allowedElements,
			} );

			// this seems to break the sticky navigation merge - not sure why we are merging with the default
			// if (ancestorName !== 'default') {
			// 	normalized = mergeNoArrays(
			// 		{},
			// 		defaultAncestorNormalized,
			// 		normalized
			// 	);
			// } else {
			// 	defaultAncestorNormalized = normalized;
			// }

			this.ancestorsByName[ ancestorName ] = new AncestorStyleRender(
				ancestorName,
				normalized
			);
		} );
	}

	toCss( composeSelector = null ) {
		const result = {};

		LodashBasic.each(
			this.ancestorsByName,
			( ancestorStyle, ancestorName ) => {
				result[ ancestorName ] = ancestorStyle.toCss(
					LodashBasic.merge( {}, this.context )
				);
			}
		);

		let mapped = {};
		LodashBasic.each( result, ( ancestorStyle, ancestorName ) => {
			LodashBasic.each(
				ancestorStyle,
				( elementStyleByMedia, elementName ) => {
					LodashBasic.each(
						elementStyleByMedia,
						( elementMediaStyle, media ) => {
							LodashBasic.each(
								elementMediaStyle,
								( elementStateStyle, elementStateName ) => {
									if (
										! LodashBasic.isEmpty(
											elementStateStyle
										)
									) {
										const selectors = composeSelector(
											ancestorName,
											elementName,
											elementStateName
										);

										elementStateStyle =
											addAtBodyStyleToAncestorStyle( {
												elementStateStyle,
												selectors,
												media,
												mapped,
											} );

										const value = LodashBasic.set(
											{},
											LodashBasic.concat(
												[ media ],
												selectors
											),
											elementStateStyle
										);

										mapped = LodashBasic.merge(
											mapped,
											value
										);
									}
								}
							);
						}
					);
				}
			);
		} );
		return mapped;
	}
}

//Used to move style by using @body in selectors
const addAtBodyStyleToAncestorStyle = ( {
	elementStateStyle,
	selectors,
	media,
	mapped,
} ) => {
	const stateCloned = false;
	LodashBasic.each( elementStateStyle, ( elementStyle, elementSelector ) => {
		//@body is the syntax to have selector go outside the block selector.
		const bodySelector = '@body';
		if ( elementSelector.includes( bodySelector ) ) {
			const outsideSelector = 'body .block-editor-block-list__layout';
			const newInsideSelector = elementSelector.replaceAll(
				bodySelector,
				''
			);
			if ( ! stateCloned ) {
				elementStateStyle = window.structuredClone( elementStateStyle );
			}
			LodashBasic.unset( elementStateStyle, elementSelector );
			const newSelectors = window.structuredClone( selectors );
			//add the outside selector captured with @@selector@@ at the first position
			//and remove the global selector
			newSelectors[ 0 ] = outsideSelector;

			const value = LodashBasic.set(
				{},
				LodashBasic.concat( [ media ], newSelectors, [
					newInsideSelector,
				] ),
				elementStyle
			);
			mapped = LodashBasic.merge( mapped, value );
		}
	} );
	return elementStateStyle;
};

class BasicPropsConfig {
	constructor( props ) {
		LodashBasic.extend( this, props );
	}
}

class StateConfig extends BasicPropsConfig {
	constructor( props ) {
		const defaultProps = { selector: false, stateRedirectElement: false };
		super( { ...defaultProps, ...props } );
	}
}

class ElementConfig extends BasicPropsConfig {
	static STATE_KEY = '{{state}}';

	constructor( props ) {
		super( {
			...{
				usePrefix: true,
				useParentPrefix: false,
				useWrapperPrefix: false,
				selector: false,
				ancestor: false,
				statesConfig: {},
				statesById: {},
				selectorPrepend: false,
				prefixWithTag: false,
			},
			...props,
		} );
	}

	getSelector( state = null ) {
		let elementSelector;
		if ( this.isSelectorPerState() ) {
			const defaultSelector = LodashBasic.get( this.selector, 'default' );
			elementSelector = LodashBasic.get(
				this.selector,
				state,
				defaultSelector
			);
			elementSelector = LodashBasic.replace(
				elementSelector,
				ElementConfig.STATE_KEY,
				this.getStateConfig( state )?.selector
			);
		} else {
			elementSelector = this.selector;
		}
		return elementSelector;
	}

	isSelectorPerState() {
		return LodashBasic.isObjectLike( this.selector );
	}

	getStateConfig( state ) {
		const props = LodashBasic.merge(
			{},
			this.statesById[ state ],
			LodashBasic.get( this.statesConfig, 'default', {} ),
			LodashBasic.get( this.statesConfig, state, {} )
		);
		return new StateConfig( props );
	}

	shouldPrependAncestor( ancestor ) {
		return this.ancestor !== ancestor;
	}

	shouldAppendStateSelector() {
		if ( this.isSelectorPerState() ) {
			return false;
		}
		if (
			LodashBasic.isString( this.selector ) &&
			this.selector.search( ElementConfig.STATE_KEY ) !== -1
		) {
			return false;
		}
		return true;
	}
}

class StyleRender {
	static prefixSelectorsByType = {
		shared: '#kubio',
		local: '#kubio',
		dynamic: 'body',

		//the  general settings selector was to strong reduced the global selector, because all general settings eithar
		//have the [data-kubio] prefix or uses classes from kubio like h-y-container.
		global: '.block-editor-block-list__layout',
	};

	constructor( options ) {
		this.model = {};
		this.wrapperElement = null;
		this.parser = StyleParser.getInstance();
		this.statesById = statesById;
		this.prefixParents = [];
		this.htmlSupport = true;
		this.baseClass = '';
		this.styledElementsByName = {};
		this.styledElementsEnum = {};
		this.useParentPrefix = false;

		this.loadOptions( options );

		this.allowedElements = LodashBasic.concat(
			[ 'default' ],
			Object.keys( this.styledElementsByName ),
			Object.values( this.styledElementsEnum )
		);
		this.statesByElement = this.getStatesByElement();
	}

	static renderJssToCss( jss, inheritedSelector = '' ) {
		let result = '';
		const nested = {};
		const properties = [];

		LodashBasic.each( jss, ( value, key ) => {
			if ( LodashBasic.isString( value ) ) {
				properties.push(
					[ LodashBasic.kebabCase( key ), value ].join( ':' )
				);
			} else {
				nested[ key ] = value;
			}
		} );

		if ( properties.length ) {
			result +=
				inheritedSelector + '{\n' + properties.join( ';' ) + '\n}\n';
		}

		LodashBasic.each( nested, ( value, nestedSelector ) => {
			const newSelector = StyleRender.composeSelectors(
				inheritedSelector,
				nestedSelector
			);
			result += StyleRender.renderJssToCss( value, newSelector );
		} );

		return result;
	}

	static composeSelectors( inheritedSelectorStr, nestedSelector ) {
		const selectorParts = [];
		const selectors = nestedSelector.split( ',' );
		const inheritedSelectors = inheritedSelectorStr.split( ',' );

		LodashBasic.each( inheritedSelectors, ( inheritedSelector ) => {
			inheritedSelector = inheritedSelector.trim();

			LodashBasic.each( selectors, ( selector ) => {
				selector = selector.trim();
				const isCompounded = selector.search( '&' ) !== -1;

				if ( isCompounded ) {
					const compoundedSelector = selector.replace(
						/&/gi,
						inheritedSelector.trim()
					);
					selectorParts.push( compoundedSelector );
				} else {
					selectorParts.push(
						LodashBasic.compact( [
							inheritedSelector,
							selector.trim(),
						] ).join( ' ' )
					);
				}
			} );
		} );

		return selectorParts.join( ',' );
	}

	static normalizeDynamicStyle( dynamicStyleByElements ) {
		const converted = {};
		LodashBasic.each(
			dynamicStyleByElements,
			( styleByMedia, elementName ) => {
				let newStyle = { media: {} };
				if ( styleByMedia.desktop ) {
					newStyle = styleByMedia.desktop;
				}
				LodashBasic.each( styleByMedia, ( style, media ) => {
					if ( media !== 'desktop' ) {
						LodashBasic.set( newStyle, [ 'media', media ], style );
					}
				} );

				LodashBasic.set(
					converted,
					[ 'descendants', elementName ],
					newStyle
				);
			}
		);
		return converted;
	}

	loadOptions( options ) {
		LodashBasic.each( options, ( value, name ) => {
			this[ name ] = value;
		} );
	}

	getStatesByElement() {
		const statesByElement = {};
		LodashBasic.each( this.styledElementsByName, ( item, name ) => {
			statesByElement[ name ] = LodashBasic.get(
				item,
				[ 'supports', Config.statesKey ],
				[ 'normal', 'hover' ]
			);
		} );
		return statesByElement;
	}

	exportDynamicStyle( style = null ) {
		return this.convertStyleToCss(
			StyleRender.normalizeDynamicStyle( style ),
			{
				styledElementsByName: this.styledElementsByName,
				styleType: 'dynamic',
			}
		);
	}

	export( dynamicStyle = null ) {
		const style = this.model.style;
		const css = {};

		LodashBasic.each( style, ( styleValue, styleType ) => {
			if ( styleValue ) {
				css[ styleType ] = this.convertStyleToCss( styleValue, {
					styledElementsByName: this.styledElementsByName,
					styleType,
				} );
			}
		} );

		if ( dynamicStyle ) {
			css.dynamic = this.exportDynamicStyle( dynamicStyle );
		}

		return css;
	}

	convertStyleToCss( style, settings ) {
		const styleType = LodashBasic.get( settings, 'styleType', 'shared' );
		const rootPrefix = LodashBasic.get(
			settings,
			'prefix',
			StyleRender.prefixSelectorsByType[ styleType ]
		);

		const allowedElements = this.getStyledElementsNames();

		const ancestorsStyle = new AncestorsStyleRender(
			style,
			new AncestorsStyleContext(
				this.model,
				allowedElements,
				this.htmlSupport
			)
		);

		const composeSelectorWithPrefix = ( ancestor, element, state ) => {
			const withGlobalPrefix = LodashBasic.get( settings, [
				'styledElementsByName',
				element,
				`withGlobalPrefix`,
			] );
			let prefix = rootPrefix;
			if ( withGlobalPrefix ) {
				prefix = `#kubio ${ rootPrefix }`;
			}
			return this.composeSelector(
				prefix,
				styleType,
				ancestor,
				element,
				state
			);
		};

		const jssByMedia = ancestorsStyle.toCss( composeSelectorWithPrefix );

		return jssByMedia;
	}

	getStyledElementsNames() {
		return LodashBasic.concat(
			[],
			Object.keys( this.styledElementsByName )
		);
	}

	composeSelector( rootPrefix, styleType, ancestor, element, state ) {
		const elementConfig = this.getElementData( element );
		let selectors = [];

		if ( elementConfig.usePrefix ) {
			selectors.push( rootPrefix );
		}

		if ( this.useParentPrefix ) {
			selectors = selectors.concat( this.prefixParents );
		}

		const ancestorSelector =
			ancestor === 'default' ? '' : this.ancestorToSelector( ancestor );

		const shouldPrependAncestor =
			elementConfig.shouldPrependAncestor( ancestor );

		if ( ancestorSelector && shouldPrependAncestor ) {
			selectors.push( ancestorSelector );
		}

		const isWrapperElement = this.wrapperElement === element;

		const shouldPrefixWithWrapperSelector =
			this.wrapperElement &&
			( elementConfig.selector || elementConfig.useWrapperPrefix ) &&
			elementConfig.usePrefix &&
			! isWrapperElement;

		if ( shouldPrefixWithWrapperSelector ) {
			selectors.push(
				this.composeElementSelector(
					styleType,
					ancestor,
					this.wrapperElement
				)
			);
		}

		const stateConfig = elementConfig.getStateConfig( state );

		if ( stateConfig.stateRedirectElement ) {
			const stateElementSelector = this.composeElementSelector(
				styleType,
				ancestor,
				stateConfig.stateRedirectElement,
				state
			);
			selectors.push( stateElementSelector );

			if ( elementConfig.shouldAppendStateSelector() ) {
				selectors.push( '&' + stateConfig.selector );
			}
		}

		let mainSelector = this.composeElementSelector(
			styleType,
			ancestor,
			element,
			state
		);

		if ( ancestorSelector && ! shouldPrependAncestor ) {
			// selectors.push('&' + ancestorSelector);
			mainSelector = ancestorSelector + mainSelector;
		}

		selectors.push( mainSelector );

		if (
			elementConfig.shouldAppendStateSelector() &&
			! stateConfig.stateRedirectElement &&
			stateConfig.selector
		) {
			selectors.push( '&' + stateConfig.selector );
		}

		return selectors;
	}

	getElementData( elementName ) {
		const elementConfig = window.structuredClone(
			this.styledElementsByName[ elementName ] || {}
		);
		return new ElementConfig( {
			statesById: this.statesById,
			...elementConfig,
		} );
	}

	composeElementSelector( styleType, ancestor, element, state = null ) {
		const elementConfig = this.getElementData( element );
		let elementSelector = elementConfig.getSelector( state );
		const isMainElement = this.wrapperElement === element;
		if (
			elementSelector === false ||
			( isMainElement && elementSelector )
		) {
			let prefixTag =
				elementConfig.prefixWithTag === true
					? elementConfig.props.tag
					: elementConfig.prefixWithTag;

			if (
				elementConfig.prefixWithTag === true &&
				elementConfig.props.htmlTag
			) {
				prefixTag = elementConfig.props.htmlTag;
			}

			let composedSelector = this.componentInstanceClass(
				element,
				styleType,
				true,
				elementConfig.prefixWithTag ? prefixTag : false
			);

			if ( elementSelector ) {
				if ( elementConfig.selectorPrepend ) {
					composedSelector = StyleRender.composeSelectors(
						elementSelector,
						'&' + composedSelector
					);
				} else {
					composedSelector = StyleRender.composeSelectors(
						composedSelector,
						elementSelector
					);
				}
			}
			elementSelector = composedSelector;
		}
		return elementSelector;
	}

	componentInstanceClass( name, type, asSelector = false, tag = false ) {
		let id = this.model.styleRef;
		switch ( type ) {
			case 'local':
				id = this.componentLocalInstanceId( type );
				break;
		}
		const tagPrefix = tag ? tag : '';
		const className = 'style-' + id + ( name ? '-' + name : '' );
		return asSelector ? tagPrefix + '.' + className : className;
	}

	componentLocalInstanceId( type ) {
		return type + '-' + this.model.id;
	}

	ancestorToSelector( name ) {
		return LodashBasic.get( types.ancestors, [ name, 'selector' ], '' );
	}
}

export { StyleRender };
