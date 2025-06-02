import { StylesEnum, StatesPresetsEnum } from '@kubio/style-manager';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const dynamicPropsFilter = {
	filters: {
		typography: {
			getDynamicProps: ( dataHelper, activeStyledComponent ) => {
				return {
					nodeType: 'a',
				};
			},
		},
	},
};

const buttonElementOptions = {
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
	internal: true,
};

const elementsByName = {
	[ ElementsEnum.CONTAINER ]: {
		label: __( 'Container', 'iconvert-promoter' ),
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

	[ ElementsEnum.YES_BUTTON ]: {
		label: __( 'Yes button', 'iconvert-promoter' ),
		...buttonElementOptions,
	},
	[ ElementsEnum.NO_BUTTON ]: {
		label: __( 'No button', 'iconvert-promoter' ),
		...buttonElementOptions,
	},
};

export { ElementsEnum, elementsByName };
