import { useState } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';
import { __experimentalUnitControl as UnitControl } from '@wordpress/block-editor';
import { BaseControl } from '@wordpress/components';
import { noop } from 'lodash';

//todo: just for testing, drop
const CSS_UNITS = [
	{ value: 'px', label: 'px', default: 430 },
	{ value: 'em', label: 'em', default: 20 },
	{ value: 'rem', label: 'rem', default: 20 },
	{ value: 'vw', label: 'vw', default: 20 },
	{ value: 'vh', label: 'vh', default: 50 },
];

function UnitValueInput({
	onChange = noop,
	onValueChange = noop,
	onUnitChange = noop,
	step = 1,
	min = 0,
	max = 1000,
	value: valueAsObject = {},
	label = 'Label',
	units = CSS_UNITS,
}) {
	const { unit = 'px', value = '' } = valueAsObject;
	const [temporaryInput, setTemporaryInput] = useState(null);
	const instanceId = useInstanceId(UnitControl);
	const inputId = `unit-value-input-${instanceId}`;

	const handleOnUnitChange = (_unit) => {
		onUnitChange(_unit);
		onChange({
			unit,
			value,
		});
	};

	const handleOnValueChange = (unprocessedValue) => {
		const inputValue =
			unprocessedValue !== ''
				? parseInt(unprocessedValue, 10)
				: undefined;

		if (isNaN(inputValue) && inputValue !== undefined) {
			setTemporaryInput(unprocessedValue);
			return;
		}
		setTemporaryInput(null);
		onValueChange(inputValue);
		onChange({
			value: inputValue,
			unit,
		});
	};

	const handleOnBlur = () => {
		if (temporaryInput !== null) {
			setTemporaryInput(null);
		}
	};

	const inputValue = temporaryInput !== null ? temporaryInput : value;

	return (
		<BaseControl label={label} id={inputId}>
			<UnitControl
				id={inputId}
				min={min}
				onBlur={handleOnBlur}
				onChange={handleOnValueChange}
				onUnitChange={handleOnUnitChange}
				step={step}
				style={{ maxWidth: 80 }}
				unit={unit}
				units={units}
				value={inputValue}
			/>
		</BaseControl>
	);
}

export { UnitValueInput };
