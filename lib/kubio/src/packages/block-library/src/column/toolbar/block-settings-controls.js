import { useOwnerDocumentContext } from '@kubio/core';
import { BlockSettingsMenuControls } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { MenuGroup, MenuItem } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useCallback } from 'react';
import NamesOfBlocks from '../../blocks-list';
import { addColumnFromColumn } from '../new-column';

const BlockSettingsControls = ({ dataHelper }) => {
	const { canInsertBlockType } = useSelect(
		(select) => select('core/block-editor'),
		[]
	);

	const { clientId: rowClientId } = dataHelper.withParent();
	const { ownerDocument } = useOwnerDocumentContext();
	const { insertBlock } = useDispatch('core/block-editor');

	const addNew = useCallback(
		({ after = false } = {}) => {
			const options = {
				after,
			};
			const data = {
				createBlock,
				insertBlock,
				ownerDocument,
			};
			addColumnFromColumn(dataHelper, data, options);
		},
		[dataHelper]
	);

	const canInsert = canInsertBlockType(NamesOfBlocks.COLUMN, rowClientId);

	if (!canInsert) {
		return <></>;
	}

	return (
		<BlockSettingsMenuControls>
			<MenuGroup className={'kubio-block-settings-control'}>
				<MenuItem onClick={() => addNew()}>
					{__('Add column before', 'kubio')}
				</MenuItem>
				<MenuItem onClick={() => addNew({ after: true })}>
					{__('Add column after', 'kubio')}
				</MenuItem>
			</MenuGroup>
		</BlockSettingsMenuControls>
	);
};

export { BlockSettingsControls };
