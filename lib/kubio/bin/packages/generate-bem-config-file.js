const path = require( 'path' );
const fs = require( 'fs' );
const kubioEnv = require( './env' );

const generateBemConfigFile = () => {
	console.log( 'Start bem file generation' );
	const kubioPrefix = kubioEnv?.KUBIO_BLOCK_PREFIX || 'kubio';

	const generalCssPrefixSelector = !! kubioEnv?.GENERAL_CSS_PREFIX_SELECTOR
		? `'${ kubioEnv?.GENERAL_CSS_PREFIX_SELECTOR }'`
		: false;

	console.log( kubioPrefix );

	const content = `$block-prefix-variable: 'wp-block-${ kubioPrefix }';
	 			$kubio-general-prefix-selector: ${ generalCssPrefixSelector };
	 `;
	const dirPathName = path.join(
		__dirname,
		'../../src/packages/base-styles/dist'
	);
	const pathName = path.join( dirPathName, '/_block-prefix-variable.scss' );

	if ( ! fs.existsSync( dirPathName ) ) {
		fs.mkdirSync( dirPathName );

		console.log( 'Bem Folder Created Successfully.' );
	} else {
		console.log( dirPathName );
		console.log( 'Bem directory already exists' );
	}

	fs.writeFileSync( pathName, content );
	console.log( 'Created bem config file' );
};

module.exports = { generateBemConfigFile };
