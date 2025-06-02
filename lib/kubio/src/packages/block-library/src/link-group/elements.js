import metadata from './block.json';
import {
	StylesEnum,
	StylesPresetsEnum,
	StatesPresetsEnum,
} from '@kubio/style-manager';
import { __ } from '@wordpress/i18n';

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
	[ElementsEnum.SPACING]: {
		internal: true,
		supports: {
			styles: [...StylesPresetsEnum.ALL],
			states: StatesPresetsEnum.BASIC,
		},
	},
	[ElementsEnum.H_SPACE]: {
		internal: true,
	},
	[ElementsEnum.H_SPACE_GROUP]: {
		internal: true,
	},
};

export { elementsByName, ElementsEnum };
