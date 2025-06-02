import { withPropsChecker } from '@kubio/core';
import { Component } from './component';
import { Content } from './inspector/content';
import { Style } from './inspector/style';

function BlockEdit( props ) {
	return (
		<>
			<Content />
			<Style />
			<Component { ...props } />
		</>
	);
}

export default withPropsChecker( BlockEdit );
