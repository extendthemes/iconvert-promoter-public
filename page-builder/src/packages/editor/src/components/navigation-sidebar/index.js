/**
 * WordPress dependencies
 */
import { createSlotFill } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { STORE_KEY } from '@kubio/editor';

/**
 * Internal dependencies
 */
import NavigationPanel from './navigation-panel';
import NavigationToggle from './navigation-toggle';

export const {
	Fill: NavigationPanelPreviewFill,
	Slot: NavigationPanelPreviewSlot,
} = createSlotFill( 'EditSiteNavigationPanelPreview' );

export default function NavigationSidebar() {
	const isNavigationOpen = useSelect( ( select ) => {
		return select( STORE_KEY ).isNavigationOpened();
	} );

	return (
		<>
			<NavigationToggle isOpen={ isNavigationOpen } />
			{ isNavigationOpen && (
				<NavigationPanel isOpen={ isNavigationOpen } />
			) }
			<NavigationPanelPreviewSlot />
		</>
	);
}
