import { differenceBy } from 'lodash';

import {
	HorizontalAlignValues,
	HorizontalTextAlignValues,
	HorizontalAlignFlexValues,
	types,
} from '@kubio/style-manager';

import { __ } from '@wordpress/i18n';

import {
	HorizontalAlignCenter,
	HorizontalAlignLeft,
	HorizontalAlignRight,
	VerticalAlignBottom,
	VerticalAlignMiddle,
	VerticalAlignTop,
	TextAlignCenter,
	TextAlignJustify,
	TextAlignLeft,
	TextAlignRight,
} from '@kubio/icons';

const GapValues = types.enums.gapValues;
const VerticalAlignValues = types.enums.verticalAlignValues;

const itemsPerRowOptions = [
	{ value: 1, label: '1' },
	{ value: 2, label: '2' },
	{ value: 3, label: '3' },
	{ value: 4, label: '4' },
	{ value: 6, label: '6' },
];

const verticalAlignOptions = [
	{
		value: VerticalAlignValues.TOP,
		label: __('Top', 'kubio'),
		icon: VerticalAlignTop,
	},
	{
		value: VerticalAlignValues.MIDDLE,
		label: __('Middle', 'kubio'),
		icon: VerticalAlignMiddle,
	},
	{
		value: VerticalAlignValues.BOTTOM,
		label: __('Bottom', 'kubio'),
		icon: VerticalAlignBottom,
	},
];

const horizontalAlignFlexOptions = [
	{
		value: HorizontalAlignFlexValues.LEFT,
		label: __('Left', 'kubio'),
		icon: HorizontalAlignLeft,
	},
	{
		value: HorizontalAlignFlexValues.CENTER,
		label: __('Center', 'kubio'),
		icon: HorizontalAlignCenter,
	},
	{
		value: HorizontalAlignFlexValues.RIGHT,
		label: __('Right', 'kubio'),
		icon: HorizontalAlignRight,
	},
];

const horizontalAlignOptions = [
	{
		value: HorizontalAlignValues.LEFT,
		label: __('Left', 'kubio'),
		icon: HorizontalAlignLeft,
	},
	{
		value: HorizontalAlignValues.CENTER,
		label: __('Center', 'kubio'),
		icon: HorizontalAlignCenter,
	},
	{
		value: HorizontalAlignValues.RIGHT,
		label: __('Right', 'kubio'),
		icon: HorizontalAlignRight,
	},
];

const horizontalTextAlignOptions = [
	{
		value: HorizontalTextAlignValues.LEFT,
		label: __('Left', 'kubio'),
		icon: TextAlignLeft,
	},
	{
		value: HorizontalTextAlignValues.CENTER,
		label: __('Center', 'kubio'),
		icon: TextAlignCenter,
	},
	{
		value: HorizontalTextAlignValues.RIGHT,
		label: __('Right', 'kubio'),
		icon: TextAlignRight,
	},
	{
		value: HorizontalTextAlignValues.JUSTIFY,
		label: __('Justify', 'kubio'),
		icon: TextAlignJustify,
	},
];

const horizontalAlignFlexOptionsText = [
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

const horizontalTextAlignOptionsSimple = differenceBy(
	horizontalTextAlignOptions,
	[{ value: HorizontalTextAlignValues.JUSTIFY }],
	'value'
);

const columnGapTypesOptions = [
	{ value: GapValues.NONE, label: __('No gap', 'kubio') },
	{ value: GapValues.SMALL, label: 'S' },
	{ value: GapValues.MEDIUM, label: 'M' },
	{ value: GapValues.LARGE, label: 'L' },
	// not implemented
	// { value: GapValues.CUSTOM, label: 'Custom' },
];

const columnInnerGapTypesOptions = [
	...columnGapTypesOptions,
	{ value: 'inherit', label: __('Inherit', 'kubio') },
];

export {
	verticalAlignOptions,
	horizontalAlignOptions,
	horizontalTextAlignOptions,
	horizontalAlignFlexOptions,
	horizontalAlignFlexOptionsText,
	horizontalTextAlignOptionsSimple,
	columnGapTypesOptions,
	columnInnerGapTypesOptions,
	itemsPerRowOptions,
};
