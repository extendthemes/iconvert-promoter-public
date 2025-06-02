import { ContentInspectorControls } from '@kubio/inspectors';
import VideoOptions from './video-options';
const Content = () => {
	return (
		<ContentInspectorControls>
			<VideoOptions />
			{ /*<PlayerControlsOptions />*/ }
			{ /*<PosterImageOptions />*/ }
		</ContentInspectorControls>
	);
};

export { Content };
