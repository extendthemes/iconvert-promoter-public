// import { measureFnPerformance } from '@kubio/utils';
import { GLOBAL_SESSION_ID, SESSION_STORE_KEY } from '@kubio/constants';
import { select } from '@wordpress/data';
import cssobjCore from 'cssobj-core';
import {
	debounce,
	difference,
	get,
	isArray,
	isEmpty,
	isFunction,
	isObject,
	isUndefined,
	merge,
	noop,
	omit,
	uniq,
} from 'lodash';
import isEqual from 'react-fast-compare';
import { LodashBasic } from './core/lodash-basic';
import cssobjKubioCSSOM from './cssobj/cssobj-plugin-cssom';
import pluginGenCSS from './cssobj/cssobj-plugin-gencss';
import * as Media from './medias';

const isKubioEditor = () => {
	return !! top.isKubioBlockEditor;
};

const isEditorLoaded = () => {
	if ( isKubioEditor() ) {
		return select( SESSION_STORE_KEY ).getProp(
			GLOBAL_SESSION_ID,
			'ready',
			false
		);
	}

	return true;
};

const documentAddDisableTransitionClasses = ( document ) => {
	if ( document.querySelector( '#kubio-global-transition-disabled' ) ) {
		return;
	}

	const style = document.createElement( 'style' );
	style.id = 'kubio-global-transition-disabled';
	const selectors = [
		'.h-ui-disable-transitions:not(.h-ui-allow-transitions)',
		'.h-ui-disable-transitions *:not(.h-ui-allow-transitions)',
	].join( ',' );
	document.head.appendChild( style );
	const props = [ 'transition-duration: 0 !important' ].join( ';' );
	style.textContent = `${ selectors } { ${ props } }`;
};

const addRulesOrder = ( rules, nesting = 0, ruleIndex = 0 ) => {
	const result = {};

	if ( ! isObject( rules ) ) {
		return rules;
	}

	Object.keys( rules ).forEach( ( key, index ) => {
		const rule = rules[ key ];

		if ( isObject( rule ) ) {
			result[ key ] = {
				$order: ruleIndex + 1000000 + nesting * 1000 + index,
				...addRulesOrder( rules[ key ], nesting++, ruleIndex ),
			};
		} else {
			result[ key ] = rule;
		}
	} );

	return result;
};

function cssobj( obj, config, state ) {
	config = config || {};

	config.plugins = config.plugins || [];
	config.plugins.push( pluginGenCSS() );

	const local = config.local;

	if ( ! local ) {
		config.local = { space: '' };
	} else {
		config.local = LodashBasic.isObject( local ) ? local : {};
	}

	if ( config.cssom ) {
		config.plugins = [].concat(
			config.plugins || [],
			cssobjKubioCSSOM( config.cssom )
		);
	}

	return cssobjCore( config )( obj, state );
}

const ELEMENT_KEY = 'name';

class StyleManager {
	constructor( options ) {
		const ownerDocument = options.document || window.document;
		this._document = ownerDocument;

		if ( ownerDocument && ownerDocument.defaultView ) {
			this.init( options );
		} else {
			ownerDocument?.defaultView?.addEventListener(
				'DOMContentLoaded',
				() => {
					this.init( options );
				}
			);
		}
	}

	init( options ) {
		const sheets = {};
		const mediasById = get( options, 'mediasById', {} );

		const render = get( options, 'render', true );
		const ownerDocument = options.document || window.document;

		this.cache = {};
		ownerDocument.body.parentElement.id = 'kubio';

		const insertAfter = ownerDocument.querySelector( '#dev-css' );

		const globalStyle = merge( {}, options.globalStyles );

		// const rulesBySheet = {};

		const parts = [ 'global', 'shared', 'local', 'dynamic' ];

		this.dirtySheets = [];

		documentAddDisableTransitionClasses( ownerDocument );

		Object.keys( mediasById ).forEach( ( media ) => {
			sheets[ media ] = {};
			parts.forEach( ( part ) => {
				const query = mediasById[ media ].query;
				const cssObjOptions = {
					local: false,
				};

				if ( render ) {
					const styleId = 'kubio-style-' + media + '-' + part;
					const style = ownerDocument.createElement( 'style' );
					style.setAttribute( 'id', styleId );

					// remove existing styles
					ownerDocument.querySelector( `#${ styleId }` )?.remove();

					if ( insertAfter ) {
						insertAfter.parentNode.insertBefore(
							style,
							insertAfter
						);
					} else {
						ownerDocument.head.appendChild( style );
					}

					cssObjOptions.cssom = {
						id: styleId,
						append: true,
						document: ownerDocument,
						beforePatch: ( diff ) => {
							if ( diff?.size > 10 ) {
								this.toggleTransition( false );
							}
						},
						afterPatch: ( diff ) => {
							if ( diff?.size ) {
								this.toggleTransition( true );
							}
						},
					};
				}

				const obj = cssobj( {}, cssObjOptions );

				if ( query && render ) {
					// eslint-disable-next-line no-undef
					if ( ! ownerDocument.isSameNode( top.document ) ) {
						obj.cssdom.setAttribute(
							'media',
							query.replace( '@media ', '' )
						);
					}
				}

				sheets[ media ][ part ] = obj;
			} );
		} );

		sheets.desktop.global.update( globalStyle );

		this.sheets = sheets;
		this.rulesBySharedRef = new Map();
		this.rulesByLocalId = new Map();
		this.globalRulesById = new Map();
		this.dynamicRulesBySharedRef = new Map();
		this.mediasById = mediasById;

		const baseUpdateRules = this.updateRules.bind( this );

		let initialRenderTimeoutId = null;

		this.updateRules = ( updateRulesOptions = {} ) => {
			clearTimeout( initialRenderTimeoutId );

			if ( updateRulesOptions.callback ) {
				updateRulesOptions.callback();
			}

			initialRenderTimeoutId = setTimeout( () => {
				baseUpdateRules( omit( updateRulesOptions, 'callback' ) );
				this.updateRules = baseUpdateRules;
			}, 300 );
		};
	}

