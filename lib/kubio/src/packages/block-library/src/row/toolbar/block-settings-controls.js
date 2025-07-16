import { BlockSettingsMenuControls } from '@wordpress/block-editor';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { MenuGroup, MenuItem } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { getNamesOfBlocks } from '../..';
import { getRowDefault } from '../variations';

const BlockSettingsControls = ({ dataHelper }) => {
	const { canInsertBlockType } = useSelect(
		(select) => select('core/block-editor'),
		[]
	);

	const { clientId } = dataHelper;
	const { clientId: sectionClientId } = dataHelper.withParent();

	const { insertBlock } = useDispatch('core/block-editor');
	const { rowIndex } = useSelect((select) => {
		const index = select('core/block-editor')
			.getBlockOrder(sectionClientId)
			?.indexOf(clientId);

		return {
			rowIndex: index,
		};
	});

	const addNew = ({ after = false } = {}) => {
		const block = createBlocksFromInnerBlocksTemplate([getRowDefault()])[0];
		const index = after ? rowIndex + 1 : rowIndex;
		insertBlock(block, Math.max(index, 0), sectionClientId);
	};

	const canInsert = canInsertBlockType(
		getNamesOfBlocks().ROW,
		sectionClientId
	);

	if (!canInsert) {
		return <></>;
	}

	return (
		<BlockSettingsMenuControls>
			<MenuGroup className={'kubio-block-settings-control'}>
				<MenuItem onClick={() => addNew()}>
					{__('Add row of columns before', 'kubio')}
				</MenuItem>
				<MenuItem onClick={() => addNew({ after: true })}>
					{__('Add row of columns after', 'kubio')}
				</MenuItem>
			</MenuGroup>
		</BlockSettingsMenuControls>
	);
};

export { BlockSettingsControls };
