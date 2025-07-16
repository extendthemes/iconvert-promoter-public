import { withColibriPath } from '@kubio/core';
import { MediaPicker } from '../../components/media-picker';
const MediaPickerWithPath = withColibriPath((props) => {
	const { onChange, mediaType, ...rest } = props;
	const onMediaChange = (event) => {
		onChange(event.url);
	};
	return <MediaPicker {...rest} type={mediaType} onChange={onMediaChange} />;
});

export { MediaPickerWithPath };
