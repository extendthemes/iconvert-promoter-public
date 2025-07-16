import { StylesEnum } from '@kubio/style-manager';
import { __ } from '@wordpress/i18n';

const IconStyleEnum = {
	OUTER: 'outer',
	INNER: 'inner',
};

const styles = [
	{
		label: __('Icon', 'kubio'),
		name: IconStyleEnum.INNER,
		default: true,
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.MARGIN,
				StylesEnum.PADDING,
				StylesEnum.BOX_SHADOW,
			],
			states: ['normal', 'hover'],
		},
	},
	{
		label: __('Container', 'kubio'),
		name: IconStyleEnum.OUTER,
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.MARGIN,
				StylesEnum.PADDING,
				StylesEnum.BOX_SHADOW,
			],
			states: ['normal', 'hover'],
		},
	},
];

export { IconStyleEnum as StyleEnum, styles };
