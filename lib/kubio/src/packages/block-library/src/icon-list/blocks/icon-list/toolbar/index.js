import { cloneBlock } from '@wordpress/blocks';

import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import { plusCircle } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';

const ToolbarControl = (props) => {
	const { clientId } = props;

	const { insertBlocks, selectBlock } = useDispatch('core/block-editor');

	const { getBlock } = useSelect((select) => {
		const { getBlock } = select('core/block-editor');
		return {
			getBlock,
		};
	});

	const addButton = () => {
		const iconList = getBlock(clientId);

		if (iconList.innerBlocks.length < 1) {
			return;
		}

		const newBlock = cloneBlock(
			iconList.innerBlocks[iconList.innerBlocks.length - 1]
		);

		insertBlocks([newBlock], iconList.innerBlocks.length, clientId, true);

		selectBlock(clientId);
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={plusCircle}
						title={__('Add', 'kubio')}
						onClick={addButton}
					/>
				</ToolbarGroup>
			</BlockControls>
		</>
	);
};

export { ToolbarControl };
