import { ResetIcon } from '@kubio/icons';
import { MediaUpload } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	Flex,
	FormToggle,
	FlexItem,
	FlexBlock,
	Notice,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { noop } from 'lodash';
import { useCallback, useState } from '@wordpress/element';
import classNames from 'classnames';

const VideoPreview = ({ url }) => {
	// noinspection JSXNamespaceValidation
	return <video src={url} />;
};

const ImagePreview = ({ url, onError, onLoad }) => {
	// eslint-disable-next-line jsx-a11y/alt-text
	return <img src={url} onError={() => onError('image')} onLoad={onLoad} />;
};

const MediaPicker = ({
	value,
	onChange,
	onReset,
	type = 'image',
	showButton = false,
	showRemoveButton = false,
	buttonLabel = __('Change background image', 'kubio'),
	removeButtonLabel = __('Remove image', 'kubio'),
	label,
	withReset = false,
	toggable = false,
	toggleValue = false,
	updateToggleValue = noop,
	mediaId,
}) => {
	const url = value?.url ? value.url : value;

	const onToggleChange = useCallback(() => updateToggleValue(!toggleValue), [
		toggleValue,
		updateToggleValue,
	]);

	const [errorOnType, setErrorOnType] = useState('');

	const handleFileErrors = (allowedType) => {
		setErrorOnType(allowedType);
	};

	const clearErrorOnType = () => {
		setErrorOnType('');
	};

	return (
		<>
			<BaseControl
				className={classNames(
					'kubio-media-picker-base-control',
					'kubio-control'
				)}
			>
				{/*<BaseControl.VisualLabel>{label}</BaseControl.VisualLabel>*/}
				<Flex justify={'space-between'} style={{ marginBottom: 5 }}>
					<FlexBlock>
						<BaseControl.VisualLabel>
							{label}
						</BaseControl.VisualLabel>
					</FlexBlock>
					<FlexItem>
						<Flex>
							{toggable && (
								<FlexItem>
									<div
										className={
											'kubio-popover-options-button__toggle'
										}
									>
										<FormToggle
											checked={toggleValue}
											onChange={onToggleChange}
										/>
									</div>
								</FlexItem>
							)}
							{withReset && (
								<FlexItem>
									<Button
										disabled={toggable && !toggleValue}
										isSmall
										icon={ResetIcon}
										label={__('Reset', 'kubio')}
										className={
											'kubio-popover-options-icon kubio-color-indicator-popover-reset-icon kubio-border-control-button'
										}
										onClick={onReset}
									/>
								</FlexItem>
							)}
						</Flex>
					</FlexItem>
				</Flex>
				{(!toggable || (toggable && toggleValue)) && (
					<>
						<MediaUpload
							title={__('Select image', 'kubio')}
							onSelect={onChange}
							allowedTypes={[type]}
							value={mediaId}
							render={({ open }) => (
								<>
									<BaseControl>
										{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
										<div
											// onClick={open}
											className={
												'kubio-media-picker-container'
											}
											role="button"
											tabIndex="0"
										>
											{type === 'image' && (
												<ImagePreview
													url={url}
													onError={handleFileErrors}
													onLoad={clearErrorOnType}
												/>
											)}
											{type === 'video' && (
												<VideoPreview url={url} />
											)}
										</div>
									</BaseControl>

									{showButton && (
										<Button
											isPrimary
											onClick={open}
											className={'kubio-button-100'}
										>
											{buttonLabel}
										</Button>
									)}

									{showRemoveButton && (
										<Button
											onClick={onReset}
											className={
												'kubio-button-100 kubio-media-reset-button'
											}
										>
											{removeButtonLabel}
										</Button>
									)}
								</>
							)}
						/>

						{errorOnType !== '' && !!url && (
							<Notice status="error" isDismissible={false}>
								<span>
									{sprintf(
										__(
											'Only %s formats are supported',
											'kubio'
										),
										errorOnType
									)}
								</span>
							</Notice>
						)}
					</>
				)}
			</BaseControl>
		</>
	);
};

export { MediaPicker };
