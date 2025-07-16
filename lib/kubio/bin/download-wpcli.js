const fs = require('fs');
const { spawnSync } = require('child_process');
const {
	logMessage,
	logInfo,
	logError,
	logStep,
} = require('./packages/logging');

const downloadWPCLI = () => {
	logStep('Retrieve wp-cli.phar');
	if (!fs.existsSync('./wp-cli.phar')) {
		logMessage('Downloading...');

		try {
			spawnSync('curl', [
				'-O',
				'https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar',
			]);
		} catch (e) {
			logError('Error while downloading wp-cli.phar', e);
		}
	} else {
		logInfo('wp-cli.phar already exists');
		spawnSync(
			'php',
			[
				'-d',
				'memory_limit=512M',
				'./wp-cli.phar',
				'cli',
				'update',
			].filter(Boolean),
			{
				stdio: ['inherit', 'inherit', 'inherit'],
			}
		);
	}
};

module.exports = downloadWPCLI;
