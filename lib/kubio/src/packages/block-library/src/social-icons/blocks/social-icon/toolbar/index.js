import { __ } from '@wordpress/i18n';
import { cloneBlock } from '@wordpress/blocks';
import { Popover, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';
import { link, plusCircle } from '@wordpress/icons';
import { useRef, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

import { DataHelperContextFromClientId } from '@kubio/inspectors';
import { LinkControlWithData } from '@kubio/controls';

const ToolbarControl = (props) => {
	const { clientId, isSelected, dataHelper } = props;
	const [isURLPickerOpen, setIsURLPickerOpen] = useState(false);
	const dispatch = useDispatch('core/block-editor');
	const { insertBlocks } = dispatch;

	const {
		block,
		insertionPointRootClientId,
		insertionPointIndex,
	} = useSelect(
		(select) => {
			const { getBlockInsertionPoint, getBlock: getBlock } = select(
				'core/block-editor'
			);

			const blockInsertionPoint = getBlockInsertionPoint();

			return {
				insertionPointRootClientId: blockInsertionPoint.rootClientId,
				insertionPointIndex: blockInsertionPoint.index,
				block: getBlock(clientId),
			};
		},
		[clientId]
	);

	const openLinkControl = () => {
		setIsURLPickerOpen(true);
		return false; // prevents default behaviour for event
	};

	const anchorRef = useRef();

	const linkControl = isURLPickerOpen && isSelected && (
		<Popover
			position="center top"
			className={'kubio-color-popover'}
			onClose={() => setIsURLPickerOpen(false)}
			anchorRef={anchorRef?.current}
		>
			<DataHelperContextFromClientId clientId={clientId}>
				<LinkControlWithData />
			</DataHelperContextFromClientId>
		</Popover>
	);

	const addButton = () => {
		dataHelper.duplicate({ unlink: true });
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						name="link"
						icon={link}
						title={__('Link', 'kubio')}
						onClick={openLinkControl}
						ref={anchorRef}
					/>
				</ToolbarGroup>
			</BlockControls>
			{linkControl}
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
