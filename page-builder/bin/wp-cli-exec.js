const { spawnSync } = require( 'child_process' );
const downloadWPCLI = require( './download-wpcli' );

downloadWPCLI();

const wpCLIExec = ( ...args ) => {
	spawnSync(
		'php',
		[ '-d', 'memory_limit=512M', './wp-cli.phar', ...args ].filter(
			Boolean
		),
		{
			stdio: [ 'inherit', 'inherit', 'inherit' ],
		}
	);
};

const wpCLIResponse = ( ...args ) => {
	return spawnSync(
		'php',
		[ '-d', 'memory_limit=512M', './wp-cli.phar', ...args ].filter(
			Boolean
		)
	).stdout.toString();
};

module.exports = {
	wpCLIExec,
	wpCLIResponse,
};
