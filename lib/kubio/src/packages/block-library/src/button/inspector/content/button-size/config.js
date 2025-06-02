import { __ } from '@wordpress/i18n';

const buttonSizeValues = {
	SMALL: 'small',
	MEDIUM: 'medium',
	LARGE: 'large',
	CUSTOM: 'custom',
};

export const buttonSizeOptions = [
	{ label: __('Small', 'kubio'), value: buttonSizeValues.SMALL },
	{ label: __('Medium', 'kubio'), value: buttonSizeValues.MEDIUM },
	{ label: __('Large', 'kubio'), value: buttonSizeValues.LARGE },
	{ label: __('Custom', 'kubio'), value: buttonSizeValues.CUSTOM },
];

const buttonSizeOptionsInitials = [
	{ label: __('S', 'kubio'), value: buttonSizeValues.SMALL },
	{ label: __('M', 'kubio'), value: buttonSizeValues.MEDIUM },
	{ label: __('L', 'kubio'), value: buttonSizeValues.LARGE },
	{ label: __('Custom', 'kubio'), value: buttonSizeValues.CUSTOM },
];
const buttonSize = {
	values: buttonSizeValues,
	options: buttonSizeOptions,
	optionsInitials: buttonSizeOptionsInitials,
};

export { buttonSize };
