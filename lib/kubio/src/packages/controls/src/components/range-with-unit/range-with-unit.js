import {
	BaseControl,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';
import classnames from 'classnames';
import _, { get, isObject, isString, isUndefined, merge } from 'lodash';
import { UNSET_VALUE } from '@kubio/constants';
import { useState, useEffect } from '@wordpress/element';
import GutentagRangeControl from '../range-control/range-control';

const unitsOrder = ['px', 'em', 'rem', '%', 'vw', 'vh'];

const normalizeUnits = (units) => {
	return units
		.map((unit) =>
			isString(unit) ? { value: unit, label: unit.toUpperCase() } : unit
		)
		.sort(
			(a, b) => unitsOrder.indexOf(a.value) - unitsOrder.indexOf(b.value)
		);
};
const Units = ({ value, onChange, units = [] }) => {
	//units = normalizeUnits(units);

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

const normalizeMinMaxAndCaps = (rest, unit) => {
	let { min, max, capMin, capMax, step, optionsByUnit } = rest;

	const optionsForCurrentUnit = get(optionsByUnit, unit, {});

	if (isObject(min) && !isUndefined(min[unit])) {
		min = min[unit];
	}

	if (isObject(max) && !isUndefined(max[unit])) {
		max = max[unit];
	}

	if (isObject(capMin) && !isUndefined(capMin[unit])) {
		capMin = capMin[unit];
	}

	if (isObject(capMax) && !isUndefined(capMax[unit])) {
		capMax = capMax[unit];
	}

	if (isObject(step) && !isUndefined(step[unit])) {
		step = step[unit];
	}

	return {
		...rest,
		...merge({}, optionsForCurrentUnit, { min, max, capMin, capMax, step }),
	};
};

const RangeWithUnitControl = (props) => {
	let {
		value,
		units = [],
		onChange,
		onReset,
		label,
		defaultUnit,
		defaultSliderValue,
		resetValue,
		debounceValue,
		...rest
	} = props;

	units = normalizeUnits(units);

	//in some cases the default unit should be ''. For example opacity. You can set defaultUnit='' and the control will
	//also handle the opacity case with no unit
	if (units.length && defaultUnit === undefined) {
		defaultUnit = _.get(units, ['0', 'value']);
	}
	if (!units.length && defaultUnit === undefined) {
		defaultUnit = 'px';
	}

	const currentUnit =
		value?.unit && value?.unit !== '' ? value?.unit : defaultUnit;

	const onResetDefault = () => {
		onChange(UNSET_VALUE);
	};

	onReset = onReset || onResetDefault;

	const onRangeChange = (nextValue) => {
		if (nextValue === undefined) {
			onReset(UNSET_VALUE);
		} else {
			onChange({ value: nextValue, unit: currentUnit });
		}
	};

	const onUnitChange = (nextUnit) => {
		onChange({
			value: '',
			unit: nextUnit,
		});
	};

	return (
		<BaseControl
			className={classnames('kubio-range-with-unit', 'kubio-control')}
		>
			<Flex>
				<FlexBlock>
					<BaseControl.VisualLabel
						className={'kubio-range-with-unit-label'}
					>
						{label}
					</BaseControl.VisualLabel>
				</FlexBlock>
				{units?.length > 1 && (
					<FlexItem>
						<Units
							units={units}
							value={currentUnit}
							onChange={onUnitChange}
						/>
					</FlexItem>
				)}
			</Flex>
			<GutentagRangeControl
				value={
					value === 0 || value?.value === 0
						? 0
						: value?.value || value
				}
				onChange={onRangeChange}
				onReset={onReset}
				resetValue={resetValue}
				defaultSliderValue={defaultSliderValue}
				debounceValue={debounceValue}
				{...normalizeMinMaxAndCaps(rest, currentUnit)}
			/>
		</BaseControl>
	);
};

export { RangeWithUnitControl };
