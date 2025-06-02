import { StylesEnum } from '@kubio/style-manager';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ ElementsEnum.OUTER ]: {
		label: __( 'Container', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.SPACING,
				StylesEnum.BORDER,
			],
			states: [ 'normal' ],
		},
	},

	[ ElementsEnum.INNER ]: {
		label: __( 'Content wrapper', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.SPACING,
				StylesEnum.BORDER,
			],
			states: [ 'normal' ],
		},
	},
	[ ElementsEnum.SCROLLBAR ]: {},
	[ ElementsEnum.SCROLLBARTRACK ]: {},
	[ ElementsEnum.SCROLLBARHANDLE ]: {},
	[ ElementsEnum.SCROLLBARHANDLEHOVER ]: {},
};

export { elementsByName, ElementsEnum };
