import { StylesEnum } from '@kubio/style-manager';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ElementsEnum.INNER]: {
		label: __('Icon', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: ['normal'],
		},
	},
	[ElementsEnum.LINE]: {
		label: __('Line', 'kubio'),

		supports: {
			styles: [StylesEnum.BORDER],
			states: ['normal'],
			filters: {
				border: {
					supportsBorder: false,
					allowInset: false,
				},
			},
		},
	},
	[ElementsEnum.OUTER]: {
		label: __('Container', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: ['normal'],
		},
	},
};

export { ElementsEnum, elementsByName };
