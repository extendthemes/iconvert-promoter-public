import { UNSET_VALUE } from '@kubio/constants';
import { useDebounce } from '@kubio/core';
import { ResetIcon } from '@kubio/icons';
import { toFixedDecimals } from '@kubio/utils';
import {
	BaseControl,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	RangeControl,
} from '@wordpress/components';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { clamp, isNaN } from 'lodash';
import { InputNumber } from './styled-components/input-number';

const isEmptyCanBeZero = (value) => {
	return !value && value !== 0 && value !== '0';
};

const GutentagRangeControl = (props) => {
	let {
		onChange: onValueChange,
		onReset,
		value: _value,
		label,
		allowReset = true,
		capMin = true,
		capMax = false,
		withInputField = true,
		resetValue = UNSET_VALUE,
		min = 0,
		max = 100,
		step = 1,
		decimals = 2,
		defaultSliderValue,
		...rest
	} = props;

	const [value, setValue] = useState(_value);

	useEffect(() => {
		if (parseFloat(value) !== parseFloat(_value)) {
			setValue(parseFloat(_value));
		}
	}, [_value]);

	const inputMin = !!capMin ? min : Number.MIN_SAFE_INTEGER;
	const inputMax = !!capMax ? max : Number.MAX_SAFE_INTEGER;

	const onResetDefault = () => {
		onChange(defaultSliderValue);
	};

	onReset = onReset || onResetDefault;

	const handleResetOnClick = () => {
		if (resetValue !== UNSET_VALUE) {
			onChange(resetValue);
		} else {
			onReset();
		}
	};

	const onValueChangeRef = useRef();
	onValueChangeRef.current = onValueChange;

	const onChange = useCallback((nextValue) => {
		if (!isNaN(nextValue) && nextValue !== '') {
			nextValue = toFixedDecimals(nextValue, decimals);
		}
		setValue(nextValue);
		onValueChangeRef.current(nextValue);
	}, []);

	const onInputChange = useDebounce(
		useCallback(
			(newValue) => {
				if (newValue || newValue === 0 || newValue === '0') {
					newValue = toFixedDecimals(newValue, decimals);
				}

				if (newValue < inputMin) {
					newValue = inputMin;
				}
				if (newValue > inputMax) {
					newValue = inputMax;
				}

				onValueChangeRef.current(newValue);
			},
			[inputMin, inputMax]
		),
		300
	);

	defaultSliderValue = !isEmptyCanBeZero(defaultSliderValue)
		? defaultSliderValue
		: min;
	let sliderValue = !isEmptyCanBeZero(value) ? value : defaultSliderValue;

	//transform NaN value to empty string to fix js warnings and make the input value empty. This is usefull for reset.
	//Don't convert '' to nubmer because it will be converted to 0 and it's not intended
	const inputValue =
		isNaN(Number(value)) || value === '' ? '' : Number(value);

	sliderValue =
		isNaN(Number(sliderValue)) || value === '' ? '' : Number(sliderValue);
	return (
		<BaseControl
			className={classNames('kubio-range-with-unit', 'kubio-control')}
		>
			{label?.length && (
				<BaseControl.VisualLabel>{label}</BaseControl.VisualLabel>
			)}
			<Flex className={'kubio-range-with-unit-flex-container'}>
				<FlexBlock>
					<RangeControl
						className={'kubio-range-with-unit-range-control'}
						{...rest}
						min={min}
						max={max}
						step={step}
						value={parseFloat(clamp(sliderValue, min, max))}
						onChange={onChange}
						withInputField={false}
						decimals={decimals}
					/>
				</FlexBlock>

				{withInputField && (
					<FlexItem align={'center'}>
						<InputNumber
							className="components-range-control__number"
							inputMode="decimal"
							min={inputMin}
							max={inputMax}
							step={step}
							{...rest}
							onChange={onInputChange}
							value={inputValue}
						/>
					</FlexItem>
				)}
				{allowReset && (
					<FlexItem align={'center'} style={{ display: 'flex' }}>
						<Button
							isSmall
							icon={ResetIcon}
							label={__('Reset', 'kubio')}
							className={
								'kubio-popover-options-icon kubio-color-indicator-popover-reset-icon kubio-border-control-button'
							}
							// disabled={!isDirty}
							onClick={handleResetOnClick}
						/>
					</FlexItem>
				)}
			</Flex>
		</BaseControl>
	);
};

export default GutentagRangeControl;
