import { isString } from 'lodash';

const logType = {
	INFO: 'info',
	WARN: 'warn',
	ERROR: 'error',
	SUCCESS: 'success',
};

const logStyles = {
	[logType.INFO]: {
		'background-color': '#666',
		color: '#fff',
	},
	[logType.WARN]: { 'background-color': 'yellow', color: 'black' },
	[logType.ERROR]: { 'background-color': 'red', color: '#fff' },
	[logType.SUCCESS]: { 'background-color': 'green', color: '#fff' },
};

const Log = {
	log: (type, args) => {
		const styleObject = {
			...logStyles[type],
			padding: '2px',
		};

		const style = Object.keys(styleObject)
			.map((key) => `${key}:${styleObject[key]}`)
			.join(';');

		// eslint-disable-next-line no-console

		const groupTitle = isString(args[0]) ? args[0] : '';

		console.groupCollapsed(
			`%c Kubio - ${type.toUpperCase()} `,
			style,
			groupTitle
		);

		console.log('DATA', args);

		// eslint-disable-next-line no-console
		console.trace();
		// eslint-disable-next-line no-console
		console.groupEnd();
	},

	error: (...args) => {
		Log.log(logType.ERROR, args);
	},

	warn: (...args) => {
		Log.log(logType.WARN, args);
	},

	info: (...args) => {
		Log.log(logType.INFO, args);
	},
	success: (...args) => {
		Log.log(logType.SUCCESS, args);
	},
};

export { Log };
