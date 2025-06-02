import { __ } from '@wordpress/i18n';
import { addProTagToItems } from '@kubio/pro';

const FADE_IN_VALUES = {
	FADE_IN: 'fadeIn',
	FADE_IN_UP: 'fadeInUp',
	FADE_IN_DOWN: 'fadeInDown',
	FADE_IN_LEFT: 'fadeInLeft',
	FADE_IN_RIGHT: 'fadeInRight',
};

const ZOOM_IN_VALUES = {
	ZOOM_IN: 'zoomIn',
	ZOOM_IN_UP: 'zoomInUp',
	ZOOM_IN_DOWN: 'zoomInDown',
	ZOOM_IN_LEFT: 'zoomInLeft',
	ZOOM_IN_RIGHT: 'zoomInRight',
};
const BACK_IN_VALUES = {
	BACK_IN_UP: 'backInUp',
	BACK_IN_DOWN: 'backInDown',
	BACK_IN_LEFT: 'backInLeft',
	BACK_IN_RIGHT: 'backInRight',
};
const BOUNCE_IN_VALUES = {
	BOUNCE_IN: 'bounceIn',
	BOUNCE_IN_UP: 'bounceInUp',
	BOUNCE_IN_DOWN: 'bounceInDown',
	BOUNCE_IN_LEFT: 'bounceInLeft',
	BOUNCE_IN_RIGHT: 'bounceInRight',
};
const SLIDE_IN_VALUES = {
	SLIDE_IN_UP: 'slideInUp',
	SLIDE_IN_DOWN: 'slideInDown',
	SLIDE_IN_LEFT: 'slideInLeft',
	SLIDE_IN_RIGHT: 'slideInRight',
};
const ROTATE_IN_VALUES = {
	ROTATE_IN: 'rotateIn',
	ROTATE_IN_DOWN_LEFT: 'rotateInDownLeft',
	ROTATE_IN_DOWN_RIGHT: 'rotateInDownRight',
	ROTATE_IN_UP_LEFT: 'rotateInUpLeft',
	ROTATE_IN_UP_RIGHT: 'rotateInUpRight',
};

const ATTENTION_SEEKERS_VALUES = {
	BOUNCE: 'bounce',
	FLASH: 'flash',
	PULSE: 'pulse',
	RUBBER_BAND: 'rubberBand',
	SHAKE: 'shake',
	HEAD_SHAKE: 'headShake',
	SWING: 'swing',
	TADA: 'tada',
	WOBBLE: 'wobble',
	JELLO: 'jello',
	HEART_BEAT: 'heartBeat',
};
const LIGHT_SPEED_IN_VALUES = {
	LIGHT_SPEED_IN: 'lightSpeedIn',
};

const SPECIALS_VALUES = {
	ROLL_IN: 'rollIn',
	JACK_IN_THE_BOX: 'jackInTheBox',
};

const FLIP_IN_VALUES = {
	FLIP_IN_X: 'flipInX',
	FLIP_IN_Y: 'flipInY',
};
const EFFECT_TYPE_DEFAULT_VALUE = {
	NONE: 'none',
};

const FADING_OPTIONS = [
	{ label: __( 'Fade In', 'kubio' ), value: FADE_IN_VALUES.FADE_IN },
	{
		label: __( 'Fade In Up', 'kubio' ),
		value: FADE_IN_VALUES.FADE_IN_UP,
	},
	{
		label: __( 'Fade In Down', 'kubio' ),
		value: FADE_IN_VALUES.FADE_IN_DOWN,
	},
	{
		label: __( 'Fade In Left', 'kubio' ),
		value: FADE_IN_VALUES.FADE_IN_LEFT,
	},
	{
		label: __( 'Fade In Right', 'kubio' ),
		value: FADE_IN_VALUES.FADE_IN_RIGHT,
	},
];

