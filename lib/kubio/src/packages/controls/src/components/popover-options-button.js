import { noop, isFunction, isNumber } from 'lodash';

import { Button, FormToggle, Popover } from '@wordpress/components';
import { useEffect, useRef, useState, useCallback } from '@wordpress/element';
import { InlineLabeledControl } from './inline-labeled-control/inline-labeled-control';
import { CogIcon, ResetIcon } from '@kubio/icons';
import { useOnClickOutside } from '@kubio/utils';
import { useProModal } from '@kubio/pro';
import { useInstanceId } from '@wordpress/compose';
import {
	PopupNestingContextProvider,
	usePopupNestingContext,
} from '@kubio/core';
import classNames from 'classnames';
import { useUIVersion } from '@kubio/core-hooks';

const OptionsPopover = ({
	toggable,
	toggleValue,
	onToggleChange,
	showReset = false,
	onReset,
	children,
	popoverClass = '',
	position,
	iconSize,
	onPopoverClose,
	onPopoverOpen,
	popoverWidth,
	popoverAnchorRef,
	isProOnly = false,
	upgradeUrlArgs = { upgradeUrlArgs },
	minWidth = { minWidth },
	showCog = true
}) => {
	const [localToggleValue, setToggleValue] = useState(toggleValue);
	const [isPopoverVisible, setPopoverVisibility] = useState(false);
	const popperRef = useRef();
	const ref = useRef();
	const instanceIdClass = useInstanceId(
		OptionsPopover,
		'kubio-options-popover'
	);

	const {
		instanceClassesWithChildrenSelector,
		contextProvider,
	} = usePopupNestingContext(instanceIdClass);

	const buttonRefCurrent = popoverAnchorRef
		? popoverAnchorRef.current
		: ref?.current;
	const updateToggleValue = () => {
		const newValue = !localToggleValue;
		setToggleValue(newValue);
		onToggleChange(newValue);
	};

	useEffect(() => setToggleValue(toggleValue), [toggleValue]);

	const handleButtonClick = () => {
		if (isProOnly) {
			showModal(true);
			return;
		}

		if (isPopoverVisible) {
			onClose();
		} else {
			onOpen();
		}
	};

	const onClose = useCallback(
		(event) => {
			const target = event?.target;

			//if the user clicked on the button ref let the button onClick handle the open/close logic so the popover
			//does not change visibility from two places. This can lead to unexpected behaviour like clicking on the button
			//only opening the popup.
			const clickedPopper =
				target && target.closest(instanceClassesWithChildrenSelector);
			if (
				buttonRefCurrent &&
				target &&
				(buttonRefCurrent.contains(target) || clickedPopper)
			) {
				return;
			}
			setPopoverVisibility(false);
			if (onPopoverClose) {
				onPopoverClose();
			}
		},
		[
			buttonRefCurrent,
			onPopoverClose,
			setPopoverVisibility,
			instanceClassesWithChildrenSelector,
		]
	);

	const onOpen = () => {
		setPopoverVisibility(true);
		if (onPopoverOpen) {
			onPopoverOpen();
		}
	};
	let width;

	if (popoverWidth) {
		if (
			parseInt(popoverWidth).toString().length ===
			popoverWidth.toString().length
		) {
			width = `${popoverWidth}px`;
		} else {
			width = popoverWidth;
		}
	}
	useOnClickOutside(popperRef, onClose);
	const popupContent = (
		<>
			{isFunction(children) && children(onClose)}
			{!isFunction(children) && children}
		</>
	);

	const anchorRef = useRef();
	const [ProModal, showModal] = useProModal();
	let disabledSettingsButton = !localToggleValue;

	if (isProOnly) {
		disabledSettingsButton = true;
	}

	if (minWidth !== false) {
		minWidth = isNumber(minWidth) ? `${minWidth}px` : minWidth;
	}

	return (
		<div className={'kubio-popover-options-button__button-wrapper'}>
			{toggable && (
				<div
					ref={anchorRef}
					className={'kubio-popover-options-button__toggle'}
				>
					<FormToggle
						checked={localToggleValue}
						onChange={(newValue) => {
							if (isProOnly) {
								showModal(true);
								return;
							}
							updateToggleValue(newValue);
						}}
					/>
					<ProModal
						anchorRef={buttonRefCurrent}
						urlArgs={upgradeUrlArgs}
					/>
				</div>
			)}
			{ showCog &&
				<div className={'kubio-popover-options-button__options-button'}>
					<Button
						disabled={disabledSettingsButton}
						icon={CogIcon}
						// isPrimary
						className={
							'kubio-popover-options-button__options-item ' +
							(localToggleValue
								? 'kubio-popover-options-icon'
								: 'kubio-popover-options-icon disabled-icon')
						}
						isSmall
						iconSize={iconSize}
						onClick={handleButtonClick}
						ref={ref}
					/>
					{showReset && (
						<Button
							disabled={!localToggleValue}
							className={
								'kubio-popover-options-button__options-item ' +
								(localToggleValue
									? 'kubio-popover-options-icon'
									: 'kubio-popover-options-icon disabled-icon')
							}
							icon={ResetIcon}
							isSmall
							onClick={onReset}
						/>
					)}
					{isPopoverVisible && (
						<Popover
							position={position}
							className={`kubio-options-popover ${popoverClass} ${instanceIdClass}`}
							anchorRef={buttonRefCurrent}
							offset={6}
							shift={true}
							flip={true}
							resize={false}
						>
							<PopupNestingContextProvider value={contextProvider}>
								<div style={{ minWidth }} ref={popperRef}>
									{width && (
										<div style={{ width }}>{popupContent}</div>
									)}
									{!width && popupContent}
								</div>
							</PopupNestingContextProvider>
						</Popover>
					)}
				</div>
			}

		</div>
	);
};

