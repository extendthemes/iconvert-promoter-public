import { useDebounce } from '@kubio/core';
import { types } from '@kubio/style-manager';
import { useCallback, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { GutentagSelectControl, RangeWithUnitControl } from '../../components';

const ColumnWidthTypes = types.props.columnWidth.enums.types;

const widthOptions = [
	{
		value: ColumnWidthTypes.EQUAL_WIDTH_COLUMNS,
		label: 'equal width columns',
	},
	{ value: ColumnWidthTypes.CUSTOM, label: 'fixed width' },
	{ value: ColumnWidthTypes.FIT_TO_CONTENT, label: 'fit to content' },
	{ value: ColumnWidthTypes.FLEX_GROW, label: 'expand to available space' },
];

const widthUnitsOptions = [
	{ label: 'PX', value: 'px' },
	{ label: '%', value: '%' },
];

const widthUnitsConfig = {
	px: {
		min: 0,
		max: 1000,
		step: 1,
	},
	'%': {
		min: 0,
		max: 100,
		step: 1,
	},
};

const columnWidthProperties = {
	widthOptions,
	ColumnWidthTypes,
	widthUnitsOptions,
	widthUnitsConfig,
};

const CustomRangeControl = (props) => {
	const options = widthUnitsConfig[props?.value?.unit || 'px'];

	const onChangeRef = useRef();
	onChangeRef.current = props.onChange;

	const onChange = useDebounce(
		useCallback((...args) => {
			onChangeRef.current(...args);
		}, []),
		30
	);

	return (
		<RangeWithUnitControl
			{...options}
			units={widthUnitsOptions}
			allowReset={false}
			{...props}
			onChange={onChange}
		/>
	);
};

const CustomWidthControl = (props) => {
	const {
		label = 'Width type',
		value = {},
		equalWidth = true,
		options,
		onChange,
		onEqualWidthChange,
	} = props;
	const { custom = {}, type = ColumnWidthTypes.CUSTOM } = value;
	const widthType = equalWidth ? ColumnWidthTypes.EQUAL_WIDTH_COLUMNS : type;
	const isCustom = widthType === ColumnWidthTypes.CUSTOM;

	const onCustomReset = () => {
		onChange(
			_.merge({}, value, {
				custom: {
					value: '',
				},
			})
		);
	};

	return (
		<>
			<GutentagSelectControl
				className={'kubio-custom-width-container'}
				label={label}
				value={widthType}
				onChange={(newType) => {
					const newEqualWidth =
						newType === ColumnWidthTypes.EQUAL_WIDTH_COLUMNS;
					if (equalWidth !== newEqualWidth) {
						onEqualWidthChange(newEqualWidth, newType);
					} else {
						if (newEqualWidth) {
							onEqualWidthChange(true, newType);
							return;
						}

						if (equalWidth) {
							onEqualWidthChange(false, newType);
						} else {
							onChange({
								...value,
								type: newType,
							});
						}
					}
				}}
				options={widthOptions}
			/>
			{isCustom && (
				<CustomRangeControl
					value={custom}
					label={__('Custom width', 'kubio')}
					onChange={(newValue) => {
						onChange({
							...value,
							type: ColumnWidthTypes.CUSTOM,
							custom: newValue,
						});
					}}
					onReset={onCustomReset}
				/>
			)}
		</>
	);
};

export { CustomWidthControl, columnWidthProperties };
