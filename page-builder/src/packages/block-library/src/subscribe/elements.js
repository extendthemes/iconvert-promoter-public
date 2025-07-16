import { StylesEnum, StatesPresetsEnum } from '@kubio/style-manager';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ ElementsEnum.CONTAINER ]: {
		label: __( 'Form', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.BORDER,
				StylesEnum.SPACING,
				StylesEnum.TYPOGRAPHY,
			],
			states: [ 'normal' ],
		},
	},
	[ ElementsEnum.GROUPLABELS ]: {
		label: __( 'Labels', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.SPACING,
				StylesEnum.TYPOGRAPHY,
			],
			states: [ 'normal' ],
		},
	},

	[ ElementsEnum.GROUPFIELDS ]: {
		label: __( 'Fields', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.SPACING,
				StylesEnum.BORDER,
				StylesEnum.TYPOGRAPHY,
			],
			states: [ 'normal', 'hover', 'focus' ],
		},
	},
	[ ElementsEnum.SUBMITBUTTON ]: {
		label: __( 'Submit button', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.SPACING,
				StylesEnum.BORDER,
				StylesEnum.TYPOGRAPHY,
			],
			states: [ 'normal', 'hover', 'focus' ],
		},
	},
	[ ElementsEnum.TERMSCONTAINERALIGN ]: {
		label: __( 'Terms container', 'iconvert-promoter' ),
		supports: {
			styles: [ StylesEnum.SPACING ],
			states: [ 'normal' ],
		},
	},
	[ ElementsEnum.TERMSFIELD ]: {
		label: __( 'Terms Checkbox', 'iconvert-promoter' ),
		supports: {
			styles: [ StylesEnum.BACKGROUND, StylesEnum.SPACING ],
			states: [ 'normal', 'checked' ],
		},
	},
	[ ElementsEnum.TERMSICON ]: {
		label: __( 'Terms Icon', 'iconvert-promoter' ),
		supports: {
			styles: [ StylesEnum.SPACING ],
			states: [ 'checked' ],
		},
	},
	[ ElementsEnum.TERMSLABEL ]: {
		label: __( 'Terms label', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.SPACING,
				StylesEnum.BORDER,
				StylesEnum.TYPOGRAPHY,
			],
			states: [ 'normal' ],
		},
	},
	[ ElementsEnum.TERMSDESCRIPTION ]: {
		label: __( 'Terms Description', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.SPACING,
				StylesEnum.BORDER,
				StylesEnum.TYPOGRAPHY,
			],
			states: [ 'normal' ],
		},
	},
	[ ElementsEnum.SUCCESS_NOTICE ]: {
		label: __( 'Success notice', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.SPACING,
				StylesEnum.BORDER,
				StylesEnum.TYPOGRAPHY,
			],
			states: [ 'normal' ],
		},
	},
	[ ElementsEnum.INFO_NOTICE ]: {
		label: __( 'Existing mail notice', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.SPACING,
				StylesEnum.BORDER,
				StylesEnum.TYPOGRAPHY,
			],
			states: [ 'normal' ],
		},
	},
	[ ElementsEnum.ERROR_NOTICE ]: {
		label: __( 'Error notice', 'iconvert-promoter' ),
		supports: {
			styles: [
				StylesEnum.BACKGROUND,
				StylesEnum.SPACING,
				StylesEnum.BORDER,
				StylesEnum.TYPOGRAPHY,
			],
			states: [ 'normal' ],
		},
	},
};

export { ElementsEnum, elementsByName };
