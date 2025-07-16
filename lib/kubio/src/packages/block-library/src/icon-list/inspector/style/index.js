import { StyleInspectorControls } from '@kubio/inspectors';
import { IconPanel } from './icon';
import { TextPanel } from './text';
import { ListPanel } from './list';

const Style = () => {
	return (
		<StyleInspectorControls>
			<ListPanel />
			<IconPanel />
			<TextPanel />
		</StyleInspectorControls>
	);
};

export { Style };
