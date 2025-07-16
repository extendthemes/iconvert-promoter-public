import { withPropsChecker } from '@kubio/core';

import { Content } from './inspector/content';
import { Style } from './inspector/style';
import { Link } from './component';

function BlockEdit(props) {
	return (
		<>
			<Content />
			<Style />
			<Link {...props} />
		</>
	);
}

export default withPropsChecker(BlockEdit);
