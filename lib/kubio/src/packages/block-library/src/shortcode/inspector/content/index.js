import ShortcodeProperties from './shortcode-properties';
import { ContentInspectorControls } from '@kubio/inspectors';

const Content = () => {
	return (
		<ContentInspectorControls>
			<ShortcodeProperties />
		</ContentInspectorControls>
	);
};

export { Content };