	get document() {
		return this._document;
	}

	get sheets() {
		return this._sheets;
	}

	set sheets( value ) {
		this._sheets = value;
	}

	editorIsInTopFrame() {
		return this.document.isSameNode( top.document );
	}

	setActiveMedia( media ) {
		const prevMedia = this.activeMedia ?? 'desktop';
		this.activeMedia = media;

		if ( prevMedia && prevMedia !== media ) {
			this.forceUpdate();
		}

		Object.keys( this.sheets ).forEach( ( device ) => {
			if ( device === 'desktop' ) return;

			Object.keys( this.sheets[ device ] ).forEach( ( type ) => {
				let disabled = false;
				if ( this.editorIsInTopFrame() ) {
					// the styling is in the same frame as the editor
					disabled = device !== media;
				}

				this.sheets[ device ][ type ].toggleDisable( disabled );
			} );
		} );
	}

	toggleTransition( enable = true ) {
		const classHolder = this.document.querySelector( 'body' );
		if ( ! this.enableTransitionDebounced ) {
			this.enableTransitionDebounced = debounce( () => {
				classHolder?.classList?.remove?.( 'h-ui-disable-transitions' );
			}, 300 );
		}
		if ( enable ) {
			const reqFrame = this.document?.defaultView?.requestAnimationFrame
				? this.document.defaultView.requestAnimationFrame
				: ( cb ) => cb;

			reqFrame( () => {
				if (
					classHolder?.classList?.contains?.(
						'h-ui-disable-transitions'
					)
				) {
					this.enableTransitionDebounced();
				}
			} );
		} else {
			classHolder?.classList?.add?.( 'h-ui-disable-transitions' );
		}
	}

	forceUpdate( options = {} ) {
		this.dirtySheets = [ 'global', 'shared', 'local', 'dynamic' ];
		this.hasPendingChanges = true;
		this.updateRules( {
			...options,
			forced: true,
		} );
	}

	updateSharedRules( sharedStyleRef, cssByMedia ) {
		if (
			! isUndefined( sharedStyleRef ) &&
			! isEqual( this.rulesBySharedRef.get( sharedStyleRef ), cssByMedia )
		) {
			this.rulesBySharedRef.set( sharedStyleRef, cssByMedia );
			this.hasPendingChanges = true;
			this.dirtySheets.push( 'shared' );
		}
	}

	updateLocalRules( localStyleId, cssByMedia ) {
		if (
			! isUndefined( localStyleId ) &&
			! isEqual( this.rulesByLocalId.get( localStyleId ), cssByMedia )
		) {
			this.rulesByLocalId.set( localStyleId, cssByMedia );
			this.hasPendingChanges = true;
			this.dirtySheets.push( 'local' );
		}
	}

	updateDynamicRules( sharedStyleRef, cssByMedia ) {
		if (
			! isUndefined( sharedStyleRef ) &&
			! isEqual(
				this.dynamicRulesBySharedRef.get( sharedStyleRef ),
				cssByMedia
			)
		) {
			this.dynamicRulesBySharedRef.set( sharedStyleRef, cssByMedia );
			this.hasPendingChanges = true;

			this.dirtySheets.push( 'dynamic' );
			if ( sharedStyleRef === 'global' ) {
				this.dirtySheets.push( 'global' );
			}
		}
	}

	updateGlobalRules( id, cssByMedia ) {
		if ( ! isEqual( this.globalRulesById.get( id ), cssByMedia ) ) {
			this.globalRulesById.set( id, cssByMedia );
			this.hasPendingChanges = true;
			this.dirtySheets.push( 'global' );
		}
	}