const ZOOMING_OPTIONS = addProTagToItems( [
	{ label: __( 'Zoom In', 'kubio' ), value: ZOOM_IN_VALUES.ZOOM_IN },
	{
		label: __( 'Zoom In Up', 'kubio' ),
		value: ZOOM_IN_VALUES.ZOOM_IN_UP,
	},
	{
		label: __( 'Zoom In Down', 'kubio' ),
		value: ZOOM_IN_VALUES.ZOOM_IN_DOWN,
	},
	{
		label: __( 'Zoom In Left', 'kubio' ),
		value: ZOOM_IN_VALUES.ZOOM_IN_LEFT,
	},
	{
		label: __( 'Zoom In Right', 'kubio' ),
		value: ZOOM_IN_VALUES.ZOOM_IN_RIGHT,
	},
] );

const BACK_OPTIONS = addProTagToItems( [
	{
		label: __( 'Back In Up', 'kubio' ),
		value: BACK_IN_VALUES.BACK_IN_UP,
	},
	{
		label: __( 'Back In Down', 'kubio' ),
		value: BACK_IN_VALUES.BACK_IN_DOWN,
	},
	{
		label: __( 'Back In Left', 'kubio' ),
		value: BACK_IN_VALUES.BACK_IN_LEFT,
	},
	{
		label: __( 'Back In Right', 'kubio' ),
		value: BACK_IN_VALUES.BACK_IN_RIGHT,
	},
] );

const BOUNCING_OPTIONS = addProTagToItems( [
	{
		label: __( 'Bounce In', 'kubio' ),
		value: BOUNCE_IN_VALUES.BOUNCE_IN,
	},
	{
		label: __( 'Bounce In Up', 'kubio' ),
		value: BOUNCE_IN_VALUES.BOUNCE_IN_UP,
	},
	{
		label: __( 'Bounce In Down', 'kubio' ),
		value: BOUNCE_IN_VALUES.BOUNCE_IN_DOWN,
	},
	{
		label: __( 'Bounce In Left', 'kubio' ),
		value: BOUNCE_IN_VALUES.BOUNCE_IN_LEFT,
	},
	{
		label: __( 'Bounce In Right', 'kubio' ),
		value: BOUNCE_IN_VALUES.BOUNCE_IN_RIGHT,
	},
] );

const SLIDING_OPTIONS = addProTagToItems( [
	{
		label: __( 'Slide In Up', 'kubio' ),
		value: SLIDE_IN_VALUES.SLIDE_IN_UP,
	},
	{
		label: __( 'Slide In Down', 'kubio' ),
		value: SLIDE_IN_VALUES.SLIDE_IN_DOWN,
	},
	{
		label: __( 'Slide In Left', 'kubio' ),
		value: SLIDE_IN_VALUES.SLIDE_IN_LEFT,
	},
	{
		label: __( 'Slide In Right', 'kubio' ),
		value: SLIDE_IN_VALUES.SLIDE_IN_RIGHT,
	},
] );

const ROTATING_OPTIONS = addProTagToItems( [
	{
		label: __( 'Rotate In', 'kubio' ),
		value: ROTATE_IN_VALUES.ROTATE_IN,
	},
	{
		label: __( 'Rotate In Down Left', 'kubio' ),
		value: ROTATE_IN_VALUES.ROTATE_IN_DOWN_LEFT,
	},
	{
		label: __( 'Rotate In Down Right', 'kubio' ),
		value: ROTATE_IN_VALUES.ROTATE_IN_DOWN_RIGHT,
	},
	{
		label: __( 'Rotate In Up Left', 'kubio' ),
		value: ROTATE_IN_VALUES.ROTATE_IN_UP_LEFT,
	},
	{
		label: __( 'Rotate In Up Right', 'kubio' ),
		value: ROTATE_IN_VALUES.ROTATE_IN_UP_RIGHT,
	},
] );

