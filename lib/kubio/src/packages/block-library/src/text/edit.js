import { Text } from './component';

import { withPropsChecker } from '@kubio/core';
import { Content } from './inspector/content';
import { Style } from './inspector/style';

function TextEdit(props) {
	return (
		<>
			<Content showDropCap={true} />
			<Style />
			<Text {...props} />
		</>
	);
}

export default withPropsChecker(TextEdit);
