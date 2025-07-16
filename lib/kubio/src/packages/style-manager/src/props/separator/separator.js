import config from './config.json';
import { pascalCase } from '@kubio/utils';
import { sortItemsByPro, addProTagToItem } from '@kubio/pro';
import _ from 'lodash';

const defaultValue = config.definitions.separator.default;
const separators = config.enums.separators;

const heightUnitsOptions = [
	{ label: 'PX', value: 'px' },
	{ label: '%', value: '%' },
];

const heightUnitsSettings = {
	px: {
		min: 0,
		max: 300,
		step: 1,
	},
	'%': {
		min: 0,
		max: 100,
		step: 1,
	},
};

const freeDividers = [ 'tilt', 'tilt-flipped' ];

const createTypeOptions = function () {
	let options = [];
	for ( const key in separators ) {
		const label = separators[ key ].label
			? separators[ key ].label
			: pascalCase( key );

		let divider = {
			label,
			value: key,
			negative: false,
		};

		if ( ! freeDividers.includes( key ) ) {
			divider = addProTagToItem( divider );
		}

		options.push( divider );
		if ( separators[ key ].hasNegative ) {
			const dividerNeg = window.structuredClone( divider );
			dividerNeg.negative = true;

			options.push( dividerNeg );
		}
	}

	// Sort Free first
	options = sortItemsByPro( options, false );

	return options;
};

const typeOptions = createTypeOptions();

const separator = {
	name: 'separator',
	separators,
	typeOptions,
	heightUnitsOptions,
	heightUnitsSettings,
	default: defaultValue,
};

export default separator;
