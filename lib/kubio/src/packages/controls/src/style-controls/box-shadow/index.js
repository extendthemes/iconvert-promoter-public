import {
	Button,
	FormToggle,
	TabPanel,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { ResetIcon } from '@kubio/icons';
import { types } from '@kubio/style-manager';
import { useEffect, useRef, useState } from '@wordpress/element';
import classnames from 'classnames';
import _ from 'lodash';
import {
	ColorIndicatorPopover,
	InlineLabeledControl,
	PreviewBoxControl,
} from '../../components';
import { BoxShadowCustomControl } from './box-shadow-custom';
import { BoxShadowPopup } from './box-shadow-popup';
import { BoxShadowPresetsControl } from './box-shadow-presets/presets-control';
import { useUIVersion } from '@kubio/core-hooks';
const tabs = [
	{
		name: 'preset',
		// title: __('Preset', 'kubio'),
		className: 'tab-preset',
		control: BoxShadowPresetsControl,
	},
	{
		name: 'custom',
		title: __('Custom', 'kubio'),
		className: 'tab-custom',
		control: BoxShadowCustomControl,
	},
];

const BoxShadowControl = (props) => {
	const {
		value,
		onChange,
		onReset = _.noop,
		showReset = false,
		label = __('Box shadow', 'kubio'),
	} = props;

	const {
		mergedValue,
		localEnabledValue,
		onEnabledChange,
	} = useGetMergedValue({ value, onChange });

	return (
		<>
			<InlineLabeledControl
				className={
					'kubio-popover-options-button-canvas kubio-box-shadow-label'
				}
				label={label}
			>
				<div className={'kubio-popover-options-button__toggle'}>
					<FormToggle
						checked={localEnabledValue}
						onChange={onEnabledChange}
					/>
				</div>
				{showReset && (
					<Button
						isSmall
						icon={ResetIcon}
						label={__('Reset', 'kubio')}
						className={
							'kubio-popover-options-icon kubio-color-indicator-popover-reset-icon'
						}
						onClick={onReset}
					/>
				)}
			</InlineLabeledControl>
			{localEnabledValue && (
				<BoxShadowContent
					{...props}
					mergedValue={mergedValue}
					enabled={localEnabledValue}
				/>
			)}
		</>
	);
};

function useGetMergedValue({ value: currentValue_ = {}, onChange }) {
	const { enabled, layers = [] } = currentValue_;
	const firstLayer = layers.length ? layers[0] : {};

	const mergedValue = _.merge(
		{},
		types.props.boxShadow.default.layers[0],
		firstLayer
	);

	const [localEnabledValue, setLocalEnabledValue] = useState(!!enabled);

	useEffect(() => {
		if (localEnabledValue !== enabled) {
			setLocalEnabledValue(enabled);
		}
	}, [enabled]);

	const onEnabledChange = () => {
		const newValue = !localEnabledValue;
		setLocalEnabledValue(newValue);
		onChange({
			enabled: newValue,
		});
	};

	return {
		mergedValue,
		localEnabledValue,
		onEnabledChange,
	};
}

function BoxShadowContent(props) {
	const { mergedValue, onChange, enabled, allowInset } = props;

	let { spread, x, y, blur, inset, color } = mergedValue;

	const boxStyle = {
		boxShadow:
			inset +
			' ' +
			x +
			'px ' +
			y +
			'px ' +
			blur +
			'px ' +
			spread +
			'px ' +
			color,
	};
	if (inset === undefined) inset = '';
	const [insetToggleValue, setInsetToggleValue] = useState(!!inset);
	const previewBoxControlRef = useRef();

	const updateValue = (propName, propValue) => {
		const newLayers = {
			[propName]: propValue,
		};
		const changes = {
			layers: [newLayers],
		};
		return onChange(changes);
	};

	const closePopup = () => {
		try {
			previewBoxControlRef.current.close();
		} catch (e) {}
	};

	const onPresetSelect = (value) => {
		closePopup();
		onChange(_.omit(value, ['color']));
	};
	const previewBoxContent = (
		<div className="kubio-box-shadow-preview" style={boxStyle} />
	);

	const onPropertyChange = (prop) => (value) => updateValue(prop, value);

	const updateInsetValue = () => {
		const newValue = !insetToggleValue;
		setInsetToggleValue(newValue);
		if (inset === '') {
			updateValue('inset', 'inset');
		} else updateValue('inset', '');
	};

	const previewBoxPopup = (
		<TabPanel
			className={'kubio-streched-tabs kubio-box-shadow-tab'}
			tabs={tabs}
		>
			{(tab) => {
				const TabControl = tab.control;
				return (
					<TabControl
						{...props}
						onChange={onPresetSelect}
						className={classnames(
							'kubio-box-shadow-tab',
							props.className
						)}
					/>
				);
			}}
		</TabPanel>
	);

	const { uiVersion } = useUIVersion();

	return (
		<>
			<PreviewBoxControl
				popoverPosition={uiVersion === 2 ? 'top right' : 'top left'}
				ref={previewBoxControlRef}
				popoverContent={previewBoxPopup}
				previewContent={previewBoxContent}
			/>

			<div className="kubio-box-shadow-values-container">
				<div className="kubio-box-shadow-inputs-container">
					<NumberControl
						label={__('X', 'kubio')}
						value={x}
						onChange={onPropertyChange('x')}
						min={-100}
						max={100}
					/>
					<NumberControl
						label={__('Y', 'kubio')}
						value={y}
						onChange={onPropertyChange('y')}
						min={-100}
						max={100}
					/>
					<NumberControl
						label={__('Blur', 'kubio')}
						value={blur}
						onChange={onPropertyChange('blur')}
						min={0}
						max={100}
					/>
					<NumberControl
						label={__('Spread', 'kubio')}
						value={spread}
						onChange={onPropertyChange('spread')}
						min={-100}
						max={100}
					/>
				</div>

				<ColorIndicatorPopover
					value={color}
					onChange={onPropertyChange('color')}
				/>
			</div>

			{allowInset && (
				<InlineLabeledControl
					className={'kubio-popover-options-button-canvas'}
					label={__('Inset', 'kubio')}
				>
					<div className={'kubio-popover-options-button__toggle'}>
						<FormToggle
							checked={!!inset}
							onChange={updateInsetValue}
						/>
					</div>
				</InlineLabeledControl>
			)}
		</>
	);
}

export {
	BoxShadowControl,
	BoxShadowContent,
	useGetMergedValue,
	BoxShadowPopup,
};
