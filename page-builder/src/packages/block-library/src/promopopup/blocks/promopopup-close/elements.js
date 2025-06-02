import { StatesPresetsEnum, StylesEnum } from '@kubio/style-manager';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ ElementsEnum.OUTER ]: {
		internal: true,
		label: __( 'Outer', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.SPACING,
				StylesEnum.BORDER,
			],
			states: StatesPresetsEnum.BASIC,
		},
	},
};

export { elementsByName, ElementsEnum };
