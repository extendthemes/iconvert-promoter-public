import { InlineLabeledControl } from '../../components';
import { noop } from 'lodash';
import { Button, FormToggle } from '@wordpress/components';
import { close, cog } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { ResetIcon } from '@kubio/icons';

const SidebarToggleWrapper = ({
	label,
	onChange = noop,
	showReset = false,
	onReset = noop,
	value,
	onClick,
	showSettings = false,
}) => {
	const [localToggleValue, setToggleValue] = useState(value);

	const updateToggleValue = () => {
		const newValue = !localToggleValue;
		setToggleValue(newValue);
		onChange(newValue);
	};
	return (
		<InlineLabeledControl
			className={
				'kubio-popover-options-button kubio-sidebar-toggle-wrapper-container'
			}
			label={label}
		>
			<div className="kubio-sidebar-toggle-wrapper-optional-container">
				<FormToggle
					checked={localToggleValue}
					onChange={updateToggleValue}
				/>

				{showSettings && (
					<Button
						disabled={!localToggleValue}
						icon={cog}
						className={
							localToggleValue
								? 'kubio-sidebar-toggle-wrapper-icon'
								: 'kubio-sidebar-toggle-wrapper-icon disabled-icon'
						}
						// isPrimary
						isSmall
						onClick={onClick}
					/>
				)}
				{showReset && (
					<Button
						disabled={!localToggleValue}
						className={
							localToggleValue
								? 'kubio-sidebar-toggle-wrapper-icon'
								: 'kubio-sidebar-toggle-wrapper-icon disabled-icon'
						}
						icon={ResetIcon}
						isSmall
						onClick={onReset}
					/>
				)}
			</div>
			{/*<div className={'kubio-popover-options-button__options-wrapper'}>*/}
			{/*	{beforeOptionsButton && (*/}
			{/*		<div*/}
			{/*			className={*/}
			{/*				'kubio-popover-options-button__options-item'*/}
			{/*			}*/}
			{/*		>*/}
			{/*			{beforeOptionsButton}*/}
			{/*		</div>*/}
			{/*	)}*/}

			{/*	<div className={'kubio-popover-options-button__options-item'}>*/}
			{/*		<OptionsPopover*/}
			{/*			toggable={toggable}*/}
			{/*			toggleValue={enabled}*/}
			{/*			onToggleChange={onToggleChange}*/}
			{/*			popoverClass={popoverClass}*/}
			{/*			position={position}*/}
			{/*		>*/}
			{/*			{popupContent}*/}
			{/*		</OptionsPopover>*/}
			{/*	</div>*/}

			{/*	{showReset && (*/}
			{/*		<div*/}
			{/*			className={*/}
			{/*				'kubio-popover-options-button__options-item'*/}
			{/*			}*/}
			{/*		>*/}
			{/*			<Button*/}
			{/*				inSmall*/}
			{/*				icon={close}*/}
			{/*				label={__('Reset', 'kubio')}*/}
			{/*				className={'kubio-color-reset-button'}*/}
			{/*				onClick={onReset}*/}
			{/*			/>*/}
			{/*		</div>*/}
			{/*	)}*/}
			{/*</div>*/}
		</InlineLabeledControl>
	);
};

export default SidebarToggleWrapper;
