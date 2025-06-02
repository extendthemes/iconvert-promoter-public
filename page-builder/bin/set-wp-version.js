const { logError, logInfo } = require( './packages/logging' );
const { wpCLIResponse, wpCLIExec } = require( './wp-cli-exec' );

const version = process.argv[ 2 ];

const installedVersion = wpCLIResponse( 'core', 'version' );

logInfo( 'Current version:', installedVersion );

if ( ! version ) {
	logError( 'Version not defined. Try something like 6.1 or 6.2-beta3' );
	process.exit( 0 );
}

wpCLIExec( 'core', 'update', `--version=${ version }`, '--force' );
