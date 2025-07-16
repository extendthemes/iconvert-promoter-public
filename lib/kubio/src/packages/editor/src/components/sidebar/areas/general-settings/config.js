const headingTypeValues = {
	H1: 'h1',
	H2: 'h2',
	H3: 'h3',
	H4: 'h4',
	H5: 'h5',
	H6: 'h6',
};

const headingTypeOptions = [
	{ value: headingTypeValues.H1, label: 'H1' },
	{ value: headingTypeValues.H2, label: 'H2' },
	{ value: headingTypeValues.H3, label: 'H3' },
	{ value: headingTypeValues.H4, label: 'H4' },
	{ value: headingTypeValues.H5, label: 'H5' },
	{ value: headingTypeValues.H6, label: 'H6' },
];

const headingType = {
	values: headingTypeValues,
	options: headingTypeOptions,
};

const properties = {
	headingType,
};
export { properties };
