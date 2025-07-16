const { isString } = require( 'lodash' );
const chalk = require( 'chalk' );
const logArg = ( colorFn, data ) => {
	if ( isString( data ) ) {
		return colorFn( data );
	}

	return data;
};

const logStep = ( ...args ) => {
	console.log(
		chalk.red( '->' ),
		...args.map( ( arg ) => logArg( chalk.cyan, arg ) )
	);
};

const logError = ( ...args ) => {
	console.log(
		chalk.redBright( '->' ),
		...args.map( ( arg ) => logArg( chalk.redBright, arg ) )
	);
};

const logMessage = ( ...args ) => {
	console.log(
		chalk.green( '->' ),
		...args.map( ( arg ) => logArg( chalk.green, arg ) )
	);
};

const logWarning = ( ...args ) => {
	console.log(
		chalk.yellowBright( '->' ),
		...args.map( ( arg ) => logArg( chalk.yellowBright, arg ) )
	);
};

const logInfo = ( ...args ) => {
	console.log(
		chalk.gray( '->' ),
		...args.map( ( arg ) => logArg( chalk.gray, arg ) )
	);
};

module.exports = { logArg, logInfo, logError, logMessage, logStep, logWarning };
