import metadata from './block.json';
import { StylesEnum, StatesPresetsEnum } from '@kubio/style-manager';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ElementsEnum.OUTER]: {
		label: __('List', 'kubio'),
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
		label: __('Icons', 'kubio'),
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
			},
		},
	},
};

export { elementsByName, ElementsEnum };
