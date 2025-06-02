/**
 * WordPress dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	store as keyboardShortcutsStore,
	useShortcut,
} from '@wordpress/keyboard-shortcuts';

function KeyboardShortcuts({ openEntitiesSavedStates }) {
	const {
		__experimentalGetDirtyEntityRecords,
		isSavingEntityRecord,
	} = useSelect(coreStore);

	const { redo, undo } = useDispatch(coreStore);

	useShortcut('kubio/edit-site/save', (event) => {
		event.preventDefault();

		const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
		const isDirty = !!dirtyEntityRecords.length;
		const isSaving = dirtyEntityRecords.some((record) =>
			isSavingEntityRecord(record.kind, record.name, record.key)
		);

		if (!isSaving && isDirty) {
			openEntitiesSavedStates();
		}
	});

	useShortcut('kubio/edit-site/undo', (event) => {
		undo();
		event.preventDefault();
	});

	useShortcut('kubio/edit-site/redo', (event) => {
		redo();
		event.preventDefault();
	});

	return null;
}
function KeyboardShortcutsRegister() {
	// Registering the shortcuts
	const { registerShortcut } = useDispatch(keyboardShortcutsStore);
	useEffect(() => {
		registerShortcut({
			name: 'kubio/edit-site/save',
			category: 'global',
			description: __('Save your changes.', 'kubio'),
			keyCombination: {
				modifier: 'primary',
				character: 's',
			},
		});

		registerShortcut({
			name: 'kubio/edit-site/undo',
			category: 'global',
			description: __('Undo your last changes.', 'kubio'),
			keyCombination: {
				modifier: 'primary',
				character: 'z',
			},
		});

		registerShortcut({
			name: 'kubio/edit-site/redo',
			category: 'global',
			description: __('Redo your last undo.', 'kubio'),
			keyCombination: {
				modifier: 'primaryShift',
				character: 'z',
			},
		});

		registerShortcut({
			name: 'kubio/edit-site/toggle-list-view',
			category: 'global',
			description: __('Open the block list view.', 'kubio'),
			keyCombination: {
				modifier: 'access',
				character: 'o',
			},
		});
	}, [registerShortcut]);

	return null;
}

KeyboardShortcuts.Register = KeyboardShortcutsRegister;
export default KeyboardShortcuts;
