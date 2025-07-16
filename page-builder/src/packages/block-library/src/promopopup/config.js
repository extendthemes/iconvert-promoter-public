import { __ } from '@wordpress/i18n';
import { types } from '@kubio/style-manager';
import { VerticalAlignBottom, VerticalAlignTop } from '@kubio/icons';

function TEMPLATE( popupType ) {
	let definedTemplate = [
		[
			'cspromo/text',
			{
				content:
					'Lorem ipsum dolor sit amet id erat aliquet diam ullamcorper tempus massa eleifend vivamus.',
			},
		],
	];
	switch ( popupType ) {
		//6.1
		case 'matte':
			definedTemplate = [
				[
					'cspromo/promopopupclose',
					{},
					[
						[
							'cspromo/icon',
							{
								name: 'font-awesome/remove',
								kubio: {
									style: {
										descendants: {
											inner: {
												width: {
													value: 34,
													unit: 'px',
												},
												height: {
													value: 34,
													unit: 'px',
												},
											},
										},
									},
								},
							},
						],
					],
				],
				[
					'cspromo/heading',
					{ kubio: { props: { level: 3 } }, content: 'Heading' },
				],
				[
					'cspromo/text',
					{
						content:
							'Lorem ipsum dolor sit ullamcorper tempus massa eleifend vivamus.',
					},
				],
				[ 'cspromo/subscribe' ],
				[
					'cspromo/linkgroup',
					{},
					[ [ 'cspromo/link', { text: 'this is a link' } ] ],
				],
			];
			break;
		//6.2
		case 'simple-popup':
			definedTemplate = [
				[
					'cspromo/promopopupclose',
					{},
					[
						[
							'cspromo/icon',
							{
								name: 'font-awesome/remove',
								kubio: {
									style: {
										descendants: {
											inner: {
												width: {
													value: 34,
													unit: 'px',
												},
												height: {
													value: 34,
													unit: 'px',
												},
											},
										},
									},
								},
							},
						],
					],
				],
				[
					'cspromo/heading',
					{ kubio: { props: { level: 3 } }, content: 'Heading' },
				],
				[
					'cspromo/text',
					{
						content:
							'Lorem ipsum dolor sit ullamcorper tempus massa eleifend vivamus.',
					},
				],
				[ 'cspromo/subscribe' ],
			];
			break;
		//6.3
		case 'lightbox-popup':
			definedTemplate = [
				[
					'cspromo/promopopupclose',
					{},
					[
						[
							'cspromo/icon',
							{
								name: 'font-awesome/remove',
								kubio: {
									style: {
										descendants: {
											inner: {
												width: {
													value: 34,
													unit: 'px',
												},
												height: {
													value: 34,
													unit: 'px',
												},
											},
										},
									},
								},
							},
						],
					],
				],
				[
					'cspromo/heading',
					{ kubio: { props: { level: 3 } }, content: 'Heading' },
				],
				[
					'cspromo/text',
					{
						content:
							'Lorem ipsum dolor sit ullamcorper tempus massa eleifend vivamus.',
					},
				],
				[ 'cspromo/subscribe' ],
				[ 'cspromo/spacer' ],
				[ 'cspromo/image' ],
				[
					'cspromo/linkgroup',
					{},
					[ [ 'cspromo/link', { text: 'this is a link' } ] ],
				],
			];
			break;
		//6.4
		case 'slidein-popup':
			definedTemplate = [
				[
					'cspromo/promopopupclose',
					{},
					[
						[
							'cspromo/icon',
							{
								name: 'font-awesome/remove',
								kubio: {
									style: {
										descendants: {
											inner: {
												width: {
													value: 34,
													unit: 'px',
												},
												height: {
													value: 34,
													unit: 'px',
												},
											},
										},
									},
								},
							},
						],
					],
				],
				[
					'cspromo/heading',
					{ kubio: { props: { level: 3 } }, content: 'Heading' },
				],
				[
					'cspromo/text',
					{
						content:
							'Lorem ipsum dolor sit ullamcorper tempus massa eleifend vivamus.',
					},
				],
				[ 'cspromo/subscribe' ],
				[ 'cspromo/spacer' ],
				[ 'cspromo/image' ],
				[
					'cspromo/linkgroup',
					{},
					[ [ 'cspromo/link', { text: 'this is a link' } ] ],
				],
			];
			break;
		//6.5
		case 'floating-bar':
			definedTemplate = [
				[
					'cspromo/promopopupclose',
					{},
					[
						[
							'cspromo/icon',
							{
								name: 'font-awesome/remove',
								kubio: {
									style: {
										descendants: {
											inner: {
												width: {
													value: 34,
													unit: 'px',
												},
												height: {
													value: 34,
													unit: 'px',
												},
											},
										},
									},
								},
							},
						],
					],
				],
				[
					'cspromo/heading',
					{ kubio: { props: { level: 3 } }, content: 'Heading' },
				],
				[
					'cspromo/text',
					{
						content:
							'Lorem ipsum dolor sit ullamcorper tempus massa eleifend vivamus.',
					},
				],
				[ 'cspromo/subscribe' ],
				[ 'cspromo/spacer' ],
				[ 'cspromo/image' ],
				[
					'cspromo/linkgroup',
					{},
					[ [ 'cspromo/link', { text: 'this is a link' } ] ],
				],
			];
			break;
		//6.6
		case 'yes-no':
			definedTemplate = [
				[
					'cspromo/promopopupclose',
					{},
					[
						[
							'cspromo/icon',
							{
								name: 'font-awesome/remove',
								kubio: {
									style: {
										descendants: {
											inner: {
												width: {
													value: 34,
													unit: 'px',
												},
												height: {
													value: 34,
													unit: 'px',
												},
											},
										},
									},
								},
							},
						],
					],
				],
				[
					'cspromo/heading',
					{ kubio: { props: { level: 3 } }, content: 'Heading' },
				],
				[
					'cspromo/text',
					{
						content:
							'Lorem ipsum dolor sit ullamcorper tempus massa eleifend vivamus.',
					},
				],
				[
					'cspromo/buttongroup',
					{},
					[
						[ 'cspromo/button', { text: 'Yes' } ],
						[ 'cspromo/button', { text: 'No' } ],
					],
				],
				[
					'cspromo/linkgroup',
					{},
					[ [ 'cspromo/link', { text: 'this is a link' } ] ],
				],
			];
			break;
		//6.7
		case 'countdown':
			definedTemplate = [
				[
					'cspromo/promopopupclose',
					{},
					[
						[
							'cspromo/icon',
							{
								name: 'font-awesome/remove',
								kubio: {
									style: {
										descendants: {
											inner: {
												width: {
													value: 34,
													unit: 'px',
												},
												height: {
													value: 34,
													unit: 'px',
												},
											},
										},
									},
								},
							},
						],
					],
				],
				[
					'cspromo/heading',
					{ kubio: { props: { level: 3 } }, content: 'Heading' },
				],
				[
					'cspromo/text',
					{
						content:
							'Lorem ipsum dolor sit ullamcorper tempus massa eleifend vivamus.',
					},
				],
				[ 'cspromo/subscribe' ],
				[ 'cspromo/spacer' ],
				[ 'cspromo/image' ],
				[
					'cspromo/linkgroup',
					{},
					[ [ 'cspromo/link', { text: 'this is a link' } ] ],
				],
				[ 'cspromo/counter' ],
			];
			break;
		//6.8
		case 'product-list':
			definedTemplate = [
				[
					'cspromo/promopopupclose',
					{},
					[
						[
							'cspromo/icon',
							{
								name: 'font-awesome/remove',
								kubio: {
									style: {
										descendants: {
											inner: {
												width: {
													value: 34,
													unit: 'px',
												},
												height: {
													value: 34,
													unit: 'px',
												},
											},
										},
									},
								},
							},
						],
					],
				],
				[
					'cspromo/heading',
					{ kubio: { props: { level: 3 } }, content: 'Heading' },
				],
				[
					'cspromo/text',
					{
						content:
							'Lorem ipsum dolor sit ullamcorper tempus massa eleifend vivamus.',
					},
				],
			];
			break;
		//6.9
		case 'inline-promotion-bar':
			definedTemplate = [
				[
					'cspromo/promopopupclose',
					{},
					[
						[
							'cspromo/icon',
							{
								name: 'font-awesome/remove',
								kubio: {
									style: {
										descendants: {
											inner: {
												width: {
													value: 34,
													unit: 'px',
												},
												height: {
													value: 34,
													unit: 'px',
												},
											},
										},
									},
								},
							},
						],
					],
				],
				[
					'cspromo/heading',
					{ kubio: { props: { level: 3 } }, content: 'Heading' },
				],
				[
					'cspromo/text',
					{
						content:
							'Lorem ipsum dolor sit ullamcorper tempus massa eleifend vivamus.',
					},
				],
				[ 'cspromo/subscribe' ],
				[ 'cspromo/spacer' ],
				[ 'cspromo/image' ],
				[
					'cspromo/linkgroup',
					{},
					[ [ 'cspromo/link', { text: 'this is a link' } ] ],
				],
				[ 'cspromo/counter' ],
			];
			break;
	}
	return definedTemplate;
}

