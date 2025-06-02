'use strict';

// helper functions for cssobj

// check n is numeric, or string of numeric

function own( o, k ) {
	return {}.hasOwnProperty.call( o, k );
}

// set default option (not deeply)
function defaults( options, defaultOption ) {
	options = options || {};
	for ( const i in defaultOption ) {
		if ( own( defaultOption, i ) && ! ( i in options ) )
			options[ i ] = defaultOption[ i ];
	}
	return options;
}

// convert js prop into css prop (dashified)
function dashify( str ) {
	return str.replace( /[A-Z]/g, function ( m ) {
		return '-' + m.toLowerCase();
	} );
}

// capitalize str

// repeat str for num times

// random string, should used across all cssobj plugins

// extend obj from source, if it's no key in obj, create one

// ensure obj[k] as array, then push v into it

// replace find in str, with rep function result

// get parents array from node (when it's passed the test)

// split selector with comma, aware of css attributes

// split selector with splitter, aware of css attributes

// split char aware of syntax

// checking for valid css value

// plugin for cssobj

const msVendor = /^ms/;

/**
 * dashify with vendor prefix, make 'msProp' into 'MsProp' first
 *
 * @param {string} prop the css property
 * @return {string} dashified property
 */
function dashifyWithVendor( prop ) {
	prop = msVendor.test( prop ) ? prop.replace( msVendor, 'Ms' ) : prop;
	return dashify( prop );
}

function cssobj_plugin_gencss( option ) {
	option = defaults( option, {
		indent: '  ',
		initIndent: '',
		newLine: '\n',
	} );

	const initIndent = option.initIndent;
	const newLine = option.newLine;
	const indentStr = option.indent;

	return {
		post( result ) {
			const str = [];
			const walk = function ( node, indent ) {
				if ( ! node ) return '';

				// cssobj generate vanilla Array, it's safe to use constructor, fast
				if ( node.constructor === Array )
					return node.map( function ( v ) {
						walk( v, indent );
					} );

				if ( node.key && node.key.charAt( 0 ) == '$' ) return '';

				// nested media rule will pending proceed
				if ( node.at == 'media' && node.selParent && ! node.pending ) {
					node.pending = true;
					return node.selParent.postArr.push( node );
				}
				delete node.pending;

				const prop = node.prop;
				const selText = node.selTextPart;
				const groupText = node.groupText;

				if ( ! prop ) return;

				// child node (but not "" key) will add indent
				if ( node.parentRule && ! node.ruleNode && ! node.selParent )
					indent += indentStr;

				// media node will reset indent
				if ( node.at == 'media' ) indent = initIndent;

				node.postArr = [];
				const children = node.children;
				const isGroup = node.type == 'group';

				// groupNode if have selText, add indent
				const indent2 =
					selText && isGroup ? indent + indentStr : indent;

				// node have not any selector will have no indent in cssText, else add indent in prop
				const indent3 =
					! selText && ! groupText ? initIndent : indent2 + indentStr;

				// get cssText from prop
				const cssText = Object.keys( prop )
					.map( function ( k ) {
						if ( k.charAt( 0 ) == '$' ) return '';
						for ( var v, str = '', i = prop[ k ].length; i--;  ) {
							v = prop[ k ][ i ];
							str +=
								indent3 +
								( node.inline
									? node.selText + ' ' + k + ';'
									: dashifyWithVendor( k ) +
									  ': ' +
									  v +
									  ';' ) +
								newLine;
						}
						return str;
					} )
					.join( '' );

				if ( isGroup ) {
					str.push( indent + groupText + ' {' + newLine );
				}

				if ( cssText )
					str.push(
						selText
							? indent2 +
									( node.inline
										? cssText
										: selText +
										  ' {' +
										  newLine +
										  cssText +
										  indent2 +
										  '}' +
										  newLine )
							: cssText
					);

				for ( const c in children ) {
					// empty key will pending proceed
					if ( c === '' ) node.postArr.push( children[ c ] );
					else walk( children[ c ], indent );
				}

				if ( isGroup ) {
					str.push( indent + '}' + newLine );
				}

				// media rules need a stand alone block
				node.postArr.map( function ( v ) {
					walk( v, indent );
				} );
				delete node.postArr;
			};

			if ( ! result.genCSS ) {
				result.genCSS = ( root ) => {
					walk( root || result.root, initIndent );
					return str.join( '' );
				};
			}

			return result;
		},
	};
}

export default cssobj_plugin_gencss;
