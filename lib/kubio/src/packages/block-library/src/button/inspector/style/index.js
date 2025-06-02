import { StyleInspectorControls } from '@kubio/inspectors';
import IconStyle from './icon-style';
import ButtonStyle from './button-style';
const Style = () => {
	return (
		<StyleInspectorControls>
			<ButtonStyle />
			<IconStyle />
		</StyleInspectorControls>
	);
};

export { Style };
