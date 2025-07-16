import { __ } from '@wordpress/i18n';
import { HeightTypesEnum } from '@kubio/style-manager';
import { GutentagSelectControl } from '../../components';
import { RangeWithUnitControl } from '../../components/range-with-unit/range-with-unit';
import {
	heightTypesOptions,
	heightUnitsConfig,
	heightUnitsOptions,
} from '../utils/height';

const CustomRangeControl = (props) => {
	const options = heightUnitsConfig[props?.value?.unit || 'px'];
	return (
		<RangeWithUnitControl
			{...options}
			units={heightUnitsOptions}
			allowReset
			{...props}
		/>
	);
};

const CustomHeightControl = (props) => {
	const { label = 'Height', value = {}, onChange } = props;
	const {
		'min-height': minHeight = {
			unit: 'px',
			value: '',
		},
		type = HeightTypesEnum.FIT_TO_CONTENT,
	} = value;

	const isMinHeight = type === HeightTypesEnum.MIN_HEIGHT;

	return (
		<>
			<GutentagSelectControl
				className={'kubio-select-control-container'}
				label={label}
				value={type}
				onChange={(newType) => {
					onChange({
						...value,
						type: newType,
					});
				}}
				options={heightTypesOptions}
			/>

			{isMinHeight && (
				<CustomRangeControl
					label={__('Min height', 'kubio')}
					value={minHeight}
					onChange={(newValue) => {
						onChange({
							...value,
							type: HeightTypesEnum.MIN_HEIGHT,
							'min-height': newValue,
						});
					}}
					onReset={() => {
						onChange({
							...value,
							type: HeightTypesEnum.MIN_HEIGHT,
							'min-height': {
								unit: 'px',
								value: '',
							},
						});
					}}
				/>
			)}
		</>
	);
};

export { CustomHeightControl };
