import {
	BoxShadowWithPath,
	BoxShadowPopupWithPath,
	ColorIndicatorPopover,
	GutentagSelectControl,
	PopoverOptionsButton,
	RangeWithUnitControl,
	RangeWithUnitWithPath,
	ToggleControlWithPath,
} from '@kubio/controls';
import {
	useTransformStyle,
	withComputedData,
	WithDataPathTypes,
	useActiveMedia,
} from '@kubio/core';
import { types } from '@kubio/style-manager';
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { properties } from '../../../edit/config';
import { ElementsEnum } from '../../../elements';
const commonDataHelperOptions = {
	styledComponent: ElementsEnum.FRAME_IMAGE,
};

const setStyleOnBorder = (path, value, dataHelper) => {
	const sides = ['left', 'right', 'bottom', 'top'];

	const border = {};
	sides.forEach((side) => {
		_.set(border, `${side}.${path}`, value);
	});

	dataHelper.setStyle('border', border, commonDataHelperOptions);
};

const PopupContent = ({ computed }) => {
	const {
		width,
		height,
		frameTypeIs,
		frameOverImage,
		frameType,
		color,
		offsetLeft,
		offsetTop,
		frameThickness,
		dataHelper,
		isOnDesktop,
	} = computed;

	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.FRAME_IMAGE,
	};

	return (
		<>
			<GutentagSelectControl
				label={__('Type', 'kubio')}
				{...frameType}
				disabled={!isOnDesktop}
				options={properties.frameTypeOptions}
			/>

			<ColorIndicatorPopover
				label={__('Color', 'kubio')}
				showReset={true}
				{...color}
			/>

			<RangeWithUnitWithPath
				label={__('Width', 'kubio')}
				path={'width'}
				defaultUnit={'%'}
				{...properties.procentUnitsOptions}
				{...commonOptions}
				{...width}
			/>
			<RangeWithUnitWithPath
				label={__('Height', 'kubio')}
				path={'height'}
				defaultUnit={'%'}
				{...properties.procentUnitsOptions}
				{...commonOptions}
				{...height}
			/>
			<RangeWithUnitControl
				label={__('Offset left', 'kubio')}
				{...properties.frameOffsetTransformOptions}
				{...offsetLeft}
			/>
			<RangeWithUnitControl
				label={__('Offset top', 'kubio')}
				{...properties.frameOffsetTransformOptions}
				{...offsetTop}
			/>

			{frameTypeIs.border && (
				<RangeWithUnitWithPath
					label={__('Frame thickness', 'kubio')}
					path={[
						'border.top.width',
						'border.right.width',
						'border.bottom.width',
						'border.left.width',
					]}
					{...properties.frameThicknessOptions}
					{...commonOptions}
					{...frameThickness}
				/>
			)}

			<ToggleControl
				className={'kubio-toggle-control'}
				label={__('Show frame over image', 'kubio')}
				checked={frameOverImage.value}
				onChange={frameOverImage.onChange}
			/>

			<BoxShadowPopupWithPath
				label={__('Show frame shadow', 'kubio')}
				path={'boxShadow'}
				allowInset={true}
				showReset={false}
				dataHelper={dataHelper}
				{...commonOptions}
			/>
		</>
	);
};

