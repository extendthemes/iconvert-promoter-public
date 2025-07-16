import { StyleInspectorControls } from '@kubio/inspectors';
import TextSection from './text';

const Style = (props) => {
	return (
		<StyleInspectorControls>
			<TextSection {...props} />
		</StyleInspectorControls>
	);
};

export { Style };
