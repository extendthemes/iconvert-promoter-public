import { StylesEnum } from '@kubio/style-manager';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ ElementsEnum.OUTER ]: {
		label: __( 'Main Container', 'iconvert-promoter' ),
		internal: true,
	},
	[ ElementsEnum.CONTAINER ]: {
		label: __( 'Countdown', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: [ 'normal' ],
		},
	},

	[ ElementsEnum.COUNTDOWN_ITEM ]: {
		label: __( 'Countdown items', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
			],
			states: [ 'normal' ],
		},
	},

	[ ElementsEnum.COUNTDOWN_ITEM_TEXT ]: {
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

	[ ElementsEnum.COUNTDOWN_ITEM_LABEL ]: {
		label: __( 'Label', 'iconvert-promoter' ),
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

	[ ElementsEnum.SEPARATOR ]: {
		label: __( 'Separator', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TYPOGRAPHY,
			],
			states: [ 'normal' ],
			filters: {
				border: {
					supportsBoxShadow: false,
				},
			},
		},
	},
};

export { ElementsEnum, elementsByName };
