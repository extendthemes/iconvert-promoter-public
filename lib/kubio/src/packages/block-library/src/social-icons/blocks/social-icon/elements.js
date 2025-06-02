import { StatesPresetsEnum, StylesEnum } from '@kubio/style-manager';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ElementsEnum.LINK]: {
		label: __('Link', 'kubio'),
		internal: true,
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: StatesPresetsEnum.NONE,
		},
	},
	[ElementsEnum.ICON]: {
		label: __('Icon', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: StatesPresetsEnum.BASIC,

			filters: {
				background: {
					types: ['none', 'gradient'],
				},
				border: {
					showReset: true,
				},
			},
		},
	},
};

export { elementsByName, ElementsEnum };
