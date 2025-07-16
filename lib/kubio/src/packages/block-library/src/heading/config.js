import { addProTagToItems } from '@kubio/pro';
import { __ } from '@wordpress/i18n';

const headingTypeValues = {
	H1: 1,
	H2: 2,
	H3: 3,
	H4: 4,
	H5: 5,
	H6: 6,
};

const headingTypeOptions = [
	{ value: headingTypeValues.H1, label: __('H1', 'kubio') },
	{ value: headingTypeValues.H2, label: __('H2', 'kubio') },
	{ value: headingTypeValues.H3, label: __('H3', 'kubio') },
	{ value: headingTypeValues.H4, label: __('H4', 'kubio') },
	{ value: headingTypeValues.H5, label: __('H5', 'kubio') },
	{ value: headingTypeValues.H6, label: __('H6', 'kubio') },
];

const headingType = {
	values: headingTypeValues,
	options: headingTypeOptions,
};

const typeAnimationValues = {
	TYPE: 'type',
	ROTATE_1: 'rotate-1',
	ROTATE_2: 'rotate-2',
	ROTATE_3: 'rotate-3',
	LOADING_BAR: 'loading-bar',
	SLIDE: 'slide',
	CLIP: 'clip',
	ZOOM: 'zoom',
	SCALE: 'scale',
	PUSH: 'push',
};

const typeHighlightedValues = {
	CIRCLE: 'circle',
	CURLY: 'curly',
	UNDERLINE: 'underline',
	DOUBLE: 'double',
	DOUBLE_UNDERLINE: 'double-underline',
	UNDERLINE_ZIGZAG: 'underline-zigzag',
	DIAGONAL: 'diagonal',
	STRIKETHROUGH: 'strikethrough',
	X: 'x',
};

const typeAnimationFreeValues = [typeAnimationValues.ROTATE_1];
let typeAnimationOptions = [
	{ label: __('3D flip', 'kubio'), value: typeAnimationValues.ROTATE_1 },
	{ label: __('Type', 'kubio'), value: typeAnimationValues.TYPE },
	{ label: __('Letter flip', 'kubio'), value: typeAnimationValues.ROTATE_3 },
	{
		label: __('Letter flip vertical', 'kubio'),
		value: typeAnimationValues.ROTATE_2,
	},
	// { label: __('Loading bar'), value: typeAnimationValues.LOADING_BAR },
	{ label: __('Slide', 'kubio'), value: typeAnimationValues.SLIDE },
	{ label: __('Clip', 'kubio'), value: typeAnimationValues.CLIP },
	{ label: __('Zoom', 'kubio'), value: typeAnimationValues.ZOOM },
	{ label: __('Scale', 'kubio'), value: typeAnimationValues.SCALE },
	{ label: __('Push', 'kubio'), value: typeAnimationValues.PUSH },
];

typeAnimationOptions = addProTagToItems(
	typeAnimationOptions,
	typeAnimationFreeValues
);

const typeHighlightedFreeValues = [typeHighlightedValues.CURLY];
let typeHighlightedOptions = [
	{ label: __('Curly', 'kubio'), value: typeHighlightedValues.CURLY },
	{ label: __('Circle', 'kubio'), value: typeHighlightedValues.CIRCLE },
	{ label: __('Underline', 'kubio'), value: typeHighlightedValues.UNDERLINE },
	{ label: __('Double', 'kubio'), value: typeHighlightedValues.DOUBLE },
	{
		label: __('Double Underline', 'kubio'),
		value: typeHighlightedValues.DOUBLE_UNDERLINE,
	},
	{
		label: __('Underline zigzag', 'kubio'),
		value: typeHighlightedValues.UNDERLINE_ZIGZAG,
	},
	{ label: __('Diagonal', 'kubio'), value: typeHighlightedValues.DIAGONAL },
	{
		label: __('Strikethrough', 'kubio'),
		value: typeHighlightedValues.STRIKETHROUGH,
	},
	{ label: __('X', 'kubio'), value: typeHighlightedValues.X },
];

typeHighlightedOptions = addProTagToItems(
	typeHighlightedOptions,
	typeHighlightedFreeValues
);

const typeStyleValues = {
	NONE: 'none',
	HIGHLIGHT: 'highlighted',
	ROTATE: 'rotating',
};
const typeStyleOption = [
	{ label: __('None', 'kubio'), value: typeStyleValues.NONE },
	{ label: __('Highlight', 'kubio'), value: typeStyleValues.HIGHLIGHT },
	{ label: __('Rotate', 'kubio'), value: typeStyleValues.ROTATE },
];

const thicknessOptions = [
	{ label: __('Thin', 'kubio'), value: '300' },
	{ label: __('Bold', 'kubio'), value: '600' },
];

const offsetStrokeWidthOptions = {
	min: 0,
	max: 20,
	step: 1,
};

const animationDurationOptions = {
	min: 1,
	max: 10,
	step: 0.1,
};
const typeAnimationDurationOptions = {
	min: 0.1,
	max: 0.3,
	step: 0.01,
};

const dimensionsUnits = [{ label: __('PX', 'kubio'), value: 'px' }];

const timeUnits = [{ label: __('s', 'kubio'), value: 's' }];

const getTagNameLevel = (dataHelper) => {
	const level = dataHelper
		.getProp('level', dataHelper.getAttribute('headerType', 1), {
			media: 'desktop',
		})
		?.toString?.()
		?.replace?.('h', '');

	return parseInt(level);
};

const getTagName = (dataHelper) => {
	const headerType = getTagNameLevel(dataHelper);
	return `h${headerType}`;
};

const properties = {
	typeAnimationValues,
	headingType,
	typeStyleValues,
	thicknessOptions,
	typeAnimationOptions,
	typeHighlightedOptions,
	typeStyleOption,
	offsetStrokeWidthOptions,
	dimensionsUnits,
	typeAnimationDurationOptions,
	animationDurationOptions,
	timeUnits,
};
export { properties, getTagName, getTagNameLevel };
