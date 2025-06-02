/**
 *  Modified in Kubio to accept a document element beside  an iframe window
 *
 */

import { assign, isString, objGetObj, random } from 'cssobj-helper';
import { difference, isEmpty, kebabCase, last, noop } from 'lodash';
import isEqual from 'react-fast-compare';

window.requestIdleCallback =
	window.requestIdleCallback ||
	function ( cb ) {
		const start = Date.now();
		return setTimeout( function () {
			cb( {
				didTimeout: false,
				timeRemaining() {
					return Math.max( 0, 50 - ( Date.now() - start ) );
				},
			} );
		}, 1 );
	};

window.cancelIdleCallback =
	window.cancelIdleCallback ||
	function ( id ) {
		clearTimeout( id );
	};

const createDOM = ( rootDoc, id, option, beforeEl ) => {
	let el = rootDoc.getElementById( id );
	let head = rootDoc.head;

	if ( rootDoc.ownerDocument !== top ) {
		head = rootDoc.body;
	}

	if ( el ) {
		if ( option.append ) {
			return el;
		}
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
	}
	el = rootDoc.createElement( 'style' );

	if ( beforeEl ) {
		beforeEl.after( el );
	} else {
		head.appendChild( el );
	}

	el.setAttribute( 'id', id );

	if ( option.attrs ) {
		for ( const i in option.attrs ) {
			el.setAttribute( i, option.attrs[ i ] );
		}
	}

	return el;
};

const kebabCaseProp = ( prop ) => {
	if ( ! isString( prop ) ) {
		return prop;
	}

	return prop.startsWith( '--' )
		? `--${ kebabCase( prop ) }`
		: kebabCase( prop );
};

const propertyValueToParts = ( value ) => {
	let priority = '';
	if ( isString( value ) ) {
		value = value.trim();
		
		const importantString = '!important';
		priority =
			value.toLowerCase().endsWith(importantString)
				? 'important'
				: '';

		if ( priority ) {
			value = value.slice( 0, -1* importantString.length).trim();
		}
	}

	return { value, priority };
};

const stringifyProps = ( props ) =>
	Object.keys( props )
		.map( ( key ) => `${ kebabCaseProp( key ) }:${ props[ key ] }` )
		.join( ';' );

const stringifyRule = ( rule ) => {
	if ( isString( rule ) ) {
		return rule;
	}

	const selText = rule.selText.replaceAll( '@body', '' );

	const propsString = stringifyProps( rule.cssProps );
	return `${ selText }{${ propsString }}`;
};

const getCSSStyleDeclarationSetProperties = ( style ) => {
	let i = 0;
	const rules = [];
	while ( style[ i ] ) {
		rules.push( style[ i ] );
		i++;
	}

	return rules;
};

const nodesToRules = ( node ) => {
	const { children, selText, prop } = node;
	let result = [];

	if ( selText ) {
		const cssProps = Object.keys( prop ).reduce( ( acc, key ) => {
			if ( key.charAt( 0 ) === '$' || key.startsWith( 'ms' ) ) {
				return acc;
			}

			// const propValue = prop[ key ].pop();
			const propValue = last( prop[ key ] );

			if ( propValue !== '' && propValue !== undefined ) {
				return {
					...acc,
					[ key ]: propValue,
				};
			}

			return acc;
		}, {} );

		if ( ! isEmpty( cssProps ) ) {
			result.push( {
				selText,
				cssProps,
			} );
		}
	}

	const childrenArray = Array.isArray( children )
		? children
		: Object.values( children );

	childrenArray.forEach( ( child ) => {
		result = result.concat( nodesToRules( child ) );
	} );

	return result;
};

/**
 *
 * @param {CSSStyleSheet} sheet
 * @param {number}        ruleIndex
 * @param {Object}        payload
 */
const applyRuleDiff = ( sheet, ruleIndex, payload ) => {
	const rule = sheet.cssRules[ ruleIndex ];
	if ( ! rule ) {
		throw 'Rule does not exists';
	}

	// update only changed props
	payload.forEach( ( { key, action, value: rawValue } ) => {
		const cssProp = kebabCaseProp( key );

		switch ( action ) {
			case 'DELETE':
				rule.style.removeProperty( cssProp );
				break;
			case 'SET':
				const { value, priority } = propertyValueToParts( rawValue );
				rule.style.setProperty( cssProp, value, priority );
				break;
		}
	} );
};

/**
 *
 * @param {CSSStyleSheet} sheet
 * @param {*}             diff
 */
const applyDiff = ( sheet, diff ) => {
	diff.forEach( ( { action, index, payload } ) => {
		switch ( action ) {
			case 'DELETE':
				sheet.deleteRule( index );
				break;
			case 'ADD':
				try {
					sheet.insertRule( stringifyRule( payload ), index );
				} catch ( e ) {
					// eslint-disable-next-line no-console
					console.error( e );
				}
				break;
			case 'UPDATE':
				try {
					applyRuleDiff( sheet, index, payload );
				} catch ( e ) {
					// eslint-disable-next-line no-console
					console.error( e, { action, index, payload, sheet } );
				}
				break;
			case 'REPLACE':
				sheet.deleteRule( index );
				sheet.insertRule( stringifyRule( payload ), index );
				break;
		}
	} );
};

const diffRule = ( nextRules, previousRules, index ) => {
	const nextRule = nextRules[ index ];
	const previousRule = previousRules[ index ];

	const result = [];

	Object.keys( previousRule.cssProps ).forEach( ( key ) => {
		if ( ! nextRule.cssProps.hasOwnProperty( key ) ) {
			result.push( {
				key,
				action: 'DELETE',
				value: null,
			} );
		}
	} );

	Object.keys( nextRule.cssProps ).forEach( ( key ) => {
		const nextValue = nextRule.cssProps[ key ];
		const prevValue = previousRule.cssProps[ key ];

		if ( nextValue !== prevValue ) {
			result.push( {
				key,
				action: 'SET',
				value: nextValue,
			} );
		}
	} );

	return result;
};