const PopoverOptionsButton = ({
	label,
	toggable = false,
	enabled = true,
	onToggleChange = noop,
	showReset = false,
	onReset = noop,
	beforeOptionsButton = null,
	popupContent,
	popoverClass = '',
	position: initialPosition = null,
	iconSize = 24,
	onPopoverClose = null,
	onPopoverOpen = null,
	popoverWidth,
	popoverAnchorRef,
	isProOnly = false,
	minWidth = false,
	upgradeUrlArgs = {},
	showCog = true
}) => {
	const { uiVersion: KUBIO_UI_VERSION } = useUIVersion();

	let position = initialPosition;
	if (position === null) {
		if (KUBIO_UI_VERSION === 2) {
			position = 'bottom right';
		} else {
			position = 'bottom left';
		}
	}

	return (
		<InlineLabeledControl
			className={classNames(
				'kubio-popover-options-button',
				'kubio-control'
			)}
			label={label}
		>
			<div className={'kubio-popover-options-button__options-wrapper'}>
				{beforeOptionsButton && (
					<div
						className={'kubio-popover-options-button__options-item'}
					>
						{beforeOptionsButton}
					</div>
				)}

				<div className={'kubio-popover-options-button__options-item'}>
					<OptionsPopover
						showReset={showReset}
						onReset={onReset}
						toggable={toggable}
						toggleValue={enabled}
						onToggleChange={onToggleChange}
						popoverClass={popoverClass}
						position={position}
						iconSize={iconSize}
						onPopoverClose={onPopoverClose}
						onPopoverOpen={onPopoverOpen}
						popoverWidth={popoverWidth}
						popoverAnchorRef={popoverAnchorRef}
						isProOnly={isProOnly}
						minWidth={minWidth}
						upgradeUrlArgs={upgradeUrlArgs}
						showCog={showCog}
					>
						{popupContent}
					</OptionsPopover>
				</div>
			</div>
		</InlineLabeledControl>
	);
};

export default PopoverOptionsButton;
