import { ControlNotice } from '@kubio/controls';
import { useSlotHasFills } from '@kubio/core';
import { useBlockEditContext } from '@wordpress/block-editor';
import {
	createSlotFill,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalStyleProvider as StyleProvider
} from '@wordpress/components';
import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

const slotName = 'StyleInspectorControls';
const { Fill, Slot } = createSlotFill(slotName);

const ifBlockEditSelectedStyleInspectorControls = createHigherOrderComponent(
	(OriginalComponent) => {
		return (props) => {
			const context = useBlockEditContext();
			const { isSelected } = context;
			if (isSelected) {
				return (
					<StyleProvider document={document}>
						<OriginalComponent {...props} />
					</StyleProvider>
				);
			}
			return null;
		};
	},
	'ifBlockEditSelectedStyleInspectorControls'
);

const StyleInspectorControls = compose([
	ifBlockEditSelectedStyleInspectorControls,
])(Fill);

const StyleSlot = (props) => {
	let hasFills = useSlotHasFills(slotName);
	/**
	 *  display the "no style" notice only inside the kubio block editor
	 */
	if (!hasFills && window.isKubioBlockEditor) {
		return (
			<div className="kubio-editing-header">
				<ControlNotice
					content={__(
						'Current block does not support styling',
						'kubio'
					)}
				/>
			</div>
		);
	}

	return <Slot {...props} />;
};

StyleInspectorControls.Slot = StyleSlot;
export { StyleInspectorControls };
