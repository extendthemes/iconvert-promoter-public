import { useSelect, useDispatch } from '@wordpress/data';
import { BlockSettingsMenuControls } from '@wordpress/block-editor';
import { MenuGroup, MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function ConvertToRegularBlocks({ clientId }) {
	const { innerBlocks } = useSelect(
		(select) =>
			select('core/block-editor').__unstableGetBlockWithBlockTree(
				clientId
			),
		[clientId]
	);
	const { replaceBlocks } = useDispatch('core/block-editor');

	return (
		<BlockSettingsMenuControls>
			{({ onClose }) => (
				<MenuGroup className={'kubio-block-settings-control'}>
					<MenuItem
						onClick={() => {
							replaceBlocks(clientId, innerBlocks);
							onClose();
						}}
					>
						{__('Detach blocks from template part', 'kubio')}
					</MenuItem>
				</MenuGroup>
			)}
		</BlockSettingsMenuControls>
	);
}
