import { StylesEnum } from '@kubio/style-manager';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ ElementsEnum.OUTER ]: {
		label: __( 'Element', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TEXT_SHADOW,
			],
			states: [ 'normal' ],
		},
	},
	[ ElementsEnum.TEXT ]: {
		label: __( 'Text', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TYPOGRAPHY,
				StylesEnum.TEXT_SHADOW,
			],
			states: [ 'normal' ],
		},
	},
	[ ElementsEnum.NUMBER ]: {
		label: __( 'Number', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TYPOGRAPHY,
				StylesEnum.TEXT_SHADOW,
			],
			states: [ 'normal' ],
		},
	},
};

export { elementsByName, ElementsEnum };