const ATTENTION_SEEKERS_OPTIONS = addProTagToItems( [
	{
		label: __( 'Bounce', 'kubio' ),
		value: ATTENTION_SEEKERS_VALUES.BOUNCE,
	},
	{
		label: __( 'Flash', 'kubio' ),
		value: ATTENTION_SEEKERS_VALUES.FLASH,
	},
	{
		label: __( 'Pulse', 'kubio' ),
		value: ATTENTION_SEEKERS_VALUES.PULSE,
	},
	{
		label: __( 'Rubber band', 'kubio' ),
		value: ATTENTION_SEEKERS_VALUES.RUBBER_BAND,
	},
	{
		label: __( 'Shake', 'kubio' ),
		value: ATTENTION_SEEKERS_VALUES.SHAKE,
	},
	{
		label: __( 'Head Shake', 'kubio' ),
		value: ATTENTION_SEEKERS_VALUES.HEAD_SHAKE,
	},
	{
		label: __( 'Swing', 'kubio' ),
		value: ATTENTION_SEEKERS_VALUES.SWING,
	},
	{
		label: __( 'Tada', 'kubio' ),
		value: ATTENTION_SEEKERS_VALUES.TADA,
	},
	{
		label: __( 'Wobble', 'kubio' ),
		value: ATTENTION_SEEKERS_VALUES.WOBBLE,
	},
	{
		label: __( 'Jello', 'kubio' ),
		value: ATTENTION_SEEKERS_VALUES.JELLO,
	},
	{
		label: __( 'Heart Beat', 'kubio' ),
		value: ATTENTION_SEEKERS_VALUES.HEART_BEAT,
	},
] );

const LIGHT_SPEED_OPTIONS = addProTagToItems( [
	{
		label: __( 'Light Speed In', 'kubio' ),
		value: LIGHT_SPEED_IN_VALUES.LIGHT_SPEED_IN,
	},
] );

const SPECIALS_OPTIONS = addProTagToItems( [
	{ label: __( 'Roll In', 'kubio' ), value: SPECIALS_VALUES.ROLL_IN },
	{
		label: __( 'Jack In The Box', 'kubio' ),
		value: SPECIALS_VALUES.JACK_IN_THE_BOX,
	},
] );

const FLIPPERS_OPTIONS = addProTagToItems( [
	{
		label: __( 'Flip In X', 'kubio' ),
		value: FLIP_IN_VALUES.FLIP_IN_X,
	},
	{
		label: __( 'Flip In Y', 'kubio' ),
		value: FLIP_IN_VALUES.FLIP_IN_Y,
	},
] );

const EFFECT_TYPE_OPTIONS = [
	{
		label: __( 'None', 'kubio' ),
		value: EFFECT_TYPE_DEFAULT_VALUE.NONE,
	},
	{
		label: __( 'Fading', 'kubio' ),
		items: FADING_OPTIONS,
	},
	{
		label: __( 'Zooming', 'kubio' ),
		items: ZOOMING_OPTIONS,
	},
	{
		label: __( 'Back', 'kubio' ),
		items: BACK_OPTIONS,
	},
	{
		label: __( 'Bouncing', 'kubio' ),
		items: BOUNCING_OPTIONS,
	},
	{
		label: __( 'Sliding', 'kubio' ),
		items: SLIDING_OPTIONS,
	},
	{
		label: __( 'Rotating', 'kubio' ),
		items: ROTATING_OPTIONS,
	},
	{
		label: __( 'Attention seekers', 'kubio' ),
		items: ATTENTION_SEEKERS_OPTIONS,
	},
	{
		label: __( 'Light Speed', 'kubio' ),
		items: LIGHT_SPEED_OPTIONS,
	},
	{
		label: __( 'Specials', 'kubio' ),
		items: SPECIALS_OPTIONS,
	},
	{
		label: __( 'Flippers', 'kubio' ),
		items: FLIPPERS_OPTIONS,
	},
];

const effectTypeDefault = EFFECT_TYPE_DEFAULT_VALUE.NONE;
const effectTypeOptions = EFFECT_TYPE_OPTIONS;

const animationDurationOptions = {
	defaultValue: 1000,
	step: 100,
	min: 100,
	max: 3000,
	capMin: true,
	defaultUnit: 'ms',
};

const animationDelayOptions = {
	defaultValue: 0,
	step: 100,
	min: 0,
	max: 3000,
	capMin: true,
	defaultUnit: 'ms',
};

export {
	effectTypeDefault,
	effectTypeOptions,
	animationDurationOptions,
	animationDelayOptions,
};
