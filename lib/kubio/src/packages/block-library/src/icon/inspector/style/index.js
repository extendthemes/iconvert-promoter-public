import { StyleInspectorControls } from '@kubio/inspectors';
import { ElementsEnum } from '../../elements';
import IconSection from './icon';
import BackgroundAndBorderSection from './background-and-border';

const Style = ({ styledElement = ElementsEnum.INNER }) => {
	return (
		<StyleInspectorControls>
			<IconSection styledElement={styledElement} />
			<BackgroundAndBorderSection styledElement={styledElement} />
		</StyleInspectorControls>
	);
};

export { Style };
