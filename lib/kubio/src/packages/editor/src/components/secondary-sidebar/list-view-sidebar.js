/**
 * WordPress dependencies
 */
import {
	store as blockEditorStore,
	__experimentalListView as ListView,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import {
	useFocusOnMount,
	useFocusReturn,
	useInstanceId,
	useMergeRefs,
} from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { closeSmall } from '@wordpress/icons';
import { ESCAPE } from '@wordpress/keycodes';
import { STORE_KEY } from '../../store/constants';
/**
 * Internal dependencies
 */

export default function ListViewSidebar() {
	const { setIsListViewOpened } = useDispatch(STORE_KEY);

	const { clearSelectedBlock, selectBlock } = useDispatch(blockEditorStore);
	async function selectEditorBlock(clientId) {
		await clearSelectedBlock();
		selectBlock(clientId, -1);
	}

	const focusOnMountRef = useFocusOnMount('firstElement');
	const focusReturnRef = useFocusReturn();
	function closeOnEscape(event) {
		if (event.keyCode === ESCAPE && !event.defaultPrevented) {
			setIsListViewOpened(false);
		}
	}

	const instanceId = useInstanceId(ListViewSidebar);
	const labelId = `edit-site-editor__list-view-panel-label-${instanceId}`;

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			aria-labelledby={labelId}
			className="edit-site-editor__list-view-panel"
			onKeyDown={closeOnEscape}
		>
			<div className="edit-site-editor__list-view-panel-header">
				<strong id={labelId}>{__('List view', 'kubio')}</strong>
				<Button
					icon={closeSmall}
					label={__('Close list view sidebar', 'kubio')}
					onClick={() => setIsListViewOpened(false)}
				/>
			</div>
			<div
				className="edit-site-editor__list-view-panel-content"
				ref={useMergeRefs([focusReturnRef, focusOnMountRef])}
			>
				<ListView
					onSelect={selectEditorBlock}
					showNestedBlocks
					__experimentalFeatures
					__experimentalPersistentListViewFeatures
				/>
			</div>
		</div>
	);
}
