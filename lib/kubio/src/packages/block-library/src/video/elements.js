import { StylesEnum } from '@kubio/style-manager';
import metadata from './block.json';
const ElementsEnum = metadata.supports.kubio.elementsEnum;
import { __ } from '@wordpress/i18n';

const elementsByName = {
	[ ElementsEnum.OUTER ]: {
		label: __( 'Container', 'kubio' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: [ 'normal' ],
			filters: {
				spacing: {
					supportsPadding: false,
					supportsMargin: true,
				},
			},
		},
	},
	[ ElementsEnum.VIDEO ]: {
		label: __( 'Video', 'kubio' ),
		internal: true,
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: [ 'normal' ],
		},
	},

	[ ElementsEnum.POSTER ]: {
		internal: true,
		supports: {
			styles: [],
			states: [ 'normal' ],
		},
	},
	[ ElementsEnum.LIGHTBOX ]: {
		internal: true,
		supports: {
			styles: [],
			states: [ 'normal' ],
		},
	},
};

export { ElementsEnum, elementsByName };
