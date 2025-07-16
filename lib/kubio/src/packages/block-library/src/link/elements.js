import {
	StatesPresetsEnum,
	StylesEnum,
	StylesPresetsEnum,
} from '@kubio/style-manager';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const dynamicPropsFilter = {
	filters: {
		typography: {
			getDynamicProps: (dataHelper, activeStyledComponent) => {
				return {
					nodeType: 'a',
				};
			},
		},
	},
};

const elementsByName = {
	[ElementsEnum.OUTER]: {
		internal: true,
		supports: {
			styles: [...StylesPresetsEnum.ALL],
			states: StatesPresetsEnum.NONE,
		},
	},
	[ElementsEnum.LINK]: {
		label: __('Link', 'kubio'),
		supports: {
			styles: [
				StylesEnum.TRANSITION,
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TYPOGRAPHY,
			],
			states: StatesPresetsEnum.LINK,
			...dynamicPropsFilter,
		},
	},
	[ElementsEnum.TEXT]: {
		internal: true,
	},
	[ElementsEnum.ICON]: {
		label: __('Icon', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: StatesPresetsEnum.LINK,
		},
	},
};

export { elementsByName, ElementsEnum };
