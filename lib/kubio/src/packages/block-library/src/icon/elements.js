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
	[ElementsEnum.INNER]: {
		label: __('Icon', 'kubio'),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TRANSITION,
			],
			states: ['normal', 'hover'],
			filters: {
				spacing: (dataHelper) => {
					if (dataHelper.blockName === "cspromo/promopopupclose") {
						return {
							supportsMargin: false
						}
					}
				}
			}
		},
	},
};

export { ElementsEnum, elementsByName };