function TemplateWidthHeight( type, width, height ) {
	let widthHeight = [ 0, 0 ];
	switch ( type ) {
		//6.1
		case 'matte':
			widthHeight = [
				{ value: 100, unit: '%' },
				{ value: 100, unit: '%' },
			];
			break;
		//6.2
		case 'simple-popup':
			widthHeight = [
				{ value: 650, unit: 'px' },
				{ value: 400, unit: 'px' },
			];
			break;
		//6.3
		case 'lightbox-popup':
			widthHeight = [
				{ value: 650, unit: 'px' },
				{ value: 400, unit: 'px' },
			];
			break;
		//6.4
		case 'slidein-popup':
			widthHeight = [
				{ value: 300, unit: 'px' },
				{ value: 400, unit: 'px' },
			];
			break;
		//6.5
		case 'floating-bar':
			widthHeight = [
				{ value: 100, unit: '%' },
				{ value: 400, unit: 'px' },
			];
			break;
		//6.6
		case 'yes-no':
			widthHeight = [
				{ value: 650, unit: 'px' },
				{ value: 400, unit: 'px' },
			];
			break;
		//6.7
		case 'countdown':
			widthHeight = [
				{ value: 650, unit: 'px' },
				{ value: 400, unit: 'px' },
			];
			break;
		//6.8
		case 'product-list':
			widthHeight = [
				{ value: 650, unit: 'px' },
				{ value: 400, unit: 'px' },
			];
			break;
		//6.9
		case 'inline-promotion-bar':
			widthHeight = [
				{ value: 600, unit: 'px' },
				{ value: 180, unit: 'px' },
			];
			break;
	}
	return widthHeight;
}

