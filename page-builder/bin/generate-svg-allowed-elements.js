const glob = require( 'fast-glob' );

const files = glob.sync( [ `./static/**/*.svg` ] );
const fs = require( 'fs' );
const { execSync } = require( 'child_process' );
const html2json = require( 'html2json' ).html2json;

let allowedHTML = {};

const flatten = ( nodes ) => {
	const result = {};

	for ( let i = 0; i < nodes.length; i++ ) {
		const node = nodes[ i ];

		if ( node.node === 'element' ) {
			result[ node.tag ] = result[ node.tag ] || {};
			result[ node.tag ] = {
				...result[ node.tag ],
				...Object.keys( node.attr || {} ).reduce(
					( acc, attr ) => ( {
						...acc,
						[ attr.toLowerCase() ]: true,
					} ),
					{}
				),
			};

			const flattenChildren = flatten( node.child || [] );

			Object.keys( flattenChildren ).forEach( ( tag ) => {
				result[ tag ] = result[ tag ] || {};
				result[ tag ] = {
					...result[ tag ],
					...flattenChildren[ tag ],
				};
			} );
		}
	}

	return result;
};

files.forEach( ( file ) => {
	const content = fs.readFileSync( file, { encoding: 'utf8', flag: 'r' } );
	const nodes = html2json( content );
	const data = flatten( nodes.child );
	Object.keys( data ).forEach( ( tag ) => {
		allowedHTML[ tag ] = allowedHTML[ tag ] || {};
		allowedHTML[ tag ] = {
			...allowedHTML[ tag ],
			...data[ tag ],
		};
	} );
} );

allowedHTML = JSON.parse( JSON.stringify( allowedHTML ) );

Object.keys( allowedHTML ).forEach( ( key ) =>
	( allowedHTML[ key ] = Object.keys( allowedHTML[ key ] ) ).filter(
		( _key ) =>
			_key !== 'id' || _key !== 'class' || _key.indexOf( 'data-' ) !== 0
	)
);

const output = execSync(
	"php -r var_export(json_decode(base64_decode('" +
		Buffer.from( JSON.stringify( allowedHTML ) ).toString( 'base64' ) +
		"'),true));"
).toString();

console.log( output.replace( /\d+\s?=>/gim, '' ) );
