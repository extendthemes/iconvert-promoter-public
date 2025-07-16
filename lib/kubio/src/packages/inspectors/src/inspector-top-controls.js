import { createSlotFill } from '@wordpress/components';

import { useBlockEditContext } from '@wordpress/block-editor';
import { createHigherOrderComponent, compose } from '@wordpress/compose';

const { Fill, Slot } = createSlotFill('StyleInspectorControlsTop');

const ifBlockEditSelectedStyleInspectorControls = createHigherOrderComponent(
	(OriginalComponent) => {
		return (props) => {
			const context = useBlockEditContext();
			const { isSelected } = context;
			if (isSelected) {
				return <OriginalComponent {...props} />;
			}
			return null;
		};
	},
	'ifBlockEditSelectedStyleInspectorControls'
);

const BlockInspectorTopControls = compose([
	ifBlockEditSelectedStyleInspectorControls,
])(Fill);

BlockInspectorTopControls.Slot = Slot;
export { BlockInspectorTopControls };
