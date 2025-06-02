import { ContentInspectorControls } from '@kubio/inspectors';
import { IconListProperties } from './icon-list-properties';

const Content = (props) => {
	return (
		<ContentInspectorControls>
			<IconListProperties {...props} />
		</ContentInspectorControls>
	);
};

export { Content };
