import { __ } from '@wordpress/i18n';
import {
	HeroIcon1,
	HeroIcon2,
	HeroIcon3,
	HeroIcon4,
	HeroIcon5,
	CustomIcon,
} from '@kubio/icons';

const templateGroupPriorities = [ 'kubio', 'theme', 'kubio-custom', 'custom' ];
const templateGroups = {
	custom: __( 'Custom templates', 'kubio' ),
	theme: __( 'Theme templates', 'kubio' ),
	kubio: __( 'Kubio templates', 'kubio' ),
	'kubio-custom': __( 'Kubio custom templates', 'kubio' ),
};

const LayoutTypeSvg = {
	TEXT_ONLY: HeroIcon1,
	MEDIA_RIGHT: HeroIcon2,
	MEDIA_LEFT: HeroIcon3,
	MEDIA_TOP: HeroIcon4,
	MEDIA_BOTTOM: HeroIcon5,
	CUSTOM: CustomIcon,
};

const HERO_LAYOUT_VALUES = {
	TEXT_ONLY: 'textOnly',
	TEXT_WITH_MEDIA_ON_RIGHT: 'textWithMediaOnRight',
	TEXT_WITH_MEDIA_ON_LEFT: 'textWithMediaOnLeft',
	TEXT_WITH_MEDIA_ABOVE: 'textWithMediaAbove',
	TEXT_WITH_MEDIA_BELOW: 'textWithMediaBelow',
	CUSTOM: 'custom',
};

const HERO_TYPES_FREE_VALUES = [
	HERO_LAYOUT_VALUES.TEXT_ONLY,
	HERO_LAYOUT_VALUES.TEXT_WITH_MEDIA_ON_RIGHT,
	HERO_LAYOUT_VALUES.TEXT_WITH_MEDIA_ON_LEFT,
	HERO_LAYOUT_VALUES.CUSTOM,
];

const VISIBLE_EVERYWHERE = {
	desktop: true,
	tablet: true,
	mobile: true,
};
const VISIBLE_ON_DESKTOP = {
	desktop: true,
	tablet: false,
	mobile: false,
};

const HERO_LAYOUT_OPTIONS = [
	{
		label: __( 'Text only', 'kubio' ),
		value: HERO_LAYOUT_VALUES.TEXT_ONLY,
		icon: LayoutTypeSvg.TEXT_ONLY,
		visibilityByMedia: VISIBLE_EVERYWHERE,
	},
	{
		label: __( 'Media right', 'kubio' ),
		value: HERO_LAYOUT_VALUES.TEXT_WITH_MEDIA_ON_RIGHT,
		icon: LayoutTypeSvg.MEDIA_RIGHT,
		visibilityByMedia: VISIBLE_ON_DESKTOP,
	},
	{
		label: __( 'Media left', 'kubio' ),
		value: HERO_LAYOUT_VALUES.TEXT_WITH_MEDIA_ON_LEFT,
		icon: LayoutTypeSvg.MEDIA_LEFT,
		visibilityByMedia: VISIBLE_ON_DESKTOP,
	},
	{
		label: __( 'Media top', 'kubio' ),
		value: HERO_LAYOUT_VALUES.TEXT_WITH_MEDIA_ABOVE,
		icon: LayoutTypeSvg.MEDIA_TOP,
		visibilityByMedia: VISIBLE_EVERYWHERE,
	},
	{
		label: __( 'Media bottom', 'kubio' ),
		value: HERO_LAYOUT_VALUES.TEXT_WITH_MEDIA_BELOW,
		icon: LayoutTypeSvg.MEDIA_BOTTOM,
		visibilityByMedia: VISIBLE_EVERYWHERE,
	},

	{
		label: __( 'Custom', 'kubio' ),
		value: HERO_LAYOUT_VALUES.CUSTOM,
		icon: LayoutTypeSvg.CUSTOM,
		visibilityByMedia: VISIBLE_EVERYWHERE,
	},
];

export {
	templateGroupPriorities,
	templateGroups,
	HERO_LAYOUT_VALUES,
	HERO_TYPES_FREE_VALUES,
	HERO_LAYOUT_OPTIONS,
};
