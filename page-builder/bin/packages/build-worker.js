const { promisify } = require( 'util' );
const fs = require( 'fs' );
const path = require( 'path' );
const babel = require( '@babel/core' );
const makeDir = require( 'make-dir' );
const sass = require( 'sass' );
const postcss = require( 'postcss' );
const nodeModuleImporter = require( 'node-sass-package-importer' );
const magicImporter = require( 'node-sass-magic-importer/dist/toolbox' );
const conditionalLoader = require( './conditional-loader' );
const kubioEnv = require( './env' );

const getBabelConfig = require( './get-babel-config' );
const comments = require( 'postcss-discard-comments' );

const PACKAGES_DIR = path.resolve( __dirname, '../../src/packages' );

const JS_ENVIRONMENTS = {
	main: 'build',
	module: 'build-module',
};

const readFile = promisify( fs.readFile );

const writeFile = promisify( fs.writeFile );

const copyFile = promisify( fs.copyFile );

const mkdirIfNotExists = ( toCreate ) => {
	return new Promise( ( resolve ) => {
		const pathExists = fs.existsSync( toCreate );
		if ( ! pathExists ) {
			fs.mkdirSync( toCreate, { recursive: true } );
		}
		resolve();
	} );
};

const renderSass = promisify( sass.render );
const kubioRelativePath = '../lib/kubio';

const KUBIO_PACKAGES_DIR = path.resolve(
	__dirname,
	`../../${ kubioRelativePath }/src/packages`
);
function getPackageName( file ) {
	return path.relative( PACKAGES_DIR, file ).split( path.sep )[ 0 ];
}

function getBuildPath( file, buildFolder ) {
	const pkgName = getPackageName( file );
	const pkgSrcPath = path.resolve( PACKAGES_DIR, pkgName, 'src' );
	const pkgBuildPath = path.resolve( PACKAGES_DIR, pkgName, buildFolder );
	const relativeToSrcPath = path.relative( pkgSrcPath, file );
	return path.resolve( pkgBuildPath, relativeToSrcPath );
}

const packageImporter = ( url ) => {
	//'(^~@kubio)'
	let cleanedUrl;

	const csPromoRegex = `/(^~${ kubioEnv.KUBIO_PACKAGE_PREFIX })/`;
	const csPromoCatchPackageUrl = new RegExp( csPromoRegex, 'gim' );

	//Check if scss imports from cspromo folder
	if ( url.match( csPromoCatchPackageUrl ) ) {
		cleanedUrl = url.replace(
			csPromoCatchPackageUrl,
			path.resolve( PACKAGES_DIR )
		);
	}

	const kubioRegex = '(~@kubio)';
	const kubioRegexCatchPackageUrl = new RegExp( kubioRegex, 'gim' );
	if ( url.match( kubioRegexCatchPackageUrl ) ) {
		cleanedUrl = url.replace(
			kubioRegexCatchPackageUrl,
			KUBIO_PACKAGES_DIR
		);
	}

	if ( ! cleanedUrl ) {
		return null;
	}
	const file = magicImporter.resolveUrl( cleanedUrl, [
		'.scss',
		'.sass',
		'.css',
	] );

	if ( ! file ) {
		return null;
	}
	if ( /\.css$/.test( file ) ) {
		return { contents: fs.readFileSync( file, 'utf-8' ) };
	}
	return { file: file.replace( /\.css$/, `` ) };
};

