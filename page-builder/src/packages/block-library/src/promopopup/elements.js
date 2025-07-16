import { StylesEnum } from '@kubio/style-manager';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ ElementsEnum.OUTER ]: {
		label: __( 'Background Overlay', 'iconvert-promoter' ),
		supports: {
			styles: [ StylesEnum.BACKGROUND, StylesEnum.BORDER ],
			states: [ 'normal' ],
		},
	},
	[ ElementsEnum.CONTAINER ]: {
		label: __( 'Popup Container', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TYPOGRAPHY_FOR_CONTAINER_ADVANCED,
			],
			states: [ 'normal' ],
		},
	},

	[ ElementsEnum.VSPACE ]: {
		internal: true,

		selector:
			'> .block-editor-block-list__layout  > *.position-relative:not(:last-child)',
	},
};

export { ElementsEnum, elementsByName };
