const fs = require( 'fs' );
const { spawn } = require( 'child_process' );
const path = require( 'path' );
const chalk = require( 'chalk' );
const { sync: resolveBin } = require( 'resolve-bin' );
const chokidar = require( 'chokidar' );
const _ = require( 'lodash' );

const getPackages = require( './get-packages' );
const { worker } = require( './worker' );
const glob = require( 'fast-glob' );
const { logStep, logMessage, logInfo, logError } = require( './logging' );

const isSourceFile = ( filename ) => {
	return (
		! [
			/\/(benchmark|__mocks__|__tests__|test|storybook|stories)\/.+.js$/,
			/.\.(spec|test)\.js$/,
		].some( ( regex ) => regex.test( filename ) ) &&
		/.\.(js|json|scss|html)$/.test( filename )
	);
};

const getJSFiles = ( files ) => {
	return files.filter( ( file ) => file.match( /\.js$/ ) );
};

const eslintCheck = ( files ) => {
	return new Promise( ( resolve ) => {
		const proc = spawn(
			'node',
			[
				resolveBin( 'eslint' ),
				'-c',
				path.resolve( __dirname, 'watch.eslint.js' ),
				...files,
			],
			{
				stdio: [ 0, 1, 2 ],
			}
		);

		proc.stdout = process.stdout;
		proc.stderr = process.stderr;

		proc.on( 'close', ( code ) => {
			if ( parseInt( code ) === 0 ) {
				resolve();
			} else {
				resolve();
			}
		} );
	} );
};

let isBuilding = false;
let filesToBuild = [];

const buildFiles = async ( files ) => {
	return new Promise( ( resolve, reject ) => {
		logStep( 'Build Files' );

		let builtFiles = 0;

		files.forEach( ( file ) =>
			worker( file, ( error ) => {
				logMessage( 'Built:', file );

				builtFiles++;

				if ( builtFiles === files.length ) {
					logInfo( `${ files.length } file(s) built` );
					resolve();
				}

				if ( error ) {
					logError( 'Build worker error', error );
					reject();
				}
			} )
		);
	} );
};

const chunkFiles = 20;
const build = async () => {
	if ( isBuilding ) {
		setTimeout( build, 1000 );
		return;
	}

	const files = filesToBuild;

	if ( files.length ) {
		isBuilding = true;

		filesToBuild = [];
		const jsFiles = getJSFiles( files );
		const chunks = Math.ceil( files.length / chunkFiles );

		logInfo( `${ files.length } files to build ( ${ chunks } chunks )` );

		if ( jsFiles.length ) {
			if ( jsFiles.length > 5 ) {
				logMessage(
					`Skip eslint check. There are more than 5 js files`
				);
			} else {
				logStep( `Running eslint on ${ jsFiles.length } file(s)` );
				try {
					await eslintCheck( jsFiles );
				} catch ( e ) {
					logError(
						`Build was paused due eslint errors`.toUpperCase()
					);
					isBuilding = false;
				}
			}
		}

		let currentChunk = 0;
		while ( files.length ) {
			currentChunk++;
			logMessage( `Build chunk: ${ currentChunk } / ${ chunks }` );
			const chunk = files.splice( 0, chunkFiles );
			try {
				await buildFiles( chunk );
			} catch ( e ) {
				isBuilding = false;
				logError(
					`Failed building chunk:  ${ currentChunk } / ${ chunks }`.toUpperCase(),
					chunk
				);
				return;
			}
		}

		logMessage( 'Built ⚒️' );
		logStep( 'Waiting for webpack...' );
		isBuilding = false;
		// try another build - maybe new files were added to stack
		throttledBuild();
	}
};

const throttledBuild = _.throttle( build, 100 );

const rebuild = ( filename ) => {
	logInfo( 'Change detected. Prepare rebuild' );

	filename = filename.replace( /\\/gim, '/' );

	const index = filesToBuild.indexOf( filesToBuild );
	if ( index !== -1 ) {
		filesToBuild.splice( index, 1 );
	}
	filesToBuild.push( filename );

	throttledBuild();
};

const rebuildFiles = ( files ) => {
	logMessage( 'Multiple files changes detected. Prepare rebuild' );

	files.forEach( ( filename ) => {
		filename = filename.replace( /\\/gim, '/' );

		const index = filesToBuild.indexOf( filesToBuild );
		if ( index !== -1 ) {
			filesToBuild.splice( index, 1 );
		}
		filesToBuild.push( filename );
	} );

	throttledBuild();
};

// One-liner for current directory

const watchPaths = getPackages().map( ( p ) => {
	return path.resolve( p, 'src' );
} );

const onFileChange = async ( filePath ) => {
	if ( ! isSourceFile( filePath ) ) {
		return;
	}
	const packageSrc = filePath
		.replace( /packages(.*)src(.*)/gim, 'packages$1src' )
		.replace( /\\/gim, '/' );

	if ( filePath.match( /\.json$/ ) ) {
		logInfo(
			'JSON File Change detected. Prepare package js files rebuild.'
		);
		const files = await glob(
			[ `${ packageSrc }/**/*.js`, `${ packageSrc }/**/*.json` ],
			{
				ignore: [
					`**/benchmark/**`,
					`**/{__mocks__,__tests__,test}/**`,
					`**/{storybook,stories}/**`,
					`**/package.json`,
					`**/package-lock.json`,
				],
				onlyFiles: true,
			}
		);
		rebuildFiles( files );
	} else if ( filePath.match( /\.(sc|sa|c)ss$/ ) ) {
		logInfo( 'SCSS File Change detected. Prepare package styles rebuild.' );
		const sassFiles = fs
			.readdirSync( packageSrc )
			.filter(
				( f ) =>
					/\.(sc|sa|c)ss$/.test( f ) &&
					path.basename( f ).indexOf( '_' ) !== 0
			)
			.map( ( f ) => `${ packageSrc }${ path.sep }${ f }` );
		rebuildFiles( sassFiles );
	} else {
		rebuild( filePath );
	}
};

const onFileRemoved = ( filePath ) => {
	console.log( chalk.green( '-> Removed: ' ), filePath );

	const buildFile = filePath.replace(
		/packages(.*)src(.*)/gim,
		'packages$1build$2'
	);

	try {
		if ( fs.existsSync( buildFile ) ) {
			fs.unlinkSync( buildFile );
			logMessage( `Built file deleted: ${ buildFile }` );
		}
	} catch ( e ) {
		logError( `Built file delete failed: ${ buildFile }` );
	}
};

logStep( 'Start watcher' );
chokidar
	.watch( watchPaths, {
		interval: 100,
		ignoreInitial: true,
		awaitWriteFinish: {
			stabilityThreshold: 2000,
			pollInterval: 100,
		},
	} )
	.on( 'add', onFileChange )
	.on( 'change', onFileChange )
	.on( 'unlink', onFileRemoved );
