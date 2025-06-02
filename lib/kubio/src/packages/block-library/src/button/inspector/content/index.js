import ButtonProperties from './button-properties';
import { ContentInspectorControls } from '@kubio/inspectors';
import { ButtonSize } from './button-size/component';
const Content = ({
	dynamicLink = false,
	withAlign = true,
	buttonPropsAfter,
	buttonPropsBefore,
}) => {
	return (
		<ContentInspectorControls>
			<ButtonProperties
				dynamicLink={dynamicLink}
				withAlign={withAlign}
				buttonPropsAfter={buttonPropsAfter}
				buttonPropsBefore={buttonPropsBefore}
			/>
		</ContentInspectorControls>
	);
};

export { Content, ButtonProperties, ButtonSize };
