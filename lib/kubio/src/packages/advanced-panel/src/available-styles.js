import {
	BackgroundControl,
	BorderAndShadowControl,
	BoxShadowControl,
	SeparatorsControl,
	SpacingControl,
	TextShadowControl,
	TypographyForContainer,
	TypographyForText,
	TypographyForTextAdvanced,
	TypographyForContainerAdvanced,
	TypographyForHeading,
	AppearanceControl,
	ResponsiveControl,
	TransformControl,
	TransitionControlOnHover,
	MiscControl,
} from '@kubio/controls';

import { StylesEnum } from '@kubio/style-manager';

import { __ } from '@wordpress/i18n';

const AvailableStyles = {
	[ StylesEnum.TYPOGRAPHY ]: {
		control: TypographyForTextAdvanced,
		mapsToStyle: false,
		title: __( 'Typography', 'kubio' ),
	},
	[ StylesEnum.TYPOGRAPHY_FOR_HEADING ]: {
		control: TypographyForHeading,
		mapsToStyle: false,
		title: __( 'Typography', 'kubio' ),
	},
	[ StylesEnum.TYPOGRAPHY_FOR_CONTAINER ]: {
		control: TypographyForContainer,
		mapsToStyle: false,
		title: __( 'Typography', 'kubio' ),
	},
	[ StylesEnum.TYPOGRAPHY_FOR_CONTAINER_ADVANCED ]: {
		control: TypographyForContainerAdvanced,
		mapsToStyle: false,
		title: __( 'Typography', 'kubio' ),
	},
	[ StylesEnum.SPACING ]: {
		control: SpacingControl,
		mapsToStyle: false,
		title: __( 'Spacing', 'kubio' ),
	},

	[ StylesEnum.BORDER ]: {
		control: BorderAndShadowControl,
		mapsToStyle: false,
		title: ( { filters } ) => {
			const { supportsBorder = true, supportsBoxShadow = true } = filters;
			if ( supportsBorder && supportsBoxShadow ) {
				return __( 'Border and Shadows', 'kubio' );
			}
			if ( supportsBorder && ! supportsBoxShadow ) {
				return __( 'Border', 'kubio' );
			}
			if ( ! supportsBorder && supportsBoxShadow ) {
				return __( 'Box shadow', 'kubio' );
			}
		},
	},
	[ StylesEnum.BACKGROUND ]: {
		control: BackgroundControl,
		title: __( 'Background', 'kubio' ),
		options: {
			mergeArrays: true,
		},
	},
	// [StylesEnum.BOX_SHADOW]: {
	// 	control: BoxShadowControl,
	// 	title: __('Box shadow', 'kubio'),
	// },
	[ StylesEnum.TEXT_SHADOW ]: {
		control: TextShadowControl,
		title: __( 'Text shadow', 'kubio' ),
	},
	[ StylesEnum.RESPONSIVE ]: {
		shouldRender: ( { filters } ) => {
			return ! filters?.isDisabled;
		},
		control: ResponsiveControl,
		mapsToStyle: false,
		title: __( 'Responsive', 'kubio' ),
	},
	[ StylesEnum.SEPARATORS ]: {
		control: SeparatorsControl,
		title: __( 'Dividers', 'kubio' ),
		// options: {
		// 	media: 'desktop',
		// },
	},
	[ StylesEnum.TRANSFORM ]: {
		control: TransformControl,
		title: __( 'Transform', 'kubio' ),
		options: {
			mergeData: true,
		},
	},
	// [ StylesEnum.APPEARANCE ]: {
	// 	shouldRender: ( { filters } ) => {
	// 		return ! filters?.isDisabled;
	// 	},
	// 	control: AppearanceControl,
	// 	title: __( 'Entrance animation', 'kubio' ),
	// },
	[ StylesEnum.TRANSITION ]: {
		control: TransitionControlOnHover,
		shouldRender: ( props ) => {
			return props.state === 'hover';
		},
		title: __( 'Transition', 'kubio' ),
	},
	[ StylesEnum.MISC ]: {
		shouldRender: ( { filters } ) => {
			return ! filters?.isDisabled;
		},
		control: MiscControl,
		title: __( 'Miscellaneous', 'kubio' ),
	},
};
const AvailableStylesOrder = [
	StylesEnum.TRANSITION,
	StylesEnum.BACKGROUND,
	StylesEnum.SEPARATORS,
	StylesEnum.SPACING,
	StylesEnum.BORDER,
	StylesEnum.BOX_SHADOW,
	StylesEnum.TYPOGRAPHY,
	StylesEnum.TYPOGRAPHY_FOR_CONTAINER,
	StylesEnum.TYPOGRAPHY_FOR_CONTAINER_ADVANCED,
	StylesEnum.TYPOGRAPHY_FOR_HEADING,
	StylesEnum.TEXT_SHADOW,
	StylesEnum.TRANSFORM,
	StylesEnum.APPEARANCE,
	StylesEnum.RESPONSIVE,
	StylesEnum.MISC,
];
export { AvailableStyles, AvailableStylesOrder };
