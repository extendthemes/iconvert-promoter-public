import { createSlotFill } from '@wordpress/components';

import { useBlockEditContext } from '@wordpress/block-editor';
import { compose, createHigherOrderComponent } from '@wordpress/compose';

const { Fill, Slot } = createSlotFill('AdvancedInspectorControls');

const ifBlockEditSelectedAdvancedInspectorControls = createHigherOrderComponent(
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
	'ifBlockEditSelectedAdvancedInspectorControls'
);

const AdvancedInspectorControls = compose([
	ifBlockEditSelectedAdvancedInspectorControls,
])(Fill);

AdvancedInspectorControls.Slot = Slot;
export { AdvancedInspectorControls };
