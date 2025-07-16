import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { STORE_KEY } from '../store/constants';

export const useBlockSelectionListener = function useBlockSelectionListener() {
	const {
		hasBlockSelection,
		isEditorSidebarOpened,
		isGlobalStyleEditing,
	} = useSelect(
		(select) => ({
			hasBlockSelection: !!select(
				'core/block-editor'
			).getBlockSelectionStart(),
			isEditorSidebarOpened: select(STORE_KEY).isEditorSidebarOpened(),
			isGlobalStyleEditing: select(STORE_KEY).isGlobalStyleEditing(),
		}),
		[]
	);

	const { openSidebar } = useDispatch(STORE_KEY);

	useEffect(
		function () {
			if (!isEditorSidebarOpened) {
				return;
			}

			if (hasBlockSelection) {
				openSidebar('block-inspector');
			} else if (isGlobalStyleEditing) {
				openSidebar('document/general-settings');
			} else {
				openSidebar('document');
			}
		},
		[hasBlockSelection, isEditorSidebarOpened, isGlobalStyleEditing]
	);
};
