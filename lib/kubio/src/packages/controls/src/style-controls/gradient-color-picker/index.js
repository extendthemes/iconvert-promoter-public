import {
	ColorIndicator,
	GradientControlWithPresets,
	ToggleGroup,
	KubioPopup,
} from '../../components';
import { picker } from './config';
import { __ } from '@wordpress/i18n';
import { Styles } from '@kubio/style-manager';
import _ from 'lodash';
import { BaseControl, Button, Popover } from '@wordpress/components';
import { useRef, useState, useCallback, useEffect } from '@wordpress/element';
import { GutentagColorPickerWithPalette } from '../../components/color/gutentag-color-picker-with-palette';
import { ResetIcon } from '@kubio/icons';
import { useOnClickOutside } from '@kubio/utils';

const { background } = Styles;

const triggerColorModalOpened = (modalEl) => {
	const event = new modalEl.ownerDocument.defaultView.CustomEvent(
		'kubio-color-modal-showed',
		{
			detail: {
				modalEl,
			},
		}
	);
	modalEl.ownerDocument.defaultView.dispatchEvent(event);
};

const GradientColorPicker = (props) => {
	const { label, value, onChange, onReset, disabled } = props;
	const backgroundWithDefault = _.merge({}, background.default, value);
	const backgroundType = _.get(backgroundWithDefault, 'type');
	const backgroundTypeIs = {
		color: backgroundType === picker.values.COLOR,
		gradient: backgroundType === picker.values.GRADIENT,
	};
	const gradientPath = 'image[0].source.gradient';
	const buttonRef = useRef();

	const updateValue = (path) => (event) => {
		const newValue = {};
		_.set(newValue, path, event);
		onChange(newValue);
	};

	const onGradientChange = () => {
		const newValue = {};
		_.set(newValue, 'type', 'gradient');
		_.set(newValue, 'image[0].source.type', 'gradient');
		onChange(newValue);
	};

	const getValue = (path) => {
		return _.get(backgroundWithDefault, path);
	};

	const onChangeBackgroundType = (event) => {
		switch (event) {
			case picker.values.COLOR:
				updateValue('type')('none');
				break;
			case picker.values.GRADIENT:
				onGradientChange();
				break;
		}
	};

	return (
		<BaseControl className={'kubio-color-popover-control'}>
			<div className={'kubio-color-popover-labeled'}>
				<div className={'kubio-color-popover-label'}>{label}</div>
				<div className={'kubio-color-popover-wrapper'}>
					<Button
						className={'kubio-color-popover-button'}
						ref={buttonRef}
					>
						<ColorIndicator
							value={
								backgroundTypeIs.color
									? getValue('color')
									: getValue(gradientPath)
							}
						/>
					</Button>
					<Button
						isSmall
						icon={ResetIcon}
						label={__('Reset', 'kubio')}
						className={
							'kubio-popover-options-icon kubio-color-indicator-popover-reset-icon'
						}
						onClick={onReset}
					/>
					<KubioPopup
						className={'kubio-color-popover'}
						buttonRef={buttonRef}
						anchorRef={buttonRef}
					>
						<ToggleGroup
							// label={label}
							options={picker.options}
							value={backgroundType}
							onChange={onChangeBackgroundType}
						/>
						{backgroundTypeIs.color && (
							<GutentagColorPickerWithPalette
								onChange={updateValue('color')}
								value={getValue('color')}
								onReset={onReset}
							/>
						)}
						{backgroundTypeIs.gradient && (
							<GradientControlWithPresets
								label={__('Gradient', 'kubio')}
								value={getValue(gradientPath)}
								onChange={updateValue(gradientPath)}
								presetsNumber={5}
							/>
						)}
					</KubioPopup>
				</div>
			</div>
		</BaseControl>
	);
};

export { GradientColorPicker };
