import { __ } from '@wordpress/i18n';

const dividerTypes = {
	LINE: 'line',
	ICON: 'icon',
};

const lineTypes = [
	{ value: 'solid', label: __('Solid', 'kubio') },
	{ value: 'dashed', label: __('Dashed', 'kubio') },
	{ value: 'dotted', label: __('Dotted', 'kubio') },
	{ value: 'double', label: __('Double', 'kubio') },
];

export { dividerTypes, lineTypes };
