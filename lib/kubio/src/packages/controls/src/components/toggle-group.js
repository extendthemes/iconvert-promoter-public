import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalRadio as Radio,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalRadioGroup as RadioGroup,
	BaseControl,
	Tooltip,
} from '@wordpress/components';
import { useState, useRef, useCallback, useEffect } from '@wordpress/element';
import { Icon } from '@wordpress/icons';

const RadioGroupItem = ({ option }) => {
	const optionLabel = option.icon ? (
		<Icon icon={option.icon} />
	) : (
		<>{option.label}</>
	);
	const radio = <Radio value={option.value}>{optionLabel}</Radio>;
	if (option.tooltip) {
		return <Tooltip text={option.tooltip}>{radio}</Tooltip>;
	}
	return radio;
};

const ToggleGroupBase = (props) => {
	const {
		options,
		checked,
		onChange: onChange_,
		label,
		className,
		...rest
	} = props;

	const [value, setValue] = useState(checked);

	const onChangeRef = useRef();
	onChangeRef.current = onChange_;

	const onChange = useCallback((nextValue) => {
		setValue(nextValue);
		onChangeRef.current(nextValue);
	}, []);

	useEffect(() => {
		setValue(checked);
	}, [checked]);

	return (
		<RadioGroup
			{...rest}
			accessibilityLabel={label}
			className={'kubio-streched-radio-group ' + className}
			checked={value}
			onChange={onChange}
		>
			{options.map((option) => (
				<RadioGroupItem key={option.value} option={option} />
			))}
		</RadioGroup>
	);
};

const ToggleGroup = (props) => {
	const { value, onChange, label, className, ...rest } = props;
	return (
		<BaseControl>
			<BaseControl.VisualLabel>{label}</BaseControl.VisualLabel>
			<ToggleGroupBase
				{...rest}
				className={className}
				checked={value}
				onChange={onChange}
			/>
		</BaseControl>
	);
};

export { ToggleGroup };
