import { types } from '@kubio/style-manager';
import { __ } from '@wordpress/i18n';
import { Perspective, Rotate, Scale, Skew, Translate } from '@kubio/icons';
import _ from 'lodash';

const transformTypes = {
	TRANSLATE: 'translate',
	SCALE: 'scale',
	SKEW: 'skew',
	ROTATE: 'rotate',
	PERSPECTIVE: 'perspective',
};

const defaultValue = types.props.transform.default;

const availableUnits = {
	[transformTypes.TRANSLATE]: ['px', '%'],
	[transformTypes.SCALE]: [''],
	[transformTypes.SKEW]: ['deg'],
	[transformTypes.ROTATE]: ['deg'],
	[transformTypes.PERSPECTIVE]: ['px', 'em', 'rem'],
};

function getTransformValueWithPerspectiveScaled(transformValue) {
	let perspectiveValue = _.get(transformValue, 'perspective.value');
	if (!perspectiveValue) {
		return transformValue;
	}
	perspectiveValue = parseFloat(perspectiveValue);
	const convertedTransformValue = _.merge({}, transformValue, {
		perspective: {
			value: perspectiveValue / 10,
		},
	});

	return convertedTransformValue;
}

const transformTypesOptions = [
	{
		label: __('Translate', 'kubio'),
		value: transformTypes.TRANSLATE,
		icon: Translate,
		tooltip: __('Translate', 'kubio'),
	},
	{
		label: __('Scale', 'kubio'),
		value: transformTypes.SCALE,
		icon: Scale,
		tooltip: __('Scale', 'kubio'),
	},
	{
		label: __('Skew', 'kubio'),
		value: transformTypes.SKEW,
		icon: Skew,
		tooltip: __('Skew', 'kubio'),
	},
	{
		label: __('Rotate', 'kubio'),
		value: transformTypes.ROTATE,
		icon: Rotate,
		tooltip: __('Rotate', 'kubio'),
	},
	{
		label: __('Perspective', 'kubio'),
		value: transformTypes.PERSPECTIVE,
		icon: Perspective,
		tooltip: __('Perspective', 'kubio'),
	},
];
const optionsByType = {
	[transformTypes.TRANSLATE]: {
		step: 1,
		min: -300,
		max: 300,
		defaultSliderValue: 0,
	},
	[transformTypes.SCALE]: {
		step: 0.1,
		max: 3,
		default: {
			unit: '',
			value: 1,
		},
	},
	[transformTypes.ROTATE]: {
		step: 1,
		min: -180,
		max: 180,
		defaultSliderValue: 0,
	},
	[transformTypes.SKEW]: {
		step: 1,
		min: 0,
		max: 180,
	},
	[transformTypes.PERSPECTIVE]: {
		step: 1,
		min: 0,
		max: 1000,
	},
};

const transformModeValues = {
	BASIC: 'basic',
	ADVANCED: 'advanced',
};

const transformModeOptions = [
	{
		label: __('Basic', 'kubio'),
		value: transformModeValues.BASIC,
		tooltip: __('Basic', 'kubio'),
	},
	{
		label: __('Advanced', 'kubio'),
		value: transformModeValues.ADVANCED,
		tooltip: __('Advanced', 'kubio'),
	},
];
const basicModeFilteredAxis = {
	translate: ['z'],
	scale: ['z'],
	skew: ['z'],
	rotate: ['x', 'y'],
};
export {
	transformTypes,
	optionsByType,
	transformTypesOptions,
	availableUnits,
	defaultValue,
	transformModeValues,
	transformModeOptions,
	basicModeFilteredAxis,
	getTransformValueWithPerspectiveScaled,
};
