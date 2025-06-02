import {
	InspectorControls,
	useBlockEditContext,
} from '@wordpress/block-editor';
import { __experimentalStyleProvider as StyleProvider } from '@wordpress/components';
const ContentInspectorControls = (props) => {
	const context = useBlockEditContext();
	const { isSelected } = context;
	return (
		isSelected && (
			<StyleProvider document={document}>
				<InspectorControls className={'kubio-inspector'} {...props} />
			</StyleProvider>
		)
	);
};

export { ContentInspectorControls };
