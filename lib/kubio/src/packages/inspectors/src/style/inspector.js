import { InspectorControls } from '@wordpress/block-editor';
import {
	getBlockType,
	getUnregisteredTypeHandlerName,
} from '@wordpress/blocks';
import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { StyleInspectorControls } from './inspector-controls';
import { LinkedNotice } from '@kubio/controls';

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
			<StyleInspectorControls.Slot bubblesVirtually />
		</div>
	);
};

const StyleBlockInspector = compose([
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

/**
 *  load the style panel as inspector control blocks outside the kubio editor
 */
const withKubioStyleInspectorOutsideKubioEditor = createHigherOrderComponent(
	(BlockEdit) => {
		return (props) => {
			return (
				<>
					{!window.isKubioBlockEditor && (
						<InspectorControls>
							<LinkedNotice {...props} />
						</InspectorControls>
					)}
					<BlockEdit {...props} />
					{!window.isKubioBlockEditor && (
						<InspectorControls>
							<StyleBlockInspector />
						</InspectorControls>
					)}
				</>
			);
		};
	},
	'withKubioStyleInspectorOutsideKubioEditor'
);

addFilter(
	'editor.BlockEdit',
	'kubio.third-party-controls',
	withKubioStyleInspectorOutsideKubioEditor
);

export { StyleBlockInspector };
