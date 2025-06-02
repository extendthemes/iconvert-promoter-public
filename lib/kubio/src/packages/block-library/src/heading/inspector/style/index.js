import { StyleInspectorControls } from '@kubio/inspectors';
import TextSection from './text';
import EffectsSection from './effects';

const Style = () => {
	return (
		<StyleInspectorControls>
			<TextSection />
			<EffectsSection />
		</StyleInspectorControls>
	);
};

export { Style };
