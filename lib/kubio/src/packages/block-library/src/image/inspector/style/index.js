import { StyleInspectorControls } from '@kubio/inspectors';
import ImageSection from './image';
import CaptionSection from './caption';
import EffectOptions from './effect-options';

const Style = () => {
	return (
		<StyleInspectorControls>
			<ImageSection />
			<CaptionSection />
			<EffectOptions />
		</StyleInspectorControls>
	);
};

export { Style };
