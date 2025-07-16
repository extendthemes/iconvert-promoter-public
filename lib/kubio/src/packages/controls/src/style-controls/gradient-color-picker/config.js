const pickerValues = {
	COLOR: 'none',
	GRADIENT: 'gradient',
};

const pickerOptions = [
	{ value: pickerValues.COLOR, label: 'Color' },
	{ value: pickerValues.GRADIENT, label: 'Gradient' },
];

const picker = {
	values: pickerValues,
	options: pickerOptions,
	defaultValue: pickerValues.COLOR,
};

export { picker };

const properties = {
	picker,
};
export default properties;