const BUILD_TASK_BY_EXTENSION = {
	async '.scss'( file ) {
		const outputFile = getBuildPath(
			file.replace( '.scss', '.css' ),
			'build-style'
		);
		// const outputFileRTL = getBuildPath(
		// 	file.replace('.scss', '-rtl.css'),
		// 	'build-style'
		// );

		const [ , contents ] = await Promise.all( [
			makeDir( path.dirname( outputFile ) ),
			readFile( file, 'utf8' ),
		] );

		const scssContent = conditionalLoader(
			contents,
			// IS_BUILDING_KUBIO_THEME is used when building a kubio exported theme to exclude some js functionalities
			{ IS_BUILDING_KUBIO_THEME: false, ...kubioEnv },
			( msg ) => {
				console.error( msg );
			}
		);

		const pkgName = getPackageName( file );

		const sourceMapRoot = `./../../src/packages/${ pkgName }/src/`;
		const baseStylePath = path.join( KUBIO_PACKAGES_DIR, 'base-styles' );
		const builtSass = await renderSass( {
			file,
			importer: [ packageImporter, nodeModuleImporter() ],
			includePaths: [ baseStylePath ],
			data:
				'@use "sass:math";' +
				[
					'wordpress-imports',
					'variables',
					'bem',
					'mixins',
					'bootstrap-mixins-and-functions',
				]
					// Editor styles should be excluded from the default CSS vars output.
					.map( ( imported ) => `@import "${ imported }";` )
					.join( ' ' ) +
				scssContent,
			outFile: path.resolve( PACKAGES_DIR, pkgName, 'src', 'style.css' ),
			sourceMap: kubioEnv.dev,
			sourceMapEmbed: kubioEnv.dev,
			sourceMapRoot,
		} );

		const result = await postcss(
			require( '@wordpress/postcss-plugins-preset' ).concat( [
				comments( { removeAll: true } ),
			] )
		).process( builtSass.css, {
			from: 'src/app.css',
			to: 'dest/app.css',
		} );

		// const resultRTL = await postcss([require('rtlcss')()]).process(
		// 	result.css,
		// 	{
		// 		from: 'src/app.css',
		// 		to: 'dest/app.css',
		// 	}
		// );

		await Promise.all( [
			writeFile( outputFile, result.css ),
			//writeFile(outputFileRTL, resultRTL.css),
		] );
	},

	async '.js'( file ) {
		for ( const [ environment, buildDir ] of Object.entries(
			JS_ENVIRONMENTS
		) ) {
			const destPath = getBuildPath( file, buildDir );
			let babelOptions = getBabelConfig(
				environment,
				file.replace( PACKAGES_DIR, kubioEnv.KUBIO_PACKAGE_PREFIX )
			);

			babelOptions = {
				...babelOptions,
				filename: file,
			};

			if ( ! kubioEnv.dev ) {
				babelOptions = {
					...babelOptions,
					sourceMaps: false,
				};
			}

			let content = fs.readFileSync( file, 'utf-8' );
			content = conditionalLoader(
				content,
				// IS_BUILDING_KUBIO_THEME is used when building a kubio exported theme to exclude some js functionalities
				{ IS_BUILDING_KUBIO_THEME: false, ...kubioEnv },
				( msg ) => {
					console.error( msg );
				}
			);

			const [ , transformed ] = await Promise.all( [
				makeDir( path.dirname( destPath ) ),
				babel.transformAsync( content, babelOptions ),
			] );

			await Promise.all(
				[
					kubioEnv.dev
						? writeFile(
								destPath + '.map',
								JSON.stringify( transformed.map )
						  )
						: null,
					writeFile(
						destPath,
						! kubioEnv.dev
							? transformed.code
							: transformed.code +
									'\n//# sourceMappingURL=' +
									path.basename( destPath ) +
									'.map'
					),
				].filter( Boolean )
			);
		}
	},

	async '.json'( file ) {
		for ( const [ , buildDir ] of Object.entries( JS_ENVIRONMENTS ) ) {
			const destPath = getBuildPath( file, buildDir );
			await Promise.all( [
				mkdirIfNotExists( path.dirname( destPath ) ),
				copyFile( file, destPath ),
			] );
		}
	},

	async '.html'( file ) {
		for ( const [ , buildDir ] of Object.entries( JS_ENVIRONMENTS ) ) {
			const destPath = getBuildPath( file, buildDir );
			await Promise.all( [
				mkdirIfNotExists( path.dirname( destPath ) ),
				copyFile( file, destPath ),
			] );
		}
	},

	async '.ttf'( file ) {
		for ( const [ , buildDir ] of Object.entries( JS_ENVIRONMENTS ) ) {
			const destPath = getBuildPath( file, buildDir );
			await Promise.all( [
				mkdirIfNotExists( path.dirname( destPath ) ),
				copyFile( file, destPath ),
			] );
		}
	},
	async '.woff'( file ) {
		for ( const [ , buildDir ] of Object.entries( JS_ENVIRONMENTS ) ) {
			const destPath = getBuildPath( file, buildDir );
			await Promise.all( [
				mkdirIfNotExists( path.dirname( destPath ) ),
				copyFile( file, destPath ),
			] );
		}
	},
};

module.exports = async ( file, callback ) => {
	const extension = path.extname( file );
	const task = BUILD_TASK_BY_EXTENSION[ extension ];

	if ( ! task ) {
		return;
	}

	try {
		await task( file );
		callback();
	} catch ( error ) {
		callback( error );
	}
};
