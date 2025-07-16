const { wpCLIExec } = require( './wp-cli-exec' );

const args = [ ...process.argv ];

args.splice( 0, 2 );

wpCLIExec( ...args );
