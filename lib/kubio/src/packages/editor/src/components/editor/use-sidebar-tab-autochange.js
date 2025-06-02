import { useCurrentInspectorTab } from '@kubio/inspectors';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

const useSidebarTabAutochange = () => {
	const [block, setBlock] = useState({});
	const [, setDisplayedTab] = useCurrentInspectorTab();
	const selectedBlock = useSelect((select) => {
		const _selected = select('core/block-editor').getSelectedBlock();
		return {
			clientId: _selected?.clientId,
			name: _selected?.name,
		};
	});

	useEffect(() => {
		if (block?.clientId !== selectedBlock?.clientId) {
			if (block?.name !== selectedBlock?.name) {
				setDisplayedTab('content');
				setBlock(selectedBlock);
			}
		}
	}, [selectedBlock, block, setBlock, setDisplayedTab]);
};

export { useSidebarTabAutochange };
