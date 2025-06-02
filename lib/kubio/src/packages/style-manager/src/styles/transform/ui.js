const translateUnits = [
	{ label: 'px', value: 'px' },
	{ label: '%', value: '%' },
];

const translateUnitsOptions = {
	px: {
		min: -1000,
		max: 1000,
		step: 1,
	},
	'%': {
		min: 0,
		max: 100,
		step: 1,
	},
};

const scaleSettings = {
	min: 0,
	max: 10,
	step: 0.1,
};
const rotateSettings = {
	min: 0,
	max: 360,
	step: 1,
};

const skewSettings = {
	min: 0,
	max: 360,
	step: 1,
};

const originCustomValueUnitsOptions = {
	px: {
		min: 0,
		max: 1000,
		step: 1,
	},
	em: {
		min: 0,
		max: 50,
		step: 0.1,
	},
	rem: {
		min: 0,
		max: 50,
		step: 0.1,
	},
	'%': {
		min: 0,
		max: 100,
		step: 1,
	},
};
