import { StyleInspectorControls } from '@kubio/inspectors';
import LinkStyle from './link-style';
import IconStyle from './icon-style';

const Style = () => {
	return (
		<StyleInspectorControls>
			<LinkStyle />
			<IconStyle />
		</StyleInspectorControls>
	);
};

export { Style };
