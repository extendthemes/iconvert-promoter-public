import { createSlotFill } from '@wordpress/components';
import { ComplementaryArea } from '@wordpress/interface';

import { useSelect } from '@wordpress/data';
import { map } from 'lodash';
import { Fragment } from '@wordpress/element';
import { STORE_KEY, SidebarComponents } from '@kubio/editor';
import DocumentArea from './areas/document-area';
import { useGetGlobalSessionProp } from '@kubio/editor-data';

const { BlockArea } = SidebarComponents;

const { Slot: InspectorSlot, Fill: InspectorFill } = createSlotFill(
	'ColibriEditSiteBlockEditorSidebarInspector'
);

function Sidebar() {
	const { isEditorSidebarOpened } = useSelect(
		( select ) => ( {
			isEditorSidebarOpened: select( STORE_KEY ).isEditorSidebarOpened(),
		} ),
		[]
	);

	return (
		isEditorSidebarOpened && (
			<div className={ 'kubio-sidebar' }>
				<ComplementaryArea.Slot scope={ `${ STORE_KEY }/sidebars` } />
			</div>
		)
	);
}

const SidebarComplementaryAreaFills = () => {
	const { subsidebars } = useSelect( ( select ) => ( {
		subsidebars: select( STORE_KEY ).getSubSidebars(),
	} ) );

	const isReady = useGetGlobalSessionProp( 'ready', false );

	return isReady ? (
		<>
			<DocumentArea />
			<BlockArea>
				<InspectorSlot bubblesVirtually />
			</BlockArea>
			{ map( subsidebars, ( item, key ) => (
				<Fragment key={ key }>{ item }</Fragment>
			) ) }
		</>
	) : null;
};

export const SidebarInspectorFill = InspectorFill;
export { SidebarComplementaryAreaFills };
export default Sidebar;
