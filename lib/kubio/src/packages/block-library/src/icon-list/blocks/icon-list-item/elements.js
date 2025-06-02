import { StylesEnum } from '@kubio/style-manager';
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
			states: ['normal', 'hover'],
		},
	},
	[ElementsEnum.ITEM]: {
		label: __('Item wrapper', 'kubio'),
		internal: true,
	},
	[ElementsEnum.TEXTWRAPPER]: {
		label: __('Item', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: ['normal', 'hover'],
		},
	},
	[ElementsEnum.DIVIDER]: {
		label: __('Divider', 'kubio'),
		supports: {
			styles: [StylesEnum.BORDER, StylesEnum.SPACING],
			states: ['normal'],
		},
	},
};

export { ElementsEnum, elementsByName };
