import {
	GradientIcon,
	ImageIcon,
	NoneIcon,
	SlideshowIcon,
	VideoIcon,
} from '@kubio/icons';
import { BackgroundParserUtils, types } from '@kubio/style-manager';
import { __ } from '@wordpress/i18n';
import { each, isString, map } from 'lodash';
import isEqual from 'react-fast-compare';

const BackgroundTypesEnum = types.props.background.enums.types;

let BackgroundTypesOptions = [
	{
		label: __( 'Image', 'kubio' ),
		value: BackgroundTypesEnum.IMAGE,
		icon: ImageIcon,
	},
	{
		label: __( 'Gradient', 'kubio' ),
		value: BackgroundTypesEnum.GRADIENT,
		icon: GradientIcon,
	},
	{
		label: __( 'Video', 'kubio' ),
		value: BackgroundTypesEnum.VIDEO,
		icon: VideoIcon,
	},
	{
		label: __( 'Slideshow', 'kubio' ),
		value: BackgroundTypesEnum.SLIDESHOW,
		icon: SlideshowIcon,
	},
	{
		label: __( 'None', 'kubio' ),
		value: BackgroundTypesEnum.NONE,
		icon: NoneIcon,
	},
];
const videoTypes = [
	{ value: 'internal', label: __( 'Self hosted', 'kubio' ) },
	{ value: 'external', label: __( 'External', 'kubio' ) },
];
BackgroundTypesOptions = map( BackgroundTypesOptions, ( type ) => {
	return {
		...type,
		tooltip: type.label,
	};
} );

const OverlayShapesValues = types.enums.shapes;

const OverlayDefault = types.props.background.overlay.default;

const ImageProperties = {
	position: [
		{ label: __( 'Top Left', 'kubio' ), value: 'top left' },
		{ label: __( 'Top Center', 'kubio' ), value: 'top center' },
		{ label: __( 'Top Right', 'kubio' ), value: 'top right' },
		{ label: __( 'Center Left', 'kubio' ), value: 'center left' },
		{ label: __( 'Center Center', 'kubio' ), value: 'center center' },
		{ label: __( 'Center Right', 'kubio' ), value: 'center right' },
		{ label: __( 'Bottom Left', 'kubio' ), value: 'bottom left' },
		{ label: __( 'Bottom Center', 'kubio' ), value: 'bottom center' },
		{ label: __( 'Bottom Right', 'kubio' ), value: 'bottom right' },
		{ label: __( 'Custom', 'kubio' ), value: 'custom' },
	],
	attachment: [
		{ label: __( 'Scroll', 'kubio' ), value: 'scroll' },
		{ label: __( 'Fixed', 'kubio' ), value: 'fixed' },
	],
	repeat: [
		{ label: __( 'No Repeat', 'kubio' ), value: 'no-repeat' },
		{ label: __( 'Repeat', 'kubio' ), value: 'repeat' },
		{ label: __( 'Repeat X', 'kubio' ), value: 'repeat-x' },
		{ label: __( 'Repeat Y', 'kubio' ), value: 'repeat-y' },
	],
	size: [
		{ label: __( 'Auto', 'kubio' ), value: 'auto' },
		{ label: __( 'Cover', 'kubio' ), value: 'cover' },
		{ label: __( 'Contain', 'kubio' ), value: 'contain' },
		{ label: __( 'Custom', 'kubio' ), value: 'custom' },
	],
};

const ImagePositionMap = {
	'top left': { x: 0, y: 0 },
	'top center': { x: 50, y: 0 },
	'top right': { x: 100, y: 0 },
	'center left': { x: 0, y: 50 },
	'center center': { x: 50, y: 50 },
	'center right': { x: 100, y: 50 },
	'bottom left': { x: 0, y: 100 },
	'bottom center': { x: 50, y: 100 },
	'bottom right': { x: 100, y: 100 },
};
const ImageDefault = BackgroundParserUtils.imageDefault;
const VideoDefault = BackgroundParserUtils.videoDefault;
const SlideShowDefault = BackgroundParserUtils.slideShowDefault;

const DefaultValue = BackgroundParserUtils.defaultValue;

const imagePositionToShorthand = ( value ) => {
	let result = value;

	if ( isString( result ) ) {
		return result;
	}

	each( ImagePositionMap, ( mapValue, mapKey ) => {
		if ( isEqual( value, mapValue ) ) {
			result = mapKey;
			// break loop
			return false;
		}
	} );

	return result;
};

