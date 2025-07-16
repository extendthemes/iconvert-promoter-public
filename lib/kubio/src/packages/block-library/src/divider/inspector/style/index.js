import { StyleInspectorControls } from '@kubio/inspectors';
import IconSection from './icon';
import LineSection from './line';

const Style = () => {
	return (
		<StyleInspectorControls>
			<LineSection />
			<IconSection />
		</StyleInspectorControls>
	);
};

export { Style };
