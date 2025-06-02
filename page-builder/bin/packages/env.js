const argv = require( 'minimist' )( process.argv.slice( 2 ) );
const { castArray } = require( 'lodash' );
const { resolve } = require( 'path' );
const dotenvParseVariables = require( 'dotenv-parse-variables' );
const pluginConfig = require( '../../plugin.config.json' );

const fileEnv = require( 'dotenv' ).config( {
	path: resolve( process.cwd(), '../.env' ),
} ).parsed;

// console.log(fileEnv);

// load and parse dotEnv
const parsedEnv = dotenvParseVariables( {
	...process.env,
	...fileEnv,
} );

Object.entries( parsedEnv ).forEach( ( [ key, value ] ) => {
	process.env[ key ] = value;
} );

// use direct parameter or webpack --env parameter
argv.free =
	argv.hasOwnProperty( 'free' ) || castArray( argv.env ).includes( 'free' );
argv.internal =
	argv.hasOwnProperty( 'internal' ) ||
	castArray( argv.env ).includes( 'internal' );

let ENV = {
	live: !! argv.live,
	pro: ! argv.free,
	free: !! argv.free,
	internal: !! argv.internal,
	dev: process.env.NODE_ENV !== 'production',
};

if ( parsedEnv.hasOwnProperty( 'IS_PRO' ) ) {
	ENV.pro = parsedEnv.IS_PRO;
	ENV.free = ! parsedEnv.IS_PRO;
}

if ( ! parsedEnv.hasOwnProperty( 'WITH_INTERNALS' ) ) {
	process.env.internal = parsedEnv.WITH_INTERNALS;
}

ENV = {
	...ENV,
	all: true, // ?? dont know what this does
	// extended
	NODE_ENV: process.env.NODE_ENV || 'development',
	IS_PRO: ENV.pro,
	IS_FREE: ENV.free,
	WITH_INTERNALS: ENV.internal,
	AI_INTERNALS: parsedEnv.AI_INTERNALS,
	CLOUD_INTERNALS: parsedEnv.CLOUD_INTERNALS,
	ENABLE_PREFERENCES_MODAL: parsedEnv.ENABLE_PREFERENCES_MODAL || false,
	KUBIO_BLOCK_PREFIX: parsedEnv.KUBIO_BLOCK_PREFIX,
	KUBIO_PACKAGE_PREFIX: `@${ parsedEnv.KUBIO_BLOCK_PREFIX }`,
	GENERAL_CSS_PREFIX_SELECTOR: parsedEnv.GENERAL_CSS_PREFIX_SELECTOR,
};

if ( process.env.kubioEnv ) {
	ENV = JSON.parse( process.env.kubioEnv );
}

// console.log(ENV);
// process.exit();

module.exports = ENV;
