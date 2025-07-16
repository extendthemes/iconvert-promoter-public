import { withPropsChecker } from '@kubio/core';

import { Content, ButtonProperties } from './inspector/content';

import { Button } from './component';
import { Style } from './inspector/style';

function BlockEdit(props) {
	const {
		dynamicLink = false,
		buttonPropsBefore = null,
		buttonPropsAfter = null,
		withAlign = true,
	} = props;
	return (
		<>
			<Content
				dynamicLink={dynamicLink}
				buttonPropsBefore={buttonPropsBefore}
				buttonPropsAfter={buttonPropsAfter}
				withAlign={withAlign}
			/>
			<Style />
			<Button {...props} />
		</>
	);
}

export default withPropsChecker(BlockEdit);
export { ButtonProperties, Style };
