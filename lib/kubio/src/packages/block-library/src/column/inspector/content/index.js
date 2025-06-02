import { ContentInspectorControls } from '@kubio/inspectors';
import { LayoutSection } from './layout';
import { SpacingSection } from './spacing';

const Content = ({
	onlyEqualWidth,
	canOverlap = true,
	beforeComponent,
	afterComponent,
}) => {
	return (
		<ContentInspectorControls>
			{beforeComponent}
			<LayoutSection onlyEqualWidth={onlyEqualWidth} />
			<SpacingSection canOverlap={canOverlap} />
			{afterComponent}
		</ContentInspectorControls>
	);
};

export { Content };
