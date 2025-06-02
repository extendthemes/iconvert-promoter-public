const defaultCustomValue = {
	unit: 'px',
	value: '',
};

const customValueUnits = [{ label: 'px', value: 'px' }];
const customValueUnitsSettings = {
	px: {
		min: 0,
		max: 100,
		step: 1,
	},
};

const customValueLimits = {
	units: customValueUnits,
	unitsSettings: customValueUnitsSettings,
};

export { customValueLimits, defaultCustomValue };
