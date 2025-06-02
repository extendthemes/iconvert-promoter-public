import { PanelBody, RangeControl } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import _ from 'lodash';

import { ColorIndicatorPopover } from '../../../components';
import { types } from '@kubio/style-manager';

const Labels = {
	blur: __('Blur', 'kubio'),
	color: __('Color', 'kubio'),
	vertical: __('Vertical', 'kubio'),
};

const hortizontalProp = {
	label: __('Horizontal', 'kubio'),
	min: 0,
	max: 100,
};

const verticalProp = {
	label: __('Vertical', 'kubio'),
	min: 0,
	max: 100,
};

const rangeDefaults = {
	allowReset: true,
	step: 1,
};

const TextShadowCustomControl = (props) => {
	const { value: currentValue = {}, onChange } = props;

	const mergedValue = _.merge(
		{},
		currentValue,
		types.props.textShadow.default
	);

	const updateValue = (propName, propValue) => {
		const newValue = _.merge({}, currentValue, {
			[propName]: propValue,
		});
		return onChange(newValue);
	};

	const onPropertyChange = (prop) => (value) => {
		updateValue(prop, value);
	};

	const { x, y, blur, color } = mergedValue;

	return (
		<PanelBody>
			<ColorIndicatorPopover
				label={Labels.color}
				value={color}
				onChange={onPropertyChange('color')}
			/>

			<RangeControl
				{...rangeDefaults}
				label={Labels.blur}
				min={0}
				max={100}
				value={blur}
				onChange={onPropertyChange('blur')}
			/>
			<RangeControl
				{...rangeDefaults}
				{...hortizontalProp}
				value={x}
				onChange={onPropertyChange('x')}
			/>

			<RangeControl
				{...rangeDefaults}
				{...verticalProp}
				value={y}
				onChange={onPropertyChange('y')}
			/>
		</PanelBody>
	);
};

export { TextShadowCustomControl };
