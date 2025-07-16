import { ElementsEnum } from '../../elements';
import IconProperties from './icon-properties';
import { ContentInspectorControls } from '@kubio/inspectors';

const Content = ({
	withLinkControl = true,
	withAlignControl = true,
	styledContainer = ElementsEnum.OUTER,
}) => {
	return (
		<ContentInspectorControls>
			<IconProperties
				withLinkControl={withLinkControl}
				withAlignControl={withAlignControl}
				styledContainer={styledContainer}
			/>
		</ContentInspectorControls>
	);
};

export { Content };
