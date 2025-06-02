import { __ } from '@wordpress/i18n';
import { TextAlignLeft, TextAlignCenter, TextAlignRight } from '@kubio/icons';
import { HorizontalAlignFlexValues } from '@kubio/style-manager';
const buttonWidthValues = {
	FIT_TO_CONTENT: 'fitToContent',
	CUSTOM: 'custom',
};

const buttonWidthOptions = [
	{
		value: buttonWidthValues.FIT_TO_CONTENT,
		label: __('Fit to text', 'kubio'),
	},
	{ value: buttonWidthValues.CUSTOM, label: __('Fixed width', 'kubio') },
];

const widthUnitsOptions = [
	{ label: 'PX', value: 'px' },
	{ label: '%', value: '%' },
];

const buttonTextAlignOptions = [
	{
		value: HorizontalAlignFlexValues.LEFT,
		label: __('Left', 'kubio'),
		icon: TextAlignLeft,
	},
	{
		value: HorizontalAlignFlexValues.CENTER,
		label: __('Center', 'kubio'),
		icon: TextAlignCenter,
	},
	{
		value: HorizontalAlignFlexValues.RIGHT,
		label: __('Right', 'kubio'),
		icon: TextAlignRight,
	},
];

const widthUnitsConfig = {
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

const horizontalPaddingOptions = {
	min: 0,
	max: 100,
	step: 1,
};

const verticalPaddingOptions = {
	min: 0,
	max: 30,
	step: 1,
};

const widthOptions = {
	units: widthUnitsOptions,
	optionsByUnit: widthUnitsConfig,
};

const buttonWidth = {
	values: buttonWidthValues,
	options: buttonWidthOptions,
	default: buttonWidthValues.FIT_TO_CONTENT,
};

export {
	buttonWidth,
	widthOptions,
	horizontalPaddingOptions,
	verticalPaddingOptions,
	buttonTextAlignOptions,
};
