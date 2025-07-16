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

				StylesEnum.TYPOGRAPHY,
				StylesEnum.TEXT_SHADOW,
			],
			states: StatesPresetsEnum.BASIC,
		},
	},
	[ElementsEnum.FIRSTLETTER]: {
		label: __('First Letter', 'kubio'),
		internal: true,
	},
};

export { ElementsEnum, elementsByName };
