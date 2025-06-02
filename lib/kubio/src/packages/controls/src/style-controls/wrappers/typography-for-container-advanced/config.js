import { __ } from '@wordpress/i18n';

const typographyTypesValues = {
	heading: 'h',
	paragraph: 'p',
	link: 'a',
	leadText: 'lead',
};

const typographyTypesOptions = [
	{ label: __('Texts', 'kubio'), value: typographyTypesValues.paragraph },
	{ label: __('Headings', 'kubio'), value: typographyTypesValues.heading },
	{ label: __('Links', 'kubio'), value: typographyTypesValues.link },
	{ label: __('Lead text', 'kubio'), value: typographyTypesValues.leadText },
];

const headingTypesValues = {
	H1: 'h1',
	H2: 'h2',
	H3: 'h3',
	H4: 'h4',
	H5: 'h5',
	H6: 'h6',
};

const headingTypesOptions = [
	{ label: 'H1', value: headingTypesValues.H1 },
	{ label: 'H2', value: headingTypesValues.H2 },
	{ label: 'H3', value: headingTypesValues.H3 },
	{ label: 'H4', value: headingTypesValues.H4 },
	{ label: 'H5', value: headingTypesValues.H5 },
	{ label: 'H6', value: headingTypesValues.H6 },
];

export {
	typographyTypesValues,
	typographyTypesOptions,
	headingTypesValues,
	headingTypesOptions,
};
