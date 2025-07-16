const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const webpack = require( 'webpack' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const postcss = require( 'postcss' );
const { compact, uniq } = require( 'lodash' );
const { basename } = require( 'path' );
const path = require( 'path' );
const fs = require( 'fs' );

const kubioEnv = require( './bin/packages/env' );

const DependencyExtractionWebpackPlugin = require( './bin/dependency-extraction-webpack-plugin' );
const json2php = require( 'json2php' );

const LiveReloadPlugin = require( 'webpack-livereload-plugin' );
const {
	camelCaseDash,
} = require( './bin/dependency-extraction-webpack-plugin/util' );

const { dependencies } = require( './package' );
const { logMessage, logWarning, logInfo } = require( './bin/packages/logging' );
const { PRO_BLOCKS } = require( './bin/pro-blocks' );

logMessage( 'Compiling ' + ( kubioEnv.free ? 'FREE' : 'PRO' + ' version' ) );
logMessage( 'Compiling internals: ' + ( kubioEnv.internal ? 'YES' : 'NO' ) );
logMessage( 'Compiling dev: ' + ( kubioEnv.dev ? 'YES' : 'NO' ) );

const {
	NODE_ENV: mode = process.argv.indexOf( '--production' ) !== -1
		? 'production'
		: 'development',
	WP_DEVTOOL: devtool = mode === 'development' ? 'source-map' : false,
	LIVE_RELOAD,
	LIVE_RELOAD_SSL,
	LIVE_RELOAD_PORT,
	LIVE_RELOAD_HOSTNAME,
} = process.env;

const KUBIO_NAMESPACE = `${ kubioEnv.KUBIO_PACKAGE_PREFIX }/`;
const IS_WATCHING = process.argv.indexOf( 'watch' ) !== -1;
const IS_PRODUCTION = mode === 'production';

console.log( kubioEnv );
logMessage( 'Webpack mode: ' + mode );

const gutenbergPackages = Object.keys( dependencies )
	.filter(
		( packageName ) =>
			packageName.startsWith( KUBIO_NAMESPACE ) &&
			! packageName.startsWith( KUBIO_NAMESPACE + 'react-native' )
	)
	.map( ( packageName ) => packageName.replace( KUBIO_NAMESPACE, '' ) );

const cssCopyMap = ( packageName ) => ( {
	from: `./src/packages/${ packageName }/build-style/*.css`,
	to: `./build/${ packageName }/`,
	flatten: true,
	noErrorOnMissing: true,
	filter: async ( resourcePath ) => {
		const filename = basename( resourcePath );
		return /(style|editor)(\-rtl)?\.css/.test( filename );
	},
	transform: ( content ) => {
		if ( mode === 'production' ) {
			return postcss( [
				require( 'cssnano' )( {
					preset: [
						'default',
						{
							discardComments: {
								removeAll: true,
							},
						},
					],
				} ),
			] )
				.process( content, {
					from: 'src/app.css',
					to: 'dest/app.css',
				} )
				.then( ( result ) => result.css );
		}
		return content;
	},
} );

const skippedEntries = [ 'base-styles' ];

const exportDefaultPackages = [
	'api-fetch',
	'deprecated',
	'dom-ready',
	'redux-routine',
	'token-list',
	'server-side-render',
	'shortcode',
	'warning',
];

let entry = gutenbergPackages
	.filter( ( item ) => ! skippedEntries.includes( item ) )
	.reduce( ( memo, packageName ) => {
		const name = camelCaseDash( packageName );
		memo[ packageName ] = {
			import: `./src/packages/${ packageName }`,
			library: {
				name: [ kubioEnv.KUBIO_BLOCK_PREFIX, name ],
				type: 'window',
				export: exportDefaultPackages.includes( packageName )
					? 'default'
					: undefined,
			},
		};
		return memo;
	}, {} );

const extraEntryPoints = {
	frontend: './src/packages/block-library/src/frontend',
};

entry = Object.assign( {}, entry, extraEntryPoints );

let blocksManifest = {};
const thirdPartyBlocksSupport = [];

const json2phpPrinter = json2php.make( {
	linebreak: '\n',
	indent: '\t',
	shortArraySyntax: false,
} );
const convertJSONtoPHPArray = ( json ) => {
	const content = json2phpPrinter( JSON.parse( JSON.stringify( json ) ) );
	return `<?php\n\n/** Kubio - automatically generated file **/\n\nreturn ${ content };`;
};

const getBlockName = ( absPath ) =>
	absPath.replace( /\\/gim, '/' ).match( /.*\/(.*?)\/index.php$/i )[ 1 ];

const getBlockRelPath = ( absPath ) =>
	absPath.replace( /\\/gim, '/' ).match( /block-library\/src\/(.*)/i )[ 1 ];

const filterOutProFiles = ( resourcePath ) => {
	if ( kubioEnv.free ) {
		const normalizedPath = resourcePath.replace( /\\/gim, '/' );

		const isPro = PRO_BLOCKS.reduce( ( _isPro, currentBlock ) => {
			return (
				_isPro ||
				normalizedPath.indexOf(
					`block-library/src/${ currentBlock }`
				) !== -1
			);
		}, false );

		if ( isPro && ! IS_WATCHING ) {
			const cwd = process.cwd().replace( /\\/gim, '/' );
			logWarning( `Skipped PRO file:`, resourcePath.replace( cwd, '' ) );
		}

		return ! isPro;
	}

	return true;
};

const KUBIO_ENV = Object.entries( kubioEnv ).reduce(
	( acc, [ key, value ] ) => {
		return {
			...acc,
			[ `KUBIO_ENV.${ key }` ]: value,
		};
	},
	{}
);

const plugins = [
	new webpack.DefinePlugin( KUBIO_ENV ),
	new CopyWebpackPlugin( {
		patterns: [
			...gutenbergPackages.map( cssCopyMap ),
			{
				from: './src/packages/block-library/src/**/*/index.php',
				to: 'build/block-library/blocks/[1]',
				filter: filterOutProFiles,
				transformPath( targetPath, absolutePath ) {
					const blockName = getBlockName( absolutePath );
					const rel = getBlockRelPath( absolutePath );
					blocksManifest[ blockName ] = {
						...( blocksManifest[ blockName ] || {} ),
						rel,
					};

					targetPath = targetPath.replace( '[1]', rel );

					return targetPath;
				},
				transform( content, absolutePath ) {
					content = content.toString();

					const blockName = getBlockName( absolutePath );

					const classes =
						content
							.match( /^class (.*)[^\{|extends]+/gim )
							?.map( ( className ) =>
								className
									.trim()
									.replace( /^class /, '' )
									.trim()
									.match( /(.*?)(\{|extends)/ )[ 1 ]
									.trim()
							) || [];

					blocksManifest[ blockName ] = {
						...( blocksManifest[ blockName ] || {} ),
						classes: uniq( [
							...( blocksManifest[ blockName ]?.classes || [] ),
							...classes,
						] ),
					};

					return ( content.match( /^function [^\(]+/gm ) || [] )
						.reduce( ( result, functionName ) => {
							functionName = functionName.slice( 9 );

							return result.replace(
								new RegExp( functionName, 'g' ),
								( match ) =>
									'kubio_' + match.replace( /^wp_/, '' )
							);
						}, content )
						.replace(
							/(add_action\(\s*'init',\s*'kubio_register_block_[^']+'(?!,))/,
							'$1, 20'
						);
				},
			},
			{
				from: './src/packages/block-library/src/**/*.json',
				to: 'build/block-library/blocks/[1]',
				filter: filterOutProFiles,
				transformPath( targetPath, absolutePath ) {
					const packageName = absolutePath
						.replace( /\\/gim, '/' )
						.match( /block-library\/src\/(.*)/i )[ 1 ];
					return targetPath.replace( '[1]', packageName );
				},
			},
			// {
			// 	from: './src/packages/**/src/style-types.json',
			// 	to: 'build/[1]',
			// 	transformPath( targetPath, absolutePath ) {
			// 		const packageName = absolutePath
			// 			.replace( /\\/gim, '/' )
			// 			.match( /\/src\/packages\/(.*)\/src/i )[ 1 ];

			// 		targetPath = targetPath
			// 			.replace( '[1]', packageName + '/style-types.json' )
			// 			.replace( /\\/gim, '/' );

			// 		return targetPath;
			// 	},
			// },
			// {
			// 	from: './src/packages/third-party-blocks/src/**/*.json',
			// 	to: 'build/third-party-blocks/[1]',
			// 	transformPath( targetPath, absolutePath ) {
			// 		const rel = absolutePath
			// 			.replace( /\\/gim, '/' )
			// 			.match( /third-party-blocks\/src\/(.*)/i )[ 1 ];

			// 		if ( rel.endsWith( 'support.json' ) ) {
			// 			thirdPartyBlocksSupport.push( rel );
			// 		}

			// 		return targetPath.replace( '[1]', rel );
			// 	},
			// },
			// {
			// 	from: './src/packages/**/src/index.php',
			// 	to: 'build/[1]',
			// 	transformPath( targetPath, absolutePath ) {
			// 		const packageName = absolutePath
			// 			.replace( /\\/gim, '/' )
			// 			.match( /\/src\/packages\/(.*)\/src/i )[ 1 ];

			// 		targetPath = targetPath
			// 			.replace( '[1]', packageName + '/index.php' )
			// 			.replace( /\\/gim, '/' );

			// 		return targetPath;
			// 	},
			// },
			// {
			// 	from: 'src/packages/style-manager/src/types/types.json',
			// 	to: 'build/types.json',
			// 	transform( content ) {
			// 		return JSON.stringify( JSON.parse( content ) );
			// 	},
			// },
		],
	} ),

	new DependencyExtractionWebpackPlugin( { injectPolyfill: true } ),
	{
		apply( compiler ) {
			compiler.hooks.afterEmit.tap( 'done', () => {
				const content = convertJSONtoPHPArray( blocksManifest );
				// it's safe to reset the manifest. On each update the copy plugin is looking into all matching files
				blocksManifest = {};
				fs.writeFileSync(
					'build/block-library/blocks-manifest.php',
					content
				);
			} );

			compiler.hooks.afterEmit.tap( 'compile', () => {
				logMessage( 'Webpack compilation started...' );
			} );

			compiler.hooks.done.tap( 'done', () => {
				setTimeout( () => {
					const date = new Date();
					const hour =
						date.getHours().toString().padStart( 2, '0' ) +
						':' +
						date.getMinutes().toString().padStart( 2, '0' ) +
						':' +
						date.getSeconds().toString().padStart( 2, '0' );
					logMessage( 'Webpack compilation done.' );
					logInfo( hour );
				}, 0 );
			} );
		},
	},
	new DependencyExtractionWebpackPlugin( { injectPolyfill: true } ),
	// {
	// 	apply( compiler ) {
	// 		compiler.hooks.afterEmit.tap( 'done', () => {
	// 			const content = convertJSONtoPHPArray(
	// 				thirdPartyBlocksSupport
	// 			);
	// 			// it's safe to reset the manifest. On each update the copy plugin is looking into all matching files
	// 			thirdPartyBlocksSupport = [];
	// 			fs.writeFileSync(
	// 				'build/third-party-blocks/manifest.php',
	// 				content
	// 			);
	// 		} );
	// 	},
	// },
	JSON.parse( LIVE_RELOAD || 'false' )
		? new LiveReloadPlugin( {
				protocol: JSON.parse( LIVE_RELOAD_SSL ) ? 'https' : 'http',
				port: parseInt( LIVE_RELOAD_PORT || 9000 ),
				hostname: LIVE_RELOAD_HOSTNAME || 'localhost',
				useSourceHash: true,
		  } )
		: false,
].filter( Boolean );

module.exports = {
	optimization: {
		// Only concatenate modules in production, when not analyzing bundles.
		concatenateModules: IS_PRODUCTION,
		minimize: IS_PRODUCTION,
		minimizer: [
			new TerserPlugin( {
				//cache: true,
				parallel: true,

				terserOptions: {
					output: {
						comments: /translators:/i,
						beautify: false,
					},
					compress: {
						passes: 2,
					},
					mangle: {
						reserved: [ '__', '_n', '_nx', '_x' ],
					},
					sourceMap: mode !== 'production',
				},
				extractComments: false,
			} ),
		],
	},
	mode,
	entry,
	output: {
		devtoolNamespace: kubioEnv.KUBIO_BLOCK_PREFIX,
		filename: './build/[name]/index.js',
		path: __dirname,
		library: [ kubioEnv.KUBIO_BLOCK_PREFIX, '[name]' ],
		libraryTarget: 'this',
		devtoolModuleFilenameTemplate: ( info ) => {
			if (
				info.resourcePath.includes(
					`/@${ kubioEnv.KUBIO_BLOCK_PREFIX }/`
				)
			) {
				const resourcePath = info.resourcePath.split(
					`/@${ kubioEnv.KUBIO_BLOCK_PREFIX }/`
				)[ 1 ];
				return `./src/packages/${ resourcePath }`;
			}
			return `webpack://${ info.namespace }/${ info.resourcePath }`;
		},
	},
	module: {
		rules: compact( [
			{
				test: /\.(js)$/,
				use: { loader: 'babel-loader' },
				//include: /node_modules/,
				//exclude: /node_modules\/(?!(@wordpress\/interface)\/).*/,
				exclude: [
					path.resolve( __dirname, 'src' ),
					/node_modules\/(?!(@wordpress\/(interface|style-engine))\/).*/,
				],
			},
			! IS_PRODUCTION && {
				test: /\.(js|css)$/,
				use: require.resolve( 'source-map-loader' ),
				enforce: 'pre',
				exclude: path.resolve( __dirname, 'node_modules' ),
			},
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: { loader: 'html-loader' },
			},
			{
				test: /\.mjs$/,
				include: /node_modules/,
				type: 'javascript/auto',
			},
		] ),
	},
	resolve: {
		alias: {},
	},
	plugins,

	watchOptions: {
		ignored: [
			'node_modules',
			'src/packages/*/build-module/**',
			'src/packages/*/build-types/**',
		],
		aggregateTimeout: 500,
	},
	stats: IS_WATCHING ? 'minimal' : undefined,
	devtool,
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
};