	/**
	 *
	 * @param {Map}    rules
	 * @param {string} media
	 * @param {string} sheetType
	 * @return {Object} Returns ordered rules
	 */
	mapRules( rules, media, sheetType ) {
		let keys = [ ...rules.keys( rules ) ];

		if ( sheetType === 'shared' || sheetType === 'dynamic' ) {
			const order = [
				...this.document.querySelectorAll( '[data-kubio-style-ref]' ),
			].map( ( e ) => e.getAttribute( 'data-kubio-style-ref' ) );
			keys = [].concat( order, difference( keys, order ) );
		}

		const orderedRules = {};

		keys.forEach( ( key, index ) => {
			const keyRules = rules.get( key )?.[ media ];

			if ( isEmpty( keyRules ) ) {
				return;
			}

			Object.keys( keyRules ).forEach( ( rootSelector ) => {
				orderedRules[ rootSelector ] =
					orderedRules[ rootSelector ] || {};

				if ( isEmpty( keyRules[ rootSelector ] ) ) {
					return;
				}

				const nextRules = addRulesOrder(
					keyRules[ rootSelector ],
					index
				);

				Object.keys( nextRules ).forEach( ( nextRuleKey ) => {
					const nextValue = nextRules[ nextRuleKey ];
					if ( isObject( nextValue ) || isArray( nextValue ) ) {
						orderedRules[ rootSelector ][ nextRuleKey ] = merge(
							orderedRules[ rootSelector ][ nextRuleKey ] || {},
							nextValue
						);
					} else {
						orderedRules[ rootSelector ][ nextRuleKey ] = nextValue;
					}
				} );
			} );
		} );

		return orderedRules;
	}

	updateRules( {
		callback = noop,
		forced = false,
		callbackTimeout = 100,
		forAllMedias = false,
	} = {} ) {
		if ( ! forced && this.hasPendingChanges === false ) {
			callback?.( this.document );
			return;
		}

		// remove instance if the current document is unmounted ( in default editor the iframe is removed when changing from tablet to desktop)
		if ( ! this.document.defaultView ) {
			callback?.( this.document );
			removeManager( this.document );
			return;
		}

		const rulesMapping = {
			shared: this.rulesBySharedRef,
			local: this.rulesByLocalId,
			dynamic: this.dynamicRulesBySharedRef,
			global: this.globalRulesById,
		};

		const dirtySheets = uniq( this.dirtySheets );
		this.dirtySheets = [];

		const allowedDevices = isKubioEditor()
			? [ this.activeMedia || 'desktop' ]
			: [ this.activeMedia, 'desktop' ];

		// update for current media first
		for ( const media in this.mediasById ) {
			if ( forAllMedias || allowedDevices.includes( media ) ) {
				this.updateRulesForMedia(
					media,
					rulesMapping,
					dirtySheets,
					forced
				);
			}
		}

		this.hasPendingChanges = false;

		if ( ! callbackTimeout ) {
			callback?.( this.document );
		} else {
			setTimeout( () => callback?.( this.document ), callbackTimeout );
		}
	}

	updateRulesForMedia( media, rulesMapping, dirtySheets, forced ) {
		for ( const sheetType in rulesMapping ) {
			if ( ! forced ) {
				if ( ! dirtySheets.includes( sheetType ) ) {
					continue;
				}
			}
			const sheetRules = rulesMapping[ sheetType ];
			const rules = this.mapRules( sheetRules, media, sheetType );
			this.sheets[ media ][ sheetType ].update( {} );

			this.sheets[ media ][ sheetType ].update( rules );
			this.sheets[ media ][ sheetType ].renderStyle();
		}
	}
}

const styleManager = ( options ) => {
	if ( options.document && ! options.document.defaultView ) {
		return null;
	}

	return new StyleManager( options );
};

const instancesMap = new Map();

const styleManagerInstance = ( document, inheritParent = true ) => {
	document = document || window.document;
	let instance;

	if ( ! instancesMap.has( document ) ) {
		instance = styleManager( {
			medias: Media.medias,
			mediasById: Media.mediasById,
			document,
		} );

		if ( ! instance ) {
			return null;
		}

		instancesMap.set( document, instance );
		// use parent rules by default - faster initial render for classic themes
		// eslint-disable-next-line no-undef
		const parentInstance = instancesMap.get( top.document );
		if ( inheritParent && parentInstance ) {
			Object.keys( parentInstance ).forEach( ( key ) => {
				// skip private properties ( _* ) and cache, pending changes and functions
				if (
					key.startsWith( '_' ) ||
					key === 'cache' ||
					key === 'hasPendingChanges' ||
					isFunction( parentInstance[ key ] )
				) {
					return;
				}

				instance[ key ] = window.structuredClone(
					parentInstance[ key ]
				);
			} );

			instance.forceUpdate( {
				forAllMedias: true,
				forced: true,
			} );
		}
	} else {
		instance = instancesMap.get( document );
	}

	return instance;
};

const clearManagers = () => {
	instancesMap.clear();
};

const removeManager = ( document ) => {
	instancesMap.delete( document );
};

const updateAllStyleManagers = ( callback = noop ) => {
	let updated = 0;
	const instanceCallback = () => {
		updated++;
		if ( [ ...instancesMap.keys() ].length <= updated ) {
			callback();
		}
	};

	instancesMap.forEach( ( instance ) =>
		instance.forceUpdate( {
			callback: instanceCallback,
			callbackTimeout: 0,
			skipLoadCheck: true,
		} )
	);
};

export {
	ELEMENT_KEY,
	clearManagers,
	cssobj,
	removeManager,
	styleManager,
	styleManagerInstance,
	updateAllStyleManagers,
};
