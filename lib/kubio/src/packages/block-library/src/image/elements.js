import { StatesPresetsEnum, StylesEnum } from '@kubio/style-manager';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ElementsEnum.OUTER]: {
		label: __('Container', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: StatesPresetsEnum.BASIC,
		},
	},
	[ElementsEnum.IMAGE]: {
		label: __('Image', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: StatesPresetsEnum.BASIC,
			filters: {
				[StylesEnum.BORDER]: {
					styleOthers: [
						ElementsEnum.OVERLAY,
					],
				},
			},
		},
	},
	[ElementsEnum.CAPTION]: {
		label: __('Caption', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TYPOGRAPHY,
			],
			states: StatesPresetsEnum.BASIC,
		},
	},
};

export { ElementsEnum, elementsByName };
