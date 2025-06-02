import { PanelBody, RangeControl } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import { mergeValue } from '../utils';
import { ColorIndicatorPopover, ToggleGroup } from '../../../components';
import _ from 'lodash';
const Labels = {
	vertical: __('Vertical', 'kubio'),
	spread: __('Spread', 'kubio'),
	blur: __('Blur', 'kubio'),
	color: __('Color', 'kubio'),
	position: __('Position', 'kubio'),
};

const hortizontalProp = {
	label: __('Horizontal', 'kubio'),
	min: 0,
	max: 100,
};

const rangeDefaults = {
	allowReset: true,
	step: 1,
};

export const positionOptions = [
	{ label: 'Outline', value: 'outline' },
	{ label: 'Inset', value: 'inset' },
];

const BoxShadowCustomControl = (props) => {
	const { value: currentValue = {}, onChange } = props;
	const mergedValue = currentValue;

	const getPath = (propName) => {
		return `layers.0.${propName}`;
	};
	const updateValue = (propName, propValue) => {
		return onChange(mergeValue(currentValue, propName, propValue));
	};

	const onPropertyChange = (prop) => (value) => updateValue(prop, value);

	const getValue = (propName) => {
		const path = getPath(propName);
		return _.get(mergedValue, path);
	};

	const getData = (path) => {
		return {
			value: getValue(path),
			onChange: onPropertyChange(path),
		};
	};
	/**
	 * The Rangecontrol does not set the checked prop if the value is falsey and becaause of that I used a mapper to set
	 *a different string only in the control. The control uses the outline value and the store uses the '' value as in colibri
	 */
	const insetSetMapper = {
		outline: '',
		inset: 'inset',
	};
	const insetGetMapper = _.invert(insetSetMapper);

	const insetData = {
		value: _.get(insetGetMapper, getValue('inset')),
		onChange: (newValue) => {
			updateValue('inset', _.get(insetSetMapper, newValue));
		},
	};

	return (
		<PanelBody>
			<ColorIndicatorPopover {...getData('color')} label={Labels.color} />

			<RangeControl
				{...getData('blur')}
				{...rangeDefaults}
				label={Labels.blur}
				min={0}
				max={100}
			/>
			<RangeControl
				{...getData('x')}
				{...rangeDefaults}
				{...hortizontalProp}
			/>

			<RangeControl
				{...getData('y')}
				{...rangeDefaults}
				label={Labels.vertical}
				min={0}
				max={10}
			/>

			<RangeControl
				{...getData('spread')}
				{...rangeDefaults}
				label={Labels.spread}
				min={0}
				max={10}
			/>

			<ToggleGroup {...insetData} options={positionOptions} />
		</PanelBody>
	);
};

export { BoxShadowCustomControl };
