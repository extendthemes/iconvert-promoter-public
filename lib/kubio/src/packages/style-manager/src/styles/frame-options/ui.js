import { __ } from '@wordpress/i18n';

const typeOptions = [
	{ label: __( 'Border', 'kubio' ), value: 'border' },
	{ label: __( 'Background', 'kubio' ), value: 'background' },
];

const offsetUnitOptions = {
	'%': {
		min: -100,
		max: 100,
		step: 1,
	},
};

const widthUnitOptions = {
	'%': {
		min: 0,
		max: 100,
		step: 1,
	},
};

const heightUnitOptions = {
	'%': {
		min: 0,
		max: 100,
		step: 1,
	},
};

const thicknessUnitOptions = {
	px: {
		min: 1,
		max: 50,
		step: 1,
	},
};

const dimensionsUnits = [ { label: 'PX', value: 'px' } ];
const procentUnits = [ { label: '%', value: '%' } ];
const offsetUnits = [ { label: '%', value: '%' } ];

export {
	typeOptions,
	procentUnits,
	offsetUnitOptions,
	widthUnitOptions,
	heightUnitOptions,
	thicknessUnitOptions,
	dimensionsUnits,
	offsetUnits,
};
