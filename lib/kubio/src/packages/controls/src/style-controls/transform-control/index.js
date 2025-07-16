import { useDeepMemo } from '@kubio/core';
import { Styles } from '@kubio/style-manager';
import { mergeNoArrays } from '@kubio/utils';
import { Flex } from '@wordpress/components';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import _ from 'lodash';
import {
	InlineLabeledControl,
	PopoverOptionsButton,
	PreviewBoxControl,
	RangeWithUnitControl,
	SeparatorHorizontalLine,
	SortableAccordion,
	ToggleGroup,
} from '../../components';
import {
	availableUnits,
	basicModeFilteredAxis,
	defaultValue,
	getTransformValueWithPerspectiveScaled,
	optionsByType,
	transformModeOptions,
	transformModeValues,
	transformTypes,
	transformTypesOptions,
} from './config';
import { TransformPresetsControl } from './presets-control';
import { TransformOriginControl } from './transform-origin';

const TransformControl = (props) => {
	const { parser } = Styles.transform;
	const { onChange, onReset, value: _currentValue } = props;
	const [currentType, setCurrentType] = useState(transformTypes.TRANSLATE);
	const [localValue, onChangeLocalValue] = useState(_currentValue);
	const [transformMode, setTransformMode] = useState(
		getTransformMode(localValue)
	);

	const mergedValue = mergeNoArrays({}, defaultValue, localValue);

	const handleReset = () => {
		onReset();
	};
	const previewBoxControlRef = useRef();
	const closePopup = () => {
		try {
			previewBoxControlRef.current.close();
		} catch (e) {}
	};
	const axisValueWithDefault = useDeepMemo(() => {
		if (currentType === transformTypes.PERSPECTIVE) {
			return [];
		}
		const defaultValueForAxis = _.get(defaultValue, currentType, []);
		const currentValueForType = _.get(localValue, currentType);
		const initialValue = _.cloneDeep(
			mergeNoArrays([], defaultValueForAxis, currentValueForType)
		);
		return initialValue;
	}, [defaultValue, currentType, localValue]);

	const getValue = (path) => {
		const defaultValueByType = _.get(
			optionsByType,
			[currentType, 'default'],
			null
		);
		return _.get(mergedValue, path, defaultValueByType);
	};

	function getItemIndex(item) {
		const axis = item?.axis;
		const itemIndex = _.findIndex(
			axisValueWithDefault,
			(element) => element?.axis === axis
		);

		return itemIndex;
	}

	const getAxisValue = (item) => {
		const itemIndex = getItemIndex(item);
		return getValue(`${currentType}.${itemIndex}.value`);
	};

	const onChangeAxis = (item, value) => {
		const index = getItemIndex(item);
		const currentTypeChanges = _.cloneDeep(axisValueWithDefault);
		_.set(currentTypeChanges, `${index}.value`, value);

		const newLocalData = { ...localValue };
		_.set(newLocalData, currentType, currentTypeChanges);

		onChangeLocalValue(newLocalData);
		onChange(currentTypeChanges, currentType);
	};

	const onResetAxis = (item) => () => {
		const itemIndex = getItemIndex(item);
		const currentTypeChanges = _.cloneDeep(_.get(localValue, currentType));
		const currentTypeResetPath = `${itemIndex}.value`;
		_.unset(currentTypeChanges, currentTypeResetPath);

		const newLocalData = { ...localValue };
		_.set(newLocalData, currentType, currentTypeChanges);

		onChangeLocalValue(newLocalData);

		//because axis work with arrays when you reset something from the array we need to unset the localValue and
		//send onChange with the whole array with the changes
		onChange(currentTypeChanges, currentType);
	};

	const handlePropertyChange = (path) => (value) => {
		const changes = _.set({}, path, value);
		const newLocalValue = _.merge({}, localValue, changes);

		onChangeLocalValue(newLocalValue);
		onChange(changes);
	};

	const handlePropertyReset = (path) => () => {
		const newLocalValue = { ...localValue };
		_.unset(newLocalValue, path);

		onChangeLocalValue(newLocalValue);
		onReset(path);
	};

	const onTypeChange = (newType) => {
		setCurrentType(newType);
	};
	function onChangeTransformMode(newTransformMode, localValue) {
		//when moving from advanced to basic if we are on the perspective tab we need to move to another one supported by the basic mode
		if (
			newTransformMode === transformModeValues.BASIC &&
			currentType === transformTypes.PERSPECTIVE
		) {
			setCurrentType(transformTypes.TRANSLATE);
		}

		if (newTransformMode === transformModeValues.BASIC) {
			const changes = getAdvancedToBasicAxisChanges(localValue);
			_.each(changes, (data, property) => {
				//we need onChange because the axis we arrays and they are more tricky. We need to change the whole array
				//for the change to work properly
				onChange(data, property);
			});

			//for perspective
			if (_.get(localValue, 'perspective.value')) {
				onReset('perspective');
			}
		}

		setTransformMode(newTransformMode);
	}

	const handleOriginChange = (path, value) => {
		const mergedPath = `origin.${path}`;
		handlePropertyChange(mergedPath)(value);
	};
	const handleOriginReset = (path) => () => {
		const mergedPath = `origin.${path}`;
		handlePropertyReset(mergedPath)();
	};

	const selectPreset = (preset) => {
		//only change the store value so the localValue update on the next useEffect and execute changes to transformMode
		//if needed
		// onChangeLocalValue(preset);
		onChange(preset, null, { mergeData: false });
		closePopup();
	};

	const getTransformItems = () => {
		if (currentType === transformTypes.PERSPECTIVE) {
			return [];
		}

		let items = getValue(currentType);
		if (!Array.isArray(items)) {
			items = [];
		}
		if (transformMode === transformModeValues.ADVANCED) {
			// #39691 - in Colibri there is no Z axis on skew.
			if (currentType === transformTypes.SKEW) {
				return items.filter((item) => {
					return item.axis !== 'z';
				});
			}

			return items;
		}
		//for basic we filter some axis
		const filteredAxis = _.get(basicModeFilteredAxis, currentType, []);
		const filteredItems = items.filter((item) => {
			return !filteredAxis.includes(item?.axis);
		});

		return filteredItems;
	};

	const transformItems = useMemo(() => {
		return getTransformItems();
	}, [JSON.stringify(localValue), currentType, transformMode]);

	const handleSort = ({ newIndex, oldIndex }) => {
		const changes = _.cloneDeep(axisValueWithDefault);

		const oldAxis = _.get(changes, `${oldIndex}`);
		const newAxis = _.get(changes, `${newIndex}`);

		_.set(changes, `${newIndex}`, oldAxis);
		_.set(changes, `${oldIndex}`, newAxis);

		const newLocalValue = { ...localValue };
		_.set(newLocalValue, currentType, changes);

		onChangeLocalValue(newLocalValue);
		onChange(changes, currentType);
	};

	useEffect(() => {
		if (!_.isEqual(_currentValue, localValue)) {
			onChangeLocalValue(_currentValue);
			const newTransformMode = getTransformMode(_currentValue);
			if (newTransformMode !== transformMode) {
				onChangeTransformMode(newTransformMode, _currentValue);
			}
		}
	}, [_currentValue]);

	const previewBoxPopup = (
		<div className="kubio-transform-presets">
			<TransformPresetsControl
				currentValues={localValue}
				parser={parser}
				onSelect={selectPreset}
			/>
		</div>
	);
	const previewBoxContent = (
		<>
			<div className="kubio-transform-preview" />
			<div
				className="kubio-transform-preview"
				style={parser(
					getTransformValueWithPerspectiveScaled(localValue)
				)}
			/>
		</>
	);

	const filteredTransformTypeOptions = useMemo(() => {
		let options = [];

		switch (transformMode) {
			case transformModeValues.BASIC:
				options = transformTypesOptions.filter(
					(item) => item.value !== transformTypes.PERSPECTIVE
				);
				break;
			case transformModeValues.ADVANCED:
				options = transformTypesOptions;
		}

		return options;
	}, [transformMode]);
	const isBasic = transformMode === transformModeValues.BASIC;

	const getAxisLabel = (item) => {
		if (currentType === transformTypes.ROTATE && isBasic) {
			return __('Rotate', 'kubio');
		}

		return sprintf(
			// translators: %s: Type of block (i.e. Text, Image etc)
			__(`%s - axis`, 'kubio'),
			item.axis?.toUpperCase()
		);
	};

	return (
		<div className={'kubio-transform-control'}>
			<InlineLabeledControl label={__('Preview Transform', 'kubio')} />
			<PreviewBoxControl
				ref={previewBoxControlRef}
				popoverContent={previewBoxPopup}
				previewContent={previewBoxContent}
			/>
			<ToggleGroup
				value={transformMode}
				onChange={(newValue) => {
					onChangeTransformMode(newValue, localValue);
				}}
				options={transformModeOptions}
			/>
			<ToggleGroup
				className={'kubio-background-type-container'}
				allowReset={true}
				value={currentType}
				options={filteredTransformTypeOptions}
				resetOnLabel={false}
				onReset={handleReset}
				onChange={onTypeChange}
			/>

			{currentType === transformTypes.PERSPECTIVE ? (
				<RangeWithUnitControl
					label={__('Perspective', 'kubio')}
					onChange={handlePropertyChange('perspective')}
					onReset={handlePropertyReset('perspective')}
					units={availableUnits[transformTypes.PERSPECTIVE]}
					value={getValue('perspective')}
				/>
			) : (
				<SortableAccordion
					allowDuplicate={false}
					allowDelete={false}
					sortDisable={isBasic}
					items={transformItems}
					onSortEnd={handleSort}
					tooltip={false}
					headingRenderer={(item, itemIndex) => (
						<RangeWithUnitControl
							label={getAxisLabel(item)}
							onChange={(v) => onChangeAxis(item, v)}
							onReset={onResetAxis(item)}
							units={availableUnits[currentType]}
							value={getAxisValue(item)}
							{...optionsByType[currentType]}
						/>
					)}
				/>
			)}

			<SeparatorHorizontalLine />

			<Flex justify={'space-between'}>
				<span>{__('Transform origin', 'kubio')}</span>
				<PopoverOptionsButton
					popoverWidth={250}
					popupContent={
						<TransformOriginControl
							value={getValue('origin')}
							onChange={handleOriginChange}
							onReset={handleOriginReset}
						/>
					}
				/>
			</Flex>
		</div>
	);
};
const isEmptyCanBeZero = (value) => {
	return !value && value !== 0 && value !== '0';
};
function getTransformMode(data) {
	let hasAdvancedValue = false;
	_.each(data, (currentPropertyData, property) => {
		const axisToFilter = _.get(basicModeFilteredAxis, property, null);
		if (axisToFilter === null || !Array.isArray(currentPropertyData)) {
			return;
		}
		currentPropertyData.forEach((item) => {
			const hasValue = !isEmptyCanBeZero(
				_.get(item, 'value.value', null)
			);
			if (hasValue && axisToFilter.includes(item?.axis)) {
				hasAdvancedValue = true;
			}
		});
	});

	//perspective does not have axis
	if (_.get(data, 'perspective.value')) {
		hasAdvancedValue = true;
	}

	const transformMode = hasAdvancedValue
		? transformModeValues.ADVANCED
		: transformModeValues.BASIC;
	return transformMode;
}

function getAdvancedToBasicAxisChanges(advancedData) {
	const changes = {};
	_.each(advancedData, (data, property) => {
		const axisToFilter = _.get(basicModeFilteredAxis, property, null);
		if (axisToFilter === null || !Array.isArray(data)) {
			return;
		}
		const currentPropertyData = _.cloneDeep(data);
		let hasAdvancedValue = false;
		currentPropertyData.forEach((item) => {
			const hasValue = !isEmptyCanBeZero(
				_.get(item, 'value.value', null)
			);
			if (hasValue && axisToFilter.includes(item?.axis)) {
				hasAdvancedValue = true;
				_.unset(item, 'value');
			}
		});
		if (hasAdvancedValue) {
			_.set(changes, property, currentPropertyData);
		}
	});

	return changes;
}

export { TransformControl };
