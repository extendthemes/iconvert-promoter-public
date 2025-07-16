import { StyleInspectorControls } from '@kubio/inspectors';
import IconStyle from './icon-style';

const Style = (props) => {
	return (
		<>
			<StyleInspectorControls>
				<IconStyle {...props} />
			</StyleInspectorControls>
		</>
	);
};

export { Style };
