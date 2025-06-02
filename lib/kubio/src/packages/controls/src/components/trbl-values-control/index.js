import { BaseControl, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { noop } from 'lodash';
import { UnitValueInput } from '../unit-value-control';
import { onPathValueChange } from '../utils';

const sides = ['top', 'right', 'bottom', 'left'];

const SidesLabels = {
	top: __('Top', 'kubio'),
	right: __('Right', 'kubio'),
	bottom: __('Bottom', 'kubio'),
	left: __('Left', 'kubio'),
};

const defaultValue = {
	value: '',
	unit: 'px',
};

const SidesControl = (props) => {
	const {
		onChange = noop,
		label,
		value: currentValue = {
			top: {
				value: 20,
				unit: 'px',
			},
		},
	} = props;

	const onPropChange = onPathValueChange(currentValue, onChange);

	const side = (_side) => {
		const value = currentValue[_side] || defaultValue;
		return (
			<UnitValueInput
				label={SidesLabels[_side]}
				key={_side}
				value={value}
				onChange={(newValue) => onPropChange([_side], newValue)}
			/>
		);
	};

	return (
		<BaseControl>
			<BaseControl.VisualLabel>{label}</BaseControl.VisualLabel>
			<PanelRow className={`kubio-components-trbl__controls`}>
				{sides.map(side)}
			</PanelRow>
		</BaseControl>
	);
};

export { SidesControl };
