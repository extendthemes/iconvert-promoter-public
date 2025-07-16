import { HeightTypesEnum } from '@kubio/style-manager';
import { __ } from '@wordpress/i18n';

const heightTypesOptions = [
	{ value: HeightTypesEnum.FIT_TO_CONTENT, label: __('Auto', 'kubio') },
	{
		value: HeightTypesEnum.FULL_SCREEN,
		label: __('Full screen', 'kubio'),
	},
	{
		value: HeightTypesEnum.MIN_HEIGHT,
		label: __('Min height', 'kubio'),
	},
];

const heightUnitsOptions = [
	{ label: 'PX', value: 'px' },
	{ label: 'VH', value: 'vh' },
];

const heightUnitsConfig = {
	px: {
		min: 0,
		max: 1000,
		step: 1,
	},
	vh: {
		min: 0,
		max: 100,
		step: 1,
	},
};

export { heightTypesOptions, heightUnitsConfig, heightUnitsOptions };
