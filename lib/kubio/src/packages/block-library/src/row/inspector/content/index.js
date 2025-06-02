import { LayoutSection } from './layout';
import { SpacingSection } from './spacing';
import { ContentInspectorControls } from '@kubio/inspectors';

const Content = ({
	onlyEqualWidth,
	beforeComponent,
	afterComponent,
	afterLayoutAndSpacing,
	supportsEqualHeightColumns = true,
	supportsHorizontalPosition = true,
}) => {
	return (
		<ContentInspectorControls>
			{beforeComponent}
			<LayoutSection
				supportsEqualHeightColumns={supportsEqualHeightColumns}
				onlyEqualWidth={onlyEqualWidth}
				afterLayoutAndSpacing={afterLayoutAndSpacing}
			/>
			<SpacingSection
				supportsHorizontalPosition={supportsHorizontalPosition}
			/>
			{afterComponent}
		</ContentInspectorControls>
	);
};

export { Content };
