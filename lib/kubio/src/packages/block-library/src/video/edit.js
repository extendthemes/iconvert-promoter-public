import { Content } from './inspector/content';
import { Style } from './inspector/style';
import { withPropsChecker } from '@kubio/core';
import { Video } from './component';

function VideoEdit( props ) {
	return (
		<>
			<Content />
			<Style />
			<Video { ...props } />
		</>
	);
}

export default withPropsChecker( VideoEdit );