const widthUnitsOptions = [
	{ label: 'PX', value: 'px' },
	{ label: '%', value: '%' },
];

const widthUnitsConfig = {
	px: {
		min: 0,
		max: 1000,
		step: 1,
	},
	'%': {
		min: 0,
		max: 100,
		step: 1,
	},
};
const widthOptions = {
	units: widthUnitsOptions,
	optionsByUnit: widthUnitsConfig,
};

//popup state
const noticesValues = {
	SHOW: 'show',
	HIDE: 'hide',
};
const noticesItems = {
	show: 'showNotice',
	hide: 'hideNotice',
};
const noticesOptions = [
	{ label: __( 'On Show', 'iconvert-promoter' ), value: noticesValues.SHOW },
	{ label: __( 'On Hide', 'iconvert-promoter' ), value: noticesValues.HIDE },
];
const notices = {
	values: noticesValues,
	items: noticesItems,
	options: noticesOptions,
	default: noticesValues.SHOW,
};

const effectValues = {
	none: '',
	fading: 'effectFading',
	zooming: 'effectZooming',
	bouncing: 'effectBouncing',
	sliding: 'effectSliding',
	rotating: 'effectRotating',
	attentionSeekers: 'effectAttentionSeekers',
	lightSpeed: 'effectLightSpeed',
	specials: 'effectSpecials',
	flippers: 'effectFlippers',
};
function optionsEffectActive() {
	return [
		{ label: 'none', value: effectValues.none },
		{ label: 'Fading', value: effectValues.fading },
		{ label: 'Zooming', value: effectValues.zooming },
		{ label: 'Bouncing', value: effectValues.bouncing },
		{ label: 'Sliding', value: effectValues.sliding },
		{ label: 'Rotating', value: effectValues.rotating },
		{ label: 'AttentionSeekers', value: effectValues.attentionSeekers },
		{ label: 'LightSpeed', value: effectValues.lightSpeed },
		{ label: 'Specials', value: effectValues.specials },
		{ label: 'Flippers', value: effectValues.flippers },
	];
}
function optionsEffectFading( state ) {
	if ( state === 'showNotice' ) {
		return [
			{ label: 'In', value: 'animate__fadeIn' },
			{ label: 'In Down', value: 'animate__fadeInDown' },
			{ label: 'In Left', value: 'animate__fadeInLeft' },
			{ label: 'In Right', value: 'animate__fadeInRight' },
			{ label: 'In Up', value: 'animate__fadeInUp' },
		];
	}
	if ( state === 'hideNotice' ) {
		return [
			{ label: 'Out', value: 'animate__fadeOut' },
			{ label: 'Out Down', value: 'animate__fadeOutDown' },
			{ label: 'Out Left', value: 'animate__fadeOutLeft' },
			{ label: 'Out Right', value: 'animate__fadeOutRight' },
			{ label: 'Out Up', value: 'animate__fadeOutUp' },
		];
	}
}
function optionsEffectZooming( state ) {
	if ( state === 'showNotice' ) {
		return [
			{ label: 'In', value: 'animate__zoomIn' },
			{ label: 'In Down', value: 'animate__zoomInDown' },
			{ label: 'In Left', value: 'animate__zoomInLeft' },
			{ label: 'In Right', value: 'animate__zoomInRight' },
			{ label: 'In Up', value: 'animate__zoomInUp' },
		];
	}
	if ( state === 'hideNotice' ) {
		return [
			{ label: 'Out', value: 'animate__zoomOut' },
			{ label: 'Out Down', value: 'animate__zoomOutDown' },
			{ label: 'Out Left', value: 'animate__zoomOutLeft' },
			{ label: 'Out Right', value: 'animate__zoomOutRight' },
			{ label: 'Out Up', value: 'animate__zoomOutUp' },
		];
	}
}
function optionsEffectBouncing( state ) {
	if ( state === 'showNotice' ) {
		return [
			{ label: 'In', value: 'animate__bounceIn' },
			{ label: 'In Down', value: 'animate__bounceInDown' },
			{ label: 'In Left', value: 'animate__bounceInLeft' },
			{ label: 'In Right', value: 'animate__bounceInRight' },
			{ label: 'In Up', value: 'animate__bounceInUp' },
		];
	}
	if ( state === 'hideNotice' ) {
		return [
			{ label: 'Out', value: 'animate__bounceOut' },
			{ label: 'Out Down', value: 'animate__bounceOutDown' },
			{ label: 'Out Left', value: 'animate__bounceOutLeft' },
			{ label: 'Out Right', value: 'animate__bounceOutRight' },
			{ label: 'Out Up', value: 'animate__bounceOutUp' },
		];
	}
}
function optionsEffectSliding( state ) {
	if ( state === 'showNotice' ) {
		return [
			{ label: 'In Down', value: 'animate__slideInDown' },
			{ label: 'In Left', value: 'animate__slideInLeft' },
			{ label: 'In Right', value: 'animate__slideInRight' },
			{ label: 'In Up', value: 'animate__slideInUp' },
		];
	}
	if ( state === 'hideNotice' ) {
		return [
			{ label: 'Out Down', value: 'animate__slideOutDown' },
			{ label: 'Out Left', value: 'animate__slideOutLeft' },
			{ label: 'Out Right', value: 'animate__slideOutRight' },
			{ label: 'Out Up', value: 'animate__slideOutUp' },
		];
	}
}
function optionsEffectRotating( state ) {
	if ( state === 'showNotice' ) {
		return [
			{ label: 'In', value: 'animate__rotateIn' },
			{ label: 'In Down Left', value: 'animate__rotateInDownLeft' },
			{ label: 'In Down Right', value: 'animate__rotateInDownRight' },
			{ label: 'In Up Left', value: 'animate__rotateInUpLeft' },
			{ label: 'In Up Right', value: 'animate__rotateInUpRight' },
		];
	}
	if ( state === 'hideNotice' ) {
		return [
			{ label: 'Out', value: 'animate__rotateOut' },
			{ label: 'Out Down Left', value: 'animate__rotateOutDownLeft' },
			{ label: 'Out Down Right', value: 'animate__rotateOutDownRight' },
			{ label: 'Out Up Left', value: 'animate__rotateOutUpLeft' },
			{ label: 'Out Up Right', value: 'animate__rotateOutUpRight' },
		];
	}
}
function optionsEffectAttentionSeekers( state ) {
	if ( state === 'showNotice' ) {
		return [
			{ label: 'Bounce', value: 'animate__bounce' },
			{ label: 'Flash', value: 'animate__flash' },
			{ label: 'Pulse', value: 'animate__pulse' },
			{ label: 'Rubber Band', value: 'animate__rubberBand' },
			{ label: 'Shake', value: 'animate__shakeX' },
			{ label: 'Head Shake', value: 'animate__headShake' },
			{ label: 'Swing', value: 'animate__swing' },
			{ label: 'Tada', value: 'animate__tada' },
			{ label: 'Wobble', value: 'animate__wobble' },
			{ label: 'Jello', value: 'animate__jello' },
			{ label: 'Heart Beat', value: 'animate__heartBeat' },
		];
	}
	if ( state === 'hideNotice' ) {
		return [ { label: 'Bounce Out', value: 'animate__bounceOut' } ];
	}
}
function optionsEffectLightSpeed( state ) {
	if ( state === 'showNotice' ) {
		return [
			{ label: 'In Right', value: 'animate__lightSpeedInRight' },
			{ label: 'In Left', value: 'animate__lightSpeedInLeft' },
		];
	}
	if ( state === 'hideNotice' ) {
		return [
			{ label: 'Out Right', value: 'animate__lightSpeedOutRight' },
			{ label: 'Out Left', value: 'animate__lightSpeedOutLeft' },
		];
	}
}
function optionsEffectSpecials( state ) {
	if ( state === 'showNotice' ) {
		return [
			{ label: 'Roll In', value: 'animate__rollIn' },
			{ label: 'Jack in the box', value: 'animate__jackInTheBox' },
		];
	}
	if ( state === 'hideNotice' ) {
		return [ { label: 'Roll Out', value: 'animate__rollOut' } ];
	}
}
function optionsEffectFlippers( state ) {
	if ( state === 'showNotice' ) {
		return [
			{ label: 'Flip in x', value: 'animate__flipInX' },
			{ label: 'Flip in y', value: 'animate__flipInY' },
		];
	}
	if ( state === 'hideNotice' ) {
		return [
			{ label: 'Flip out x', value: 'animate__flipOutX' },
			{ label: 'Flip out y', value: 'animate__flipOutY' },
		];
	}
}

