import { Base } from './component';
import { withPropsChecker } from '@kubio/core';
import { Content } from './inspector/content';
import { Style } from './inspector/style';

function DividerEdit( props ) {
	return (
		<>
			<Content />
			<Style />
			<Base { ...props } />
		</>
	);
}

export default withPropsChecker( DividerEdit );
