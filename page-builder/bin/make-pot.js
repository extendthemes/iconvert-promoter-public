const fs = require( 'fs' );
const path = require( 'path' );
const { spawnSync } = require( 'child_process' );
const { logStep } = require( './packages/logging' );
const downloadWPCLI = require( './download-wpcli' );

logStep( 'Remove existing pot file' );

const languagesFile = path
	.resolve( __dirname, '../languages/kubio.pot' )
	.replace( /\\/gim, '/' );

if ( fs.existsSync( languagesFile ) ) {
	fs.unlinkSync( languagesFile );
}

downloadWPCLI();

logStep( 'Retrieve files' );
const sources = [
	path.resolve( __dirname, '../src/packages' ).replace( /\\/gim, '/' ),
	path.resolve( __dirname, '../lib' ).replace( /\\/gim, '/' ),
];

const includeFiles = [ '*.js', '*.php', 'src/*' ];
const excludeFiles = [
	'*.json',
	'*.css',
	'*.asset.php',
	'build',
	'build-module',
	'*.svg',
];

const headers = {
	'Project-Id-Version': 'Kubio @@buildversion@@',
	'Report-Msgid-Bugs-To': 'support@kubiobuilder.com',
	'Last-Translator': 'Kubio <support@kubiobuilder.com>',
};

sources.forEach( ( source ) => {
	logStep( 'Build for', source );
	spawnSync(
		'php',
		[
			'-d',
			'memory_limit=512M',
			'./wp-cli.phar',
			'i18n',
			'make-pot',
			source,
			languagesFile,
			fs.existsSync( languagesFile )
				? `--merge=${ languagesFile }`
				: false,
			`--include=${ includeFiles.join( ',' ) }`,
			`--exclude=${ excludeFiles.join( ',' ) }`,
			'--slug=kubio',
			'--domain=kubio',
			'--headers=' + JSON.stringify( headers ),
		].filter( Boolean ),
		{
			stdio: [ 'inherit', 'inherit', 'inherit' ],
		}
	);
} );