const overlayShapes = [
	{
		label: __( 'None', 'kubio' ),
		value: OverlayShapesValues.NONE,
		isTile: false,
	},

	// new shapes

	{
		label: __( 'Doodle', 'kubio' ),
		value: OverlayShapesValues.DOODLE,
		isTile: false,
	},

	{
		label: __( 'Falling stars', 'kubio' ),
		value: OverlayShapesValues.FALLING_STARS,
		isTile: false,
	},

	{
		label: __( 'Polygons', 'kubio' ),
		value: OverlayShapesValues.POLY1,
		isTile: false,
	},

	{
		label: __( 'Polylines', 'kubio' ),
		value: OverlayShapesValues.POLY2,
		isTile: false,
	},

	{
		label: __( 'Wavy lines', 'kubio' ),
		value: OverlayShapesValues.WAVY_LINES,
		isTile: false,
	},

	/// old shapes

	{
		label: __( 'Big circles', 'kubio' ),
		value: OverlayShapesValues.CIRCLES,
		isTile: false,
	},
	{
		label: __( 'Middle line', 'kubio' ),
		value: OverlayShapesValues.DEGREE_STRIPES,
		isTile: false,
	},
	{
		label: __( 'Rounded triangle', 'kubio' ),
		value: OverlayShapesValues.ROUNDED_SQUARE_BLUE,
		isTile: false,
	},
	{
		label: __( 'Multiple rounded triangles', 'kubio' ),
		value: OverlayShapesValues.MANY_ROUNDED_SQUARE_BLUE,
		isTile: false,
	},
	{
		label: __( 'Semicircles', 'kubio' ),
		value: OverlayShapesValues.TWO_CIRCLES,
		isTile: false,
	},
	{
		label: __( 'Overlapping circles', 'kubio' ),
		value: OverlayShapesValues.CIRCLES_TWO,
		isTile: false,
	},
	{
		label: __( 'Intersecting circles', 'kubio' ),
		value: OverlayShapesValues.CIRCLES_THREE,
		isTile: false,
	},
	{
		label: __( 'Gradient circles', 'kubio' ),
		value: OverlayShapesValues.CIRCLES_GRADIENT,
		isTile: false,
	},
	{
		label: __( 'White gradient circles', 'kubio' ),
		value: OverlayShapesValues.CIRCLES_WHITE_GRADIENT,
		isTile: false,
	},
	{
		label: __( 'Waves', 'kubio' ),
		value: OverlayShapesValues.WAVES,
		isTile: false,
	},
	{
		label: __( 'Inverted waves', 'kubio' ),
		value: OverlayShapesValues.WAVES_INVERTED,
		isTile: false,
	},
	{
		label: __( 'Dots', 'kubio' ),
		value: OverlayShapesValues.DOTS,
		isTile: true,
	},
	{
		label: __( 'Left tilted lines', 'kubio' ),
		value: OverlayShapesValues.LEFT_TILTED_LINES,
		isTile: true,
	},
	{
		label: __( 'Right tilted lines', 'kubio' ),
		value: OverlayShapesValues.RIGHT_TILTED_LINES,
		isTile: true,
	},
	{
		label: __( 'Right tilted strips', 'kubio' ),
		value: OverlayShapesValues.RIGHT_TILTED_STRIPES,
		isTile: false,
	},
];

const FiltersPreset = {
	CONTAINER: {
		background: {
			types: [ 'none', 'image', 'gradient', 'video', 'slideshow' ],
			image: {
				showParallax: false,
				featuredImage: {
					show: false,
				},
			},
			showOverlayOptions: true,
		},
	},
	MARGINLESS_SPACING: {
		supportsMargin: false,
	},
};
// In case of modify, throw error.
Object.freeze( FiltersPreset.CONTAINER );
Object.freeze( FiltersPreset.CONTAINER.background );
Object.freeze( FiltersPreset.CONTAINER.background.types );

export {
	BackgroundTypesEnum,
	BackgroundTypesOptions,
	OverlayDefault,
	DefaultValue,
	ImageDefault,
	VideoDefault,
	SlideShowDefault,
	OverlayShapesValues,
	overlayShapes,
	ImageProperties,
	ImagePositionMap,
	imagePositionToShorthand,
	videoTypes,
	FiltersPreset,
};
