import { StyleInspectorControls } from '@kubio/inspectors';
import { BackgroundSection } from '@kubio/controls';
import { elementsByName, StylesEnum } from '../../elements';
import _ from 'lodash';

const Style = ({ afterBackgroundSection = null }) => {
	const styledElement = _.get(elementsByName, StylesEnum.CONTAINER);
	return (
		<StyleInspectorControls>
			<BackgroundSection styledElement={styledElement} />
			{afterBackgroundSection}
		</StyleInspectorControls>
	);
};

export { Style };
