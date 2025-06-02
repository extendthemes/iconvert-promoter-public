import SidebarArea from '../sidebar-area';

import { useDispatch, useSelect } from '@wordpress/data';
import { STORE_KEY } from '../../../store/constants';
import { BlockIcon } from '@wordpress/block-editor';

import { getBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

export default function BlockArea({ children }) {
	const { clearSelectedBlock } = useDispatch('core/block-editor');
	const { openSidebar } = useDispatch(STORE_KEY);

	const toDocument = () => {
		openSidebar('document');
		// enableComplementaryArea(STORE_KEY, `kubio-editor/document`);
		clearSelectedBlock();
	};

	const { blockType, isMultiSelection } = useSelect((select) => {
		const {
			getSelectedBlockClientId,
			getBlockName,
			hasMultiSelection,
		} = select('core/block-editor');
		const selectedBlockClientId = getSelectedBlockClientId();
		const selectedBlockName =
			selectedBlockClientId && getBlockName(selectedBlockClientId);
		return {
			blockType: selectedBlockClientId && getBlockType(selectedBlockName),
			isMultiSelection: hasMultiSelection(),
		};
	});

	const titleFunction = () => {
		return (
			<span className={'kubio-header-active-section'}>
				<BlockIcon icon={blockType?.icon} />
				<span className={'kubio-header-active-section page-title'}>
					{isMultiSelection
						? __('Multiple selection', 'kubio')
						: blockType?.title}
				</span>
			</span>
		);
	};

	return (
		<SidebarArea
			areaIdentifier="block-inspector"
			title={titleFunction}
			backCallback={toDocument}
		>
			{!isMultiSelection && children}
			{isMultiSelection && (
				<>
					<div className={'kubio-multiple-selection'}>
						<p>
							{__(
								'Sidebar controls are not availble on multiple blocks selection',
								'kubio'
							)}
						</p>
					</div>
				</>
			)}
		</SidebarArea>
	);
}
