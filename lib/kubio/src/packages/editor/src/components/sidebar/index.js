import { createSlotFill } from '@wordpress/components';
import { ComplementaryArea } from '@wordpress/interface';
import BlockArea from './areas/block-area';
import DocumentArea from './areas/document-area';
import { useSelect } from '@wordpress/data';
import { map } from 'lodash';
import { Fragment } from '@wordpress/element';
import { STORE_KEY } from '../../store/constants';
import { useGetGlobalSessionProp } from '@kubio/editor-data';

const { Slot: InspectorSlot, Fill: InspectorFill } = createSlotFill(
	'ColibriEditSiteBlockEditorSidebarInspector'
);

function Sidebar() {
	const { isEditorSidebarOpened } = useSelect((select) => {
		let isOpened = select(STORE_KEY).isEditorSidebarOpened();
		const uiVersion = select(STORE_KEY).getUIVersion();

		switch (uiVersion) {
			case 2:
				isOpened = true;
				break;
		}

		return {
			isEditorSidebarOpened: isOpened,
		};
	}, []);

	return (
		isEditorSidebarOpened && (
			<div className={'kubio-sidebar'}>
				<ComplementaryArea.Slot scope={`${STORE_KEY}/sidebars`} />
			</div>
		)
	);
}

const SidebarComplementaryAreaFills = () => {
	const { subsidebars } = useSelect((select) => ({
		subsidebars: select(STORE_KEY).getSubSidebars(),
	}));

	const isReady = useGetGlobalSessionProp('ready', false);

	return isReady ? (
		<>
			<DocumentArea />
			<BlockArea>
				<InspectorSlot bubblesVirtually />
			</BlockArea>
			{map(subsidebars, (item, key) => (
				<Fragment key={key}>{item}</Fragment>
			))}
		</>
	) : null;
};

export const SidebarInspectorFill = InspectorFill;
export { SidebarComplementaryAreaFills };
export default Sidebar;
