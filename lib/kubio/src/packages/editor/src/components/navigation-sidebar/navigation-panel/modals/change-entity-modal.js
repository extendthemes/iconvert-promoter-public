import {
	removeCachedAllMergedAttributes,
	useResetUndoStack,
	useUnloadStoreEntities,
} from '@kubio/core';
import { useSetGlobalSessionProp } from '@kubio/editor-data';
import { Button, ButtonGroup, Modal } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';
import { sprintf, __ } from '@wordpress/i18n';
import { noop } from 'lodash';
import { STORE_NAME } from '../../../../store/constants';

const excludedPostTypes = ['attachment', 'kubio_changeset'];

const ChangeEntityModal = ({
	onComplete = noop,
	closeModal = noop,
	entityName = __('other', 'kubio'),
	ModalComponent = Modal,
	modalProps = {},
	changeReadyState = true,
}) => {
	const resetEntities = useUnloadStoreEntities();
	const resetUndoStack = useResetUndoStack();
	const setReady = useSetGlobalSessionProp('ready');

	const [isSaving, setIsSaving] = useState(false);

	const { hasDirtyEntities, entitiesToSave } = useSelect((select) => {
		const {
			__experimentalGetDirtyEntityRecords: getDirtyEntityRecords,
		} = select('core');

		const hasContentDirtyEntities =
			getDirtyEntityRecords().filter(({ kind, name }) => {
				return kind === 'postType' && !excludedPostTypes.includes(name);
			}).length > 0;

		const dirtyEntitiesIds = getDirtyEntityRecords();

		return {
			hasDirtyEntities: hasContentDirtyEntities,
			entitiesToSave: dirtyEntitiesIds,
		};
	});

	const { saveEditedEntityRecord } = useDispatch('core');

	const saveEntities = () => {
		const promises = entitiesToSave.map(({ kind, name, key }) =>
			saveEditedEntityRecord(kind, name, key)
		);

		return Promise.all(promises);
	};

	const { setIsNavigationPanelOpened } = useDispatch(STORE_NAME);

	const changeEntity = useCallback(() => {
		setIsNavigationPanelOpened(false);
		if (changeReadyState) {
			setReady(false);
		}
		const { requestIdleCallback } = window;
		requestIdleCallback(() => {
			resetEntities();
			resetUndoStack();
			removeCachedAllMergedAttributes();
			requestIdleCallback(onComplete);
		});

		doAction('kubio.editor.page-changed');
	}, [changeReadyState, resetEntities, resetUndoStack, onComplete, setReady]);

	//check for changed entitiesa or directly switch
	useEffect(() => {
		if (!hasDirtyEntities) {
			changeEntity();
		}
	}, []);

	const onSave = () => {
		setIsSaving(true);
		saveEntities().then(() => {
			changeEntity();
			setIsSaving(false);
		});
	};

	const onDiscard = () => {
		changeEntity();
	};

	return (
		<>
			{hasDirtyEntities && (
				<ModalComponent
					title={__('You have unsaved changes', 'kubio')}
					onRequestClose={closeModal}
					{...modalProps}
				>
					<p>
						<span
							dangerouslySetInnerHTML={{
								__html: sprintf(
									// translators: %s: page name
									__(
										'You are being redirected to <strong>%s</strong> page.',
										'kubio'
									),
									entityName
								),
							}}
						/>
						<br />
						{__(
							'Would you like to save these changes or discard them?',
							'kubio'
						)}
					</p>
					<ButtonGroup
						className={'h-template-part-modal__button-group'}
					>
						<Button isLink onClick={onDiscard}>
							{__('Discard changes', 'kubio')}
						</Button>
						<Button
							isPrimary
							onClick={onSave}
							isBusy={isSaving}
							disabled={isSaving}
						>
							{__('Save changes', 'kubio')}
						</Button>
					</ButtonGroup>
				</ModalComponent>
			)}
		</>
	);
};

export { ChangeEntityModal };
