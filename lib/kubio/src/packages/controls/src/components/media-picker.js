import { MediaUpload } from '@wordpress/block-editor';
import { BaseControl, Button } from '@wordpress/components';
import { memo } from '@wordpress/element';

import { __ } from '@wordpress/i18n';

const VideoPreview = memo(({ url }) => {
	// noinspection JSXNamespaceValidation
	return <video src={url} onContextMenu={(e) => e.preventDefault()} />;
});

const ImagePreview = memo(({ url }) => {
	// eslint-disable-next-line jsx-a11y/alt-text
	return <img src={url} />;
});

const MediaPicker = ({
	value,
	onChange,
	type = 'image',
	showButton = false,
	buttonLabel = __('Open Media Library', 'kubio'),
}) => {
	const url = value?.url ? value.url : value;

	return (
		<>
			<BaseControl>
				<MediaUpload
					className={'kubio-media-upload'}
					title={__('Select image', 'kubio')}
					onSelect={onChange}
					allowedTypes={[type]}
					render={({ open }) => (
						<>
							<BaseControl>
								{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
								<div
									// onClick={open}
									className={'kubio-media-picker-container'}
									role="button"
									tabIndex="0"
								>
									{type === 'image' && (
										<ImagePreview url={url} />
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
						</>
					)}
				/>
			</BaseControl>
		</>
	);
};

export { MediaPicker };