const Component = (props) => {
	const frameEnabled = props?.computed?.frameEnabled;

	return (
		<PopoverOptionsButton
			label={__('Frame options', 'kubio')}
			toggable={true}
			position={'middle left'}
			onToggleChange={frameEnabled.onChange}
			enabled={!!frameEnabled.value}
			popoverWidth={280}
			popupContent={<PopupContent {...props} />}
		/>
	);
};
const useComputed = (dataHelper) => {
	const activeMedia = useActiveMedia();
	const isOnDesktop = activeMedia === 'desktop';
	const transformDataHelper = useTransformStyle(dataHelper);
	const unsetValue = getDefaultValue('transform.translate[0].value');
	const offsetLeft = transformDataHelper.useStylePath(
		'transform.translate.x',
		{
			unsetValue,
			styledComponent: ElementsEnum.FRAME_IMAGE,
		}
	);
	const offsetTop = transformDataHelper.useStylePath(
		'transform.translate.y',
		{
			unsetValue,
			styledComponent: ElementsEnum.FRAME_IMAGE,
		}
	);
	const onChangeType = (event) => {
		dataHelper.setProp('frame.type', event);
		switch (event) {
			case properties.frameTypeValues.BORDER:
				const backgroundColor = dataHelper.getStyle(
					'background.color',
					'',
					commonDataHelperOptions
				);
				setStyleOnBorder('color', backgroundColor, dataHelper);
				setStyleOnBorder('style', 'solid', dataHelper);
				dataHelper.setStyle(
					'background.color',
					'transparent',
					commonDataHelperOptions
				);
				break;

			case properties.frameTypeValues.BACKGROUND:
				setStyleOnBorder('style', 'none', dataHelper);

				const borderColor = dataHelper.getStyle(
					'border.top.color',
					'',
					commonDataHelperOptions
				);

				dataHelper.setStyle(
					'background.color',
					borderColor,
					commonDataHelperOptions
				);
				break;
		}
	};

	const frame = dataHelper.usePropPath('frame', {}, 'border');
	const frameType = {
		onChange: onChangeType,
		value: frame.value?.type,
	};

	const frameTypeValues = properties.frameTypeValues;
	const frameTypeIs = {
		background: frameTypeValues.BACKGROUND === frameType.value,
		border: frameTypeValues.BORDER === frameType.value,
	};

	const onChangeColor = (event) => {
		if (frameTypeIs.border) {
			setStyleOnBorder('color', event, dataHelper);
		} else {
			dataHelper.setStyle(
				'background.color',
				event,
				commonDataHelperOptions
			);
		}
	};
	const onResetColor = () => {
		if (frameTypeIs.border) {
			const resetValue = getDefaultValue('border.top.color');
			setStyleOnBorder('color', resetValue, dataHelper);
		} else {
			const resetValue = getDefaultValue('background.color');
			dataHelper.setStyle(
				'background.color',
				resetValue,
				commonDataHelperOptions
			);
		}
	};
	let colorValue = '';
	if (frameTypeIs.background) {
		colorValue = dataHelper.getStyle(
			'background.color',
			'',
			commonDataHelperOptions
		);
	} else {
		colorValue = dataHelper.getStyle(
			'border.top.color',
			'',
			commonDataHelperOptions
		);
	}

	const color = {
		value: colorValue,
		onChange: onChangeColor,
		onReset: onResetColor,
	};

	const onChangeFrameOverImage = (event) => {
		dataHelper.setPropInMedia('frame.showFrameOverImage', event);
		if (event) {
			dataHelper.setStyle('zIndex', 1, commonDataHelperOptions);
		} else {
			dataHelper.setStyle('zIndex', -1, commonDataHelperOptions);
		}
	};

	const frameOverImage = {
		value: dataHelper.getPropInMedia('frame.showFrameOverImage', false),
		onChange: onChangeFrameOverImage,
	};

	function getDefaultValue(path) {
		return _.get(
			types.props.frameImage.default,
			`style.descendants.frameImage.${path}`
		);
	}

	const applyFrameDefaultStyle = () => {
		dataHelper.mergeInMainAttribute(types.props.frameImage.default);
	};

	const onChangeFrameEnable = (event) => {
		if (event) {
			const hasNoStyle =
				dataHelper.getStyle('zIndex', null, {
					...commonDataHelperOptions,
				}) === null;
			if (hasNoStyle) {
				applyFrameDefaultStyle();
			}
		}

		dataHelper.setPropInMedia('frame.enabled', event);
	};

	const frameEnabled = {
		value: dataHelper.getPropInMedia('frame.enabled'),
		onChange: onChangeFrameEnable,
	};

	const frameThickness = {
		onReset: () => {
			setStyleOnBorder(
				'width',
				getDefaultValue('border.top.width'),
				dataHelper
			);
		},
	};

	const width = {
		onReset: () => {
			dataHelper.setStyle(
				'width',
				getDefaultValue('width'),
				commonDataHelperOptions
			);
		},
	};
	const height = {
		onReset: () => {
			dataHelper.setStyle(
				'height',
				getDefaultValue('height'),
				commonDataHelperOptions
			);
		},
	};

	return {
		width,
		height,
		color,
		frameOverImage,
		frameTypeIs,
		frameEnabled,
		frameType,
		frame,
		offsetLeft,
		offsetTop,
		frameThickness,
		dataHelper,
		isOnDesktop,
	};
};

const FrameOptionsWithData = withComputedData(useComputed)(Component);
export default FrameOptionsWithData;
