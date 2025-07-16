import { withPropsChecker } from '@kubio/core';
import { CloseButton } from './component';
import { Content } from './inspector/content';
import { Style } from './inspector/style';

function BlockEdit( props ) {
	return (
		<>
			<Content />
			<Style />
			<CloseButton { ...props } />
		</>
	);
}

export default withPropsChecker( BlockEdit );
