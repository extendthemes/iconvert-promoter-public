import { __ } from '@wordpress/i18n';

import {
	VerticalAlignBottom,
	VerticalAlignMiddle,
	VerticalAlignTop,
	HorizontalAlignLeft,
	HorizontalAlignCenter,
	HorizontalAlignRight,
	MoreHorizontalMobile,
	MoreVerticalMobile,
} from '@kubio/icons';

const listLayoutValues = {
	HORIZONTAL: 'row',
	VERTICAL: 'column',
};

const listLayoutOptions = [
	{
		value: listLayoutValues.VERTICAL,
		label: __('Vertical', 'kubio'),
		icon: MoreVerticalMobile,
	},
	{
		value: listLayoutValues.HORIZONTAL,
		label: __('Horizontal', 'kubio'),
		icon: MoreHorizontalMobile,
	},
];

const dividerTypeOptions = [
	{ label: __('None', 'kubio'), value: 'none' },
	{ label: __('Solid', 'kubio'), value: 'solid' },
	{ label: __('Dashed', 'kubio'), value: 'dashed' },
	{ label: __('Dotted', 'kubio'), value: 'dotted' },
	{ label: __('Double', 'kubio'), value: 'double' },
	{ label: __('Groove', 'kubio'), value: 'groove' },
	{ label: __('Ridge', 'kubio'), value: 'ridge' },
	{ label: __('Inset', 'kubio'), value: 'inset' },
	{ label: __('Outset', 'kubio'), value: 'outset' },
];

const verticalAlignOptions = [
	{
		value: 'flex-start',
		label: __('Top', 'kubio'),
		icon: VerticalAlignTop,
	},
	{
		value: 'center',
		label: __('Middle', 'kubio'),
		icon: VerticalAlignMiddle,
	},
	{
		value: 'flex-end',
		label: __('Bottom', 'kubio'),
		icon: VerticalAlignBottom,
	},
];

const horizontalAlignOptions = [
	{
		value: 'flex-start',
		label: __('Left', 'kubio'),
		icon: HorizontalAlignLeft,
	},
	{
		value: 'center',
		label: __('Middle', 'kubio'),
		icon: HorizontalAlignCenter,
	},
	{
		value: 'flex-end',
		label: __('Right', 'kubio'),
		icon: HorizontalAlignRight,
	},
];

export {
	listLayoutValues,
	listLayoutOptions,
	dividerTypeOptions,
	verticalAlignOptions,
	horizontalAlignOptions,
};