/**
 *
 * @param {*} nextRules
 * @param {*} prevRules
 */
const diffRules = ( nextRules, prevRules ) => {
	const result = new Set();

	const minLength = Math.min( nextRules.length, prevRules.length );

	for ( let i = 0; i < minLength; i++ ) {
		const nextSelector = nextRules[ i ].selText;
		const prevSelector = prevRules[ i ].selText;

		// if the selector is different we need to replace the rule entirely
		if ( nextSelector !== prevSelector ) {
			result.add( {
				action: 'REPLACE',
				index: i,
				payload: nextRules[ i ],
			} );

			continue;
		}

		const ruleDiff = diffRule( nextRules, prevRules, i );
		if ( ruleDiff.length ) {
			result.add( {
				action: 'UPDATE',
				index: i,
				payload: ruleDiff,
			} );
		}
	}

	// next rules is shorter than the previous one so we need to remove some rules
	// delete the rules in reverse order from highest to lowest index
	if ( prevRules.length > nextRules.length ) {
		for ( let i = prevRules.length - 1; i >= nextRules.length; i-- ) {
			result.add( {
				action: 'DELETE',
				index: i,
				payload: null,
			} );
		}
	}

	// next rules is longer than the previous one so we need to add some rules
	if ( nextRules.length > prevRules.length ) {
		for ( let i = prevRules.length; i < nextRules.length; i++ ) {
			result.add( {
				action: 'ADD',
				index: i,
				payload: nextRules[ i ],
			} );
		}
	}

	return result;
};

const recreateDom = ( result ) => {
	const cssdom = result.cssdom;
	if (
		! cssdom?.ownerDocument?.contains?.( cssdom ) &&
		cssdom?.ownerDocument?.defaultView
	) {
		result.prevRules = [];
		result.cssdom = createDOM( cssdom.ownerDocument, cssdom.id, {
			attrs: {
				media: cssdom.getAttribute( 'media' ) || 'all',
			},
		} );
	}
};

const updateCSSFromRoot = ( result, root, options ) => {
	const nextRules = nodesToRules( root );
	const prevRules = options.forceRender
		? []
		: [ ...( result.prevRules || [] ) ];
	const diff = diffRules( nextRules, prevRules );

	result.prevRules = [ ...nextRules ];

	if ( result.cssdom.sheet ) {
		if ( options.forceRender ) {
			while ( result.cssdom.sheet.cssRules.length ) {
				result.cssdom.sheet.deleteRule( 0 );
			}
		}

		options?.beforePatch?.( diff, nextRules, prevRules );

		if ( result.cssdom.sheet.length === 0 ) {
			result.cssdom.textContent = result.genCSS();
		} else {
			applyDiff( result.cssdom.sheet, diff );
		}

		window.requestIdleCallback( () => {
			options?.afterPatch?.( diff, nextRules, prevRules );
		} );
	} else {
		// eslint-disable-next-line no-console
		console.error( 'CSS Sheet not found', {
			domEl: result?.cssdom,
			document: result?.cssdom?.ownerDocument,
		} );
	}
};

const cssobjKubioCSSom = ( option ) => {
	option = option || {};

	const id = option.id || 'cssobj' + random();

	const frame = option.frame;
	let rootDoc = frame
		? frame.contentDocument || frame.contentWindow.document
		: document;
	rootDoc = option.document ? option.document : rootDoc;
	const dom = createDOM( rootDoc, id, option );

	return {
		post( result ) {
			result.set = function ( cssPath, newObj ) {
				const path = Array.isArray( cssPath ) ? cssPath : [ cssPath ];
				let srcObj = result.obj;
				if ( isString( path[ 0 ] ) && path[ 0 ][ 0 ] === '$' ) {
					srcObj = result.ref[ path.shift().slice( 1 ) ].obj;
				}
				const ret = objGetObj( srcObj, path );
				if ( ret.ok ) {
					assign( ret.obj, newObj );
				}
				result.update();
			};

			result.cssdom = dom;
			result.prevRules = result.prevRules || [];

			if ( ! result.cssdom?.sheet ) {
				recreateDom( result );
			}

			if ( ! result.renderStyle ) {
				result.renderStyle = function () {
					const res = this;

					if ( result.disabledDom ) {
						return;
					}

					const patchOptions = {
						beforePatch: option?.beforePatch || noop,
						afterPatch: option?.afterPatch || noop,
					};
					updateCSSFromRoot( res, res.root, patchOptions );
				};
			}

			if ( ! result.renderForced ) {
				result.renderForced = function () {
					const res = this;

					const patchOptions = {
						beforePatch: option?.beforePatch || noop,
						afterPatch: option?.afterPatch || noop,
					};
					updateCSSFromRoot( res, res.root, {
						...patchOptions,
						forceRender: true,
					} );
				};
			}

			if ( ! result.toggleDisable ) {
				result.toggleDisable = ( disableValue ) => {
					if ( result.disabledDom === disableValue ) {
						return;
					}

					result.disabledDom = disableValue;
					if ( result.cssdom?.sheet ) {
						result.cssdom.disabled = disableValue;
						result.cssdom.sheet.disabled = disableValue;
					}
					if ( ! disableValue ) {
						result.renderStyle();
					}
				};
			}

			return result;
		},
	};
};

export default cssobjKubioCSSom;
