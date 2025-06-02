import { useOwnerDocumentContext } from '@kubio/core';
import { BlockControls } from '@wordpress/block-editor';
import { cloneBlock, createBlock } from '@wordpress/blocks';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { plusCircle } from '@wordpress/icons';
import { last } from 'lodash';
import { addColumnFromRow } from '../../column/new-column';

const AddNewColumn = ({ dataHelper }) => {
	const { clientId } = dataHelper;
	const isEqualWidth = dataHelper.getProp('layout.equalWidth');
	const { ownerDocument } = useOwnerDocumentContext();
	const { insertBlock } = useDispatch('core/block-editor');
	const { nextColumnIndex, lastBlock } = useSelect((select) => {
		const index = select('core/block-editor').getBlockCount(clientId);
		const lastInnerBlockID = last(
			select('core/block-editor').getBlockOrder(clientId)
		);
		return {
			nextColumnIndex: index,
			lastBlock: select('core/block-editor').getBlock(lastInnerBlockID),
		};
	});

	const label = isEqualWidth
		? __('Add list item', 'kubio')
		: __('Add new column', 'kubio');

	const addColumn = () => {
		if (isEqualWidth) {
			const nextBlock = cloneBlock(lastBlock);
			insertBlock(nextBlock, nextColumnIndex, clientId);
		} else {
			const data = {
				createBlock,
				insertBlock,
				ownerDocument,
			};
			addColumnFromRow(dataHelper, data);
		}
	};

	return (
		<BlockControls>
			<ToolbarGroup>
				<ToolbarButton
					icon={plusCircle}
					label={label}
					onClick={addColumn}
				/>
			</ToolbarGroup>
		</BlockControls>
	);
};

export { AddNewColumn };
