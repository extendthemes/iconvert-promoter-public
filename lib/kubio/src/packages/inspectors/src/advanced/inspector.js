import { __ } from '@wordpress/i18n';
import {
	getBlockType,
	getUnregisteredTypeHandlerName,
} from '@wordpress/blocks';

import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { AdvancedInspectorControls } from './inspector-controls';

const BlockInspector = ({
	blockType,
	selectedBlockClientId,
	selectedBlockName,
	showNoBlockSelectedMessage = true,
}) => {
	const isSelectedBlockUnregistered =
		selectedBlockName === getUnregisteredTypeHandlerName();

	/*
	 * If the selected block is of an unregistered type, avoid showing it as an actual selection
	 * because we want the user to focus on the unregistered block warning, not block settings.
	 */
	if (!blockType || !selectedBlockClientId || isSelectedBlockUnregistered) {
		if (showNoBlockSelectedMessage) {
			return (
				<span className="block-editor-block-inspector__no-blocks">
					{__('No block selected.', 'kubio')}
				</span>
			);
		}
		return null;
	}

	return (
		<div className="block-editor-block-inspector kubio-inspector">
			<AdvancedInspectorControls.Slot bubblesVirtually />
		</div>
	);
};

export default compose([
	withSelect((select) => {
		const {
			getSelectedBlockClientId,
			getSelectedBlockCount,
			getBlockName,
		} = select('core/block-editor');
		const { getBlockStyles } = select('core/blocks');
		const selectedBlockClientId = getSelectedBlockClientId();
		const selectedBlockName =
			selectedBlockClientId && getBlockName(selectedBlockClientId);
		const blockType =
			selectedBlockClientId && getBlockType(selectedBlockName);
		const blockStyles =
			selectedBlockClientId && getBlockStyles(selectedBlockName);
		return {
			count: getSelectedBlockCount(),
			hasBlockStyles: blockStyles && blockStyles.length > 0,
			selectedBlockName,
			selectedBlockClientId,
			blockType,
		};
	}),
])(BlockInspector);
