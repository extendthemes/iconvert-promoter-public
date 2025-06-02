import _, { set } from 'lodash';
import { Flex, FlexBlock, FlexItem } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useGlobalDataFonts } from '@kubio/global-data';
import {
	decorationOptions,
	sizeOptions,
	sizeUnitsOptions,
	styleOptions,
	transformOptions,
	weightOptions,
} from './config';
import {
	FontPicker,
	GutentagSelectControl,
	RangeWithUnitControl,
	ColorIndicatorPopover,
} from '../../components';
import { WithInheritedTypography } from '../../hocs/with-inherited-typography';

import { types } from '@kubio/style-manager';

const TypographyControl = (props) => {
	const { getFontWeights } = useGlobalDataFonts();
	let {
		onChange = _.noop,
		onReset = _.noop,
		value: currentValue,
		readValue,
		withFamily = true,
		withWeight = true,
		withColor = false,
		withSize = true,
		withTransform = true,
		withStyle = true,
		withDecoration = true,
		withLineHeight = true,
		withLetterSpacing = true,
		hideReset = false,
	} = props;

	readValue = readValue || currentValue;
	readValue = _.merge({}, types.props.typography.default, readValue);

	let { family, weight } = readValue;
	weight = Number(weight);
	const onPropChange = (path) => (newValue) => {
		const changes = set({}, path, newValue);
		onChange(changes);
	};

	const onResetValue = (path) => () => {
		onReset(path);
	};

	const getValue = (path) => {
		return _.get(readValue, path);
	};

	const getData = (path, fallback = '') => {
		return {
			value: getValue(path, fallback),
			onChange: onPropChange(path),
			onReset: onResetValue(path),
		};
	};

	const fontWeightProps = getData('weight');
	fontWeightProps.value = parseInt(fontWeightProps.value);

	const currentWeights = getFontWeights(getValue('family'));
	const currentWeightsOptions = weightOptions.filter(
		({ value }) => currentWeights.indexOf(value) !== -1
	);

	// When we try to set a font weight that doesn't exists, stick to default.
	useEffect(() => {
		if (parseInt(weight) === 400) {
			return;
		}

		const checkIfWeightExists = currentWeightsOptions.find((i) => {
			return i.value === parseInt(fontWeightProps.value);
		});

		if (!checkIfWeightExists) {
			onPropChange('weight')(400);
		}
	}, [weight, family]);

	return (
		<>
			{withFamily && (
				<Flex className="kubio-font-family-container">
					<FlexBlock>
						<span className={'kubio-font-family-label'}>
							{__('Font family', 'kubio')}
						</span>
					</FlexBlock>
					<FlexBlock className="kubio-font-family-container__select">
						<FontPicker {...getData('family')} />
					</FlexBlock>
				</Flex>
			)}

			{withWeight && (
				<GutentagSelectControl
					label={__('Weight', 'kubio')}
					className={'kubio-select-control-container'}
					{...fontWeightProps}
					options={currentWeightsOptions}
				/>
			)}

			{withColor && (
				<ColorIndicatorPopover
					showReset={!hideReset}
					label={__('Color', 'kubio')}
					alpha={true}
					{...getData('color')}
				/>
			)}

			{withSize && (
				<RangeWithUnitControl
					{...getData('size')}
					label={__('Size', 'kubio')}
					{...sizeOptions}
					allowReset={!hideReset}
				/>
			)}

			{withTransform && (
				<GutentagSelectControl
					label={__('Transform', 'kubio')}
					className={'kubio-select-control-container'}
					{...getData('transform')}
					options={transformOptions}
				/>
			)}

			{withStyle && (
				<GutentagSelectControl
					label={__('Style', 'kubio')}
					className={'kubio-select-control-container'}
					{...getData('style')}
					options={styleOptions}
				/>
			)}

			{withDecoration && (
				<GutentagSelectControl
					label={__('Decoration', 'kubio')}
					className={'kubio-select-control-container'}
					{...getData('decoration')}
					options={decorationOptions}
				/>
			)}

			{withLineHeight && (
				<RangeWithUnitControl
					label={__('Line height', 'kubio')}
					{...getData('lineHeight')}
					units={['']}
					defaultUnit={''}
					min={0}
					max={10}
					step={0.1}
					allowReset={!hideReset}
				/>
			)}

			{withLetterSpacing && (
				<RangeWithUnitControl
					label={__('Letter spacing', 'kubio')}
					{...getData('letterSpacing')}
					units={sizeUnitsOptions}
					min={0}
					max={10}
					allowReset={!hideReset}
				/>
			)}
		</>
	);
};

export default WithInheritedTypography(TypographyControl);
