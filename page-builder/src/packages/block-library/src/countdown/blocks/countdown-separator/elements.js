import { StylesEnum } from '@kubio/style-manager';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ ElementsEnum.OUTER ]: {
		label: __( 'Separator', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TYPOGRAPHY,
				StylesEnum.TEXT_SHADOW,
			],
		},
	},
};

export { elementsByName, ElementsEnum };
