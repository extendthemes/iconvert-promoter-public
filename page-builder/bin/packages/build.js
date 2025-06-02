/**
 * External dependencies
 */
const path = require( 'path' );
const glob = require( 'fast-glob' );
const ProgressBar = require( 'progress' );
const Minimist = require( 'minimist' );
const { worker, workerFarm } = require( './worker' );
const kubioEnv = require( './env' );
const { logMessage } = require( './logging' );

logMessage( 'Compiling ' + ( kubioEnv.free ? 'FREE' : 'PRO' + ' version' ) );
logMessage( 'Compiling internals: ' + ( kubioEnv.internal ? 'YES' : 'NO' ) );
logMessage( 'Compiling dev: ' + ( kubioEnv.dev ? 'YES' : 'NO' ) );

const argv = Minimist( process.argv.slice( 2 ) );
const files = argv._;

const PACKAGES_DIR = path
	.resolve( __dirname, '../../src/packages' )
	.replace( /\\/gim, '/' );

let onFileComplete = () => {};

let stream;

if ( files.length ) {
	const fixedPaths = files.map( ( file ) => file.replace( /\\/gim, '/' ) );
	stream = glob.stream( fixedPaths, {
		ignore: [
			`**/benchmark/**`,
			`**/{__mocks__,__tests__,test}/**`,
			`**/{storybook,stories}/**`,
			`**/package.json`,
			`**/package-lock.json`,
		],
		onlyFiles: true,
	} );
} else {
	const bar = new ProgressBar( 'Build Progress: [:bar] :percent ☕   ', {
		width: 30,
		incomplete: ' ',
		total: 1,
	} );

	bar.tick( 0 );

	const packageToBuild = '*';

	stream = glob.stream(
		[
			`${ PACKAGES_DIR }/${ packageToBuild }/src/**/*.js`,
			`${ PACKAGES_DIR }/${ packageToBuild }/src/*.scss`,
			`${ PACKAGES_DIR }/${ packageToBuild }/src/**/*.json`,
			`${ PACKAGES_DIR }/${ packageToBuild }/src/**/*.html`,
			`${ PACKAGES_DIR }/${ packageToBuild }/src/**/*.ttf`,
			`${ PACKAGES_DIR }/${ packageToBuild }/src/**/*.woff`,
		],
		{
			ignore: [
				`**/benchmark/**`,
				`**/{__mocks__,__tests__,test}/**`,
				`**/{storybook,stories}/**`,
				`**/package.json`,
				`**/package-lock.json`,
				`**/\\_*.scss`, // ignore scss partials
			],
			onlyFiles: true,
		}
	);

	stream.pause().on( 'data', ( file ) => {
		bar.total = files.push( file );
	} );

	onFileComplete = () => {
		bar.tick();
	};
}

let ended = false,
	complete = 0;

stream
	.on( 'data', ( file ) => {
		worker( file, ( error ) => {
			onFileComplete();

			if ( error ) {
				// If an error occurs, the process can't be ended immediately since
				// other workers are likely pending. Optimally, it would end at the
				// earliest opportunity (after the current round of workers has had
				// the chance to complete), but this is not made directly possible
				// through `worker-farm`. Instead, ensure at least that when the
				// process does exit, it exits with a non-zero code to reflect the
				// fact that an error had occurred.
				process.exitCode = 1;

				console.error( error );
			}

			if ( ended && ++complete === files.length ) {
				workerFarm.end( worker );
			}
		} );
	} )
	.on( 'end', () => ( ended = true ) )
	.resume();
