import { __ } from '@wordpress/i18n';

import { StylesEnum } from '@kubio/style-manager';
import metadata from './block.json';
const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ElementsEnum.OUTER]: {
		label: __('List Container', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: ['normal', 'hover'],
		},
	},
	[ElementsEnum.TEXTWRAPPER]: {
		label: __('List Item', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TYPOGRAPHY,
			],
			states: ['normal', 'hover'],
		},
	},
	[ElementsEnum.TEXT]: {
		label: __('Text', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TYPOGRAPHY,
			],
			states: ['normal', 'hover'],
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
			states: ['normal', 'hover'],
		},
	},

	[ElementsEnum.LINK]: {
		label: __('Links', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TYPOGRAPHY,
			],
			states: ['normal', 'hover', 'visited'],
		},
	},

	[ElementsEnum.DIVIDER]: {
		internal: true,
	},
	[ElementsEnum.ITEM]: {
		label: __('Item Wrapper', 'kubio'),
		internal: true,
	},
	[ElementsEnum.DIVIDERWRAPPER]: {
		label: __('Divider Wrapper', 'kubio'),
		internal: true,
	},
};

export { ElementsEnum, elementsByName };