const getEffectOptions = ( effect, state ) => {
	switch ( effect ) {
		case effectValues.fading:
			return optionsEffectFading( state );
		case effectValues.zooming:
			return optionsEffectZooming( state );
		case effectValues.bouncing:
			return optionsEffectBouncing( state );
		case effectValues.sliding:
			return optionsEffectSliding( state );
		case effectValues.rotating:
			return optionsEffectRotating( state );
		case effectValues.attentionSeekers:
			return optionsEffectAttentionSeekers( state );
		case effectValues.lightSpeed:
			return optionsEffectLightSpeed( state );
		case effectValues.specials:
			return optionsEffectSpecials( state );
		case effectValues.flippers:
			return optionsEffectFlippers( state );
		default:
			return [];
	}
};

//Custom floating bar => top/bottom
const VerticalAlignValues = types.enums.verticalAlignValues;
const verticalAlignOptionsTopBottom = [
	{
		value: VerticalAlignValues.TOP,
		label: __( 'Top', 'iconvert-promoter' ),
		icon: VerticalAlignTop,
	},
	{
		value: VerticalAlignValues.BOTTOM,
		label: __( 'Bottom', 'iconvert-promoter' ),
		icon: VerticalAlignBottom,
	},
];

const optionsContentToggle = [
	{ label: __( 'Over content', 'iconvert-promoter' ), value: 'over-content' },
	{
		label: __( 'Push content', 'iconvert-promoter' ),
		value: 'above-content',
	},
];

const getContextPropDefaultValue = () => ( dataHelper ) => {
	return {
		refreshAnimationKey: null,
		curentNotice:
			dataHelper.getAttribute( 'popup_type' ) === 'inline-promotion-bar'
				? notices.values.HIDE
				: notices.default,
	};
};

const DEFAULT_PROMO = 'simple-popup';

export {
	TEMPLATE,
	TemplateWidthHeight,
	widthOptions,
	notices,
	getContextPropDefaultValue,
	verticalAlignOptionsTopBottom,
	optionsContentToggle,
	optionsEffectActive,
	optionsEffectFading,
	optionsEffectZooming,
	optionsEffectBouncing,
	optionsEffectSliding,
	optionsEffectRotating,
	optionsEffectAttentionSeekers,
	optionsEffectLightSpeed,
	optionsEffectSpecials,
	optionsEffectFlippers,
	DEFAULT_PROMO,
	VerticalAlignValues,
	getEffectOptions,
	effectValues,
};
