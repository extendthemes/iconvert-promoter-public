import { UNSET_VALUE } from '@kubio/constants';
import { RangeControl } from '@wordpress/components';
import { toFixedDecimals } from '@kubio/utils';
import classnames from 'classnames';
import { get } from 'lodash';
import { onPathValueChange } from './utils';

const Units = ({ value, onChange, units = [] }) => {
	const onClick = (selected, currentUnit) => {
		if (!selected) {
			onChange(currentUnit);
		}
	};
	return (
		<>
			<span className={'c-components-units-list'}>
				{units.map((unit) => {
					const { value: currentUnit, label } = unit;
					const selected = currentUnit === value;
					const className = classnames({
						'c-components-units-list__item': true,
						'is-selected': selected,
					});
					return (
						// eslint-disable-next-line jsx-a11y/click-events-have-key-events
						<span
							role="button"
							tabIndex={0}
							key={currentUnit}
							className={className}
							onClick={() => onClick(selected, currentUnit)}
						>
							{label}
						</span>
					);
				})}
			</span>
		</>
	);
};

const RangeWithUnitControl = (props) => {
	let {
		value,
		units,
		optionsByUnit = {},
		allowReset = true,
		onChange: onValueUnitChange,
		onReset,
		decimals = 2,
		...rest
	} = props;
	const unit = value?.unit || 'px';
	const optionsForCurrentUnit = get(optionsByUnit, unit, {});

	const onChange = (nextValue) => {
		nextValue.value = toFixedDecimals(nextValue.value, decimals);
		onValueUnitChange(nextValue);
	};

	const onValueChange = onPathValueChange(value, onChange, 'value');
	const onUnitChange = onPathValueChange(value, onChange, 'unit');
	const onResetDefault = () => {
		onChange(UNSET_VALUE);
	};
	onReset = onReset || onResetDefault;
	const onRangeChange = (event) => {
		if (event === undefined) {
			onReset();
		} else {
			onValueChange(event);
		}
	};
	return (
		<span>
			<Units units={units} value={value?.unit} onChange={onUnitChange} />
			<RangeControl
				{...rest}
				{...optionsForCurrentUnit}
				allowReset={allowReset}
				value={value?.value}
				onChange={onRangeChange}
			/>
		</span>
	);
};

export { RangeWithUnitControl };
