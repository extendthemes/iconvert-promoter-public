import Properties from './properties'
import { ContentInspectorControls } from '@kubio/inspectors';

const Content = (props) => {
	return (
		<ContentInspectorControls>
			<Properties />
		</ContentInspectorControls>
	);
};

export { Content };
