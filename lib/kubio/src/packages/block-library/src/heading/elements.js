import { StatesPresetsEnum, StylesEnum } from '@kubio/style-manager';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ElementsEnum.TEXT]: {
		label: __('Text', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.SPACING,
				StylesEnum.BORDER,

				StylesEnum.TYPOGRAPHY_FOR_HEADING,
				StylesEnum.TEXT_SHADOW,
			],
			states: StatesPresetsEnum.BASIC,
		},
	},
	[ElementsEnum.SVG]: {
		internal: true,
	},
};

export { ElementsEnum, elementsByName };
