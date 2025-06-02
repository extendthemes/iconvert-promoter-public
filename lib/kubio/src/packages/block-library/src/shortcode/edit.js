import { Shortcode } from './component';

import { withPropsChecker } from '@kubio/core';
import { Content } from './inspector/content';

function IconEdit(props) {
	return (
		<>
			<Content />
			<Shortcode {...props} />
		</>
	);
}

export default withPropsChecker(IconEdit);
