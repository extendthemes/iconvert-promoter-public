import { Text } from './component';

import { withPropsChecker } from '@kubio/core';
import { Content } from './inspector/content';
import { Style } from './inspector/style';

function TextEdit(props) {
	return (
		<>
			<Content  />
			<Style />
			<Text {...props} />
		</>
	);
}

export default withPropsChecker(TextEdit);
