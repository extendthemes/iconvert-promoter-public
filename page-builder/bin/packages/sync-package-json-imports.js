const path = require( 'path' );
const fs = require( 'fs' );
const fg = require( 'fast-glob' );
const { execSync } = require( 'child_process' );

const unique = ( arr ) => {
	const o = {},
		a = [];
	let i, e;
	for ( i = 0; ( e = arr[ i ] ); i++ ) {
		o[ e ] = 1;
	}
	for ( e in o ) {
		a.push( e );
	}
	return a;
};

const PACKAGES_DIR = path
	.resolve( __dirname, '../../src/packages' )
	.replace( /\\/gim, '/' );

const { dependencies, devDependencies } = require( '../../package.json' );

const importsVersion = {};

const skipPackages = [];

console.log(
	'Start syncing for',
	Object.keys( dependencies ).length,
	'packages'
);

Object.keys( dependencies ).forEach( async ( pack ) => {
	let folder = pack.replace( '@kubio/', '' );
	folder = pack.replace( '@cspromo/', '' );
	if ( skipPackages.indexOf( folder ) !== -1 ) {
		console.log( '\tSkipped' );
		return;
	}

	const entries = await fg( [ `${ PACKAGES_DIR }/${ folder }/src/**/*.js` ], {
		onlyFiles: true,
	} );

	console.log( 'Sync package imports for', pack );

	const importsByFile = entries
		.map( ( entry ) => {
			const content = fs.readFileSync( entry );

			const matches = content
				.toString()
				?.match( /^import\s{1,}([^]+?)from\s{1,}(.*?)[\n|;]/gim )
				?.map( ( match ) => {
					return (
						match.match( /from\s{1,}['|"](.*?)['|"]/ )?.[ 1 ] ||
						match
					);
				} )
				.filter( Boolean )
				.filter(
					( match ) =>
						match.indexOf( './' ) === -1 &&
						match.indexOf( '..' ) === -1
				);

			return matches;
		} )
		.filter( Boolean );

	let imports = [];

	importsByFile.forEach( ( fileImports ) => {
		imports = [ ...imports, ...fileImports ];
	} );

	imports = unique( imports );

	imports = imports.map( ( importedPackage ) => {
		if ( importedPackage.indexOf( 'element-ui/' ) !== -1 ) {
			return 'element-ui';
		}

		return importedPackage;
	} );

	imports = imports
		.filter(
			( importedPackage ) => importedPackage.indexOf( '@babel/' ) === -1
		)
		.sort();

	console.log(
		'\tFound',
		imports.length,
		'modules imports in',
		importsByFile.length,
		'files'
	);

	let packPackage = require( `${ PACKAGES_DIR }/${ folder }/package.json` );
	packPackage = {
		...packPackage,
		dependencies: {},
		devDependencies: {},
	};
	imports.forEach( ( importedPackage ) => {
		if ( importedPackage.indexOf( '@cspromo/' ) === 0 ) {
			packPackage.dependencies[ importedPackage ] =
				'file:../' + importedPackage.replace( '@cspromo/', '' );
		} else if ( importedPackage.indexOf( '@kubio/' ) === 0 ) {
			packPackage.dependencies[ importedPackage ] =
				'file:../' + importedPackage.replace( '@kubio/', '' );
		} else {
			if ( importedPackage.indexOf( '@' ) === -1 ) {
				importedPackage = importedPackage.split( '/' ).shift();
			}

			if ( importsVersion[ importedPackage ] ) {
				packPackage.devDependencies[ importedPackage ] =
					importsVersion[ importedPackage ];
			} else if ( devDependencies[ importedPackage ] ) {
				packPackage.devDependencies[ importedPackage ] =
					devDependencies[ importedPackage ];
			} else {
				try {
					const response = execSync(
						`npm view ${ importedPackage } version`,
						{
							stdio: [ 0, 'pipe', null ],
						}
					)
						.toString()
						.trim();
					packPackage.devDependencies[ importedPackage ] = response;
					importsVersion[ importedPackage ] = response;
				} catch ( e ) {
					console.log( '\t unable to install', importedPackage );
				}
			}
		}
	} );

	fs.writeFileSync(
		`${ PACKAGES_DIR }/${ folder }/package.json`,
		JSON.stringify( packPackage, undefined, 4 )
	);
} );
