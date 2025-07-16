import { __ } from '@wordpress/i18n';
import { types } from '@kubio/style-manager';
import _, { merge } from 'lodash';
import {
	Button,
	FormToggle,
	Popover,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import classnames from 'classnames';
import {
	ColorIndicatorPopover,
	InlineLabeledControl,
	PreviewBoxControl,
} from '../../../components';
import { TextShadowPresetsControl } from '../text-shadow-presets/presets-control';
import { moreHorizontal } from '@wordpress/icons';
import { useRef, useState, useEffect } from '@wordpress/element';

const { textShadow } = types.props;

const defaultValue = textShadow.default;

const TextShadowControlPopup = (props) => {
	const {
		value: currentValue_ = {},
		onChange = _.noop,
		onReset = _.noop,
	} = props;

	const mergedValue = merge(
		{ normalEnabled: false, hoverEnabled: false },
		defaultValue,
		currentValue_
	);

	const { enabled, normalEnabled, hoverEnabled } = mergedValue;
	const [localToggleValue, setToggleValue] = useState(enabled);
	const previewBoxControlRef = useRef();

	useEffect(() => {
		if (props.state === '' || !props.state) {
			setToggleValue(normalEnabled);
		} else {
			setToggleValue(hoverEnabled);
		}
	}, [props.state]);

	const closePopup = () => {
		try {
			previewBoxControlRef.current.close();
		} catch (e) {}
	};

	const updateValue = (propName, propValue) => {
		const changes = {
			[propName]: propValue,
		};
		return onChange(changes);
	};

	const onPropertyChange = (prop) => (value) => {
		updateValue(prop, value);
	};

	const { x, y, blur, color } = mergedValue;

	const updateToggleValue = () => {
		const newValue = !localToggleValue;
		setToggleValue(newValue);
		toggleChange(newValue);
	};

	const toggleChange = (value) => {
		updateValue('enabled', value);

		if (props.state === '' || !props.state) {
			updateValue('normalEnabled', value);
		} else {
			updateValue('hoverEnabled', value);
		}
	};

	const textStyle = {
		textShadow: x + 'px ' + y + 'px ' + blur + 'px ' + color,
	};

	const onPresetSelect = (value) => {
		closePopup();
		const newValue = _.cloneDeep(value);
		_.unset(newValue, 'color');
		onChange(newValue);
	};

	const previewBoxPopup = (
		<TextShadowPresetsControl
			{...props}
			onChange={onPresetSelect}
			className={classnames('kubio-box-shadow-tab', props.className)}
		/>
	);
	const previewBoxContent = (
		<div className="kubio-text-shadow-preview" style={textStyle}>
			T
		</div>
	);
	return (
		<>
			<InlineLabeledControl
				className={'kubio-popover-options-button-canvas'}
				label={__('Text shadow', 'kubio')}
			>
				<div className={'kubio-popover-options-button__toggle'}>
					<FormToggle
						checked={localToggleValue}
						onChange={updateToggleValue}
					/>
				</div>
			</InlineLabeledControl>
			{localToggleValue && (
				<>
					<PreviewBoxControl
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
								type={'number'}
								label={__('Y', 'kubio')}
								value={y}
								onChange={onPropertyChange('y')}
								min={-100}
								max={100}
							/>
							<NumberControl
								type={'number'}
								label={__('Blur', 'kubio')}
								value={blur}
								onChange={onPropertyChange('blur')}
								min={-100}
								max={100}
							/>
						</div>

						<ColorIndicatorPopover
							value={color}
							onChange={onPropertyChange('color')}
						/>
					</div>
				</>
			)}
		</>
	);
};

export { TextShadowControlPopup };
