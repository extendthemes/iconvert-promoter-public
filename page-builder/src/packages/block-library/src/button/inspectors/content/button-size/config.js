import { __ } from '@wordpress/i18n';

const buttonSizeValues = {
	SMALL: 'small',
	MEDIUM: 'medium',
	LARGE: 'large',
	CUSTOM: 'custom',
};

const buttonSizeOptions = [
	{
		label: __( 'Small', 'iconvert-promoter' ),
		value: buttonSizeValues.SMALL,
	},
	{
		label: __( 'Medium', 'iconvert-promoter' ),
		value: buttonSizeValues.MEDIUM,
	},
	{
		label: __( 'Large', 'iconvert-promoter' ),
		value: buttonSizeValues.LARGE,
	},
	{
		label: __( 'Custom', 'iconvert-promoter' ),
		value: buttonSizeValues.CUSTOM,
	},
];

const buttonSizeOptionsInitials = [
	{ label: __( 'S', 'iconvert-promoter' ), value: buttonSizeValues.SMALL },
	{ label: __( 'M', 'iconvert-promoter' ), value: buttonSizeValues.MEDIUM },
	{ label: __( 'L', 'iconvert-promoter' ), value: buttonSizeValues.LARGE },
	{
		label: __( 'Custom', 'iconvert-promoter' ),
		value: buttonSizeValues.CUSTOM,
	},
];
const buttonSize = {
	values: buttonSizeValues,
	options: buttonSizeOptions,
	optionsInitials: buttonSizeOptionsInitials,
};

export { buttonSize };
