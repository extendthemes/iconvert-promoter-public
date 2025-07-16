import { Heading } from './component';

import { withPropsChecker } from '@kubio/core';
import { Content } from './inspector/content';
import { Style } from './inspector/style';

function HeadingEdit(props) {
	return (
		<>
			<Content />
			<Style />
			<Heading {...props} />
		</>
	);
}

export default withPropsChecker(HeadingEdit);
