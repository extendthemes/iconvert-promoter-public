/**
 * External dependencies
 */
import { Button } from '@wordpress/components';
/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { some } from 'lodash';
import { ArrowDown } from '@kubio/icons';
import { store as coreStore } from '@wordpress/core-data';

export default function SaveButton({ openEntitiesSavedStates }) {
	const { saveEditedEntityRecord } = useDispatch('core');

	const { isSaving: isSavingPublish, isDirty } = useSelect((select) => {
		const {
			__experimentalGetDirtyEntityRecords,
			isSavingEntityRecord,
		} = select('core');
		const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();

		return {
			isDirty: dirtyEntityRecords.length > 0,
			isSaving: some(dirtyEntityRecords, (record) =>
				isSavingEntityRecord(record.kind, record.name, record.key)
			),
		};
	});

	const disabled = !isDirty || isSavingPublish;
	const saveButtonLabel = __('Save', 'kubio');

	const { dirtyEntityRecords } = useSelect((select) => {
		const dirtyRecords = select(
			coreStore
		).__experimentalGetDirtyEntityRecords();

		// Remove site object and decouple into its edited pieces.
		const dirtyRecordsWithoutSite = dirtyRecords.filter(
			(record) => !(record.kind === 'root' && record.name === 'site')
		);

		const siteEdits = select(coreStore).getEntityRecordEdits(
			'root',
			'site'
		);

		const siteEditsAsEntities = [];
		for (const property in siteEdits) {
			siteEditsAsEntities.push({
				kind: 'root',
				name: 'site',
				property,
			});
		}
		const dirtyRecordsWithSiteItems = [
			...dirtyRecordsWithoutSite,
			...siteEditsAsEntities,
		];

		return {
			dirtyEntityRecords: dirtyRecordsWithSiteItems,
		};
	}, []);

	const saveAllEntities = () => {
		dirtyEntityRecords.forEach(({ kind, name, key }) => {
			saveEditedEntityRecord(kind, name, key);
		});
	};

	return (
		<>
			<Button
				isPrimary
				className="edit-site-save-button__button"
				aria-disabled={disabled}
				disabled={disabled}
				isBusy={isSavingPublish}
				onClick={disabled ? undefined : saveAllEntities}
			>
				{saveButtonLabel}
			</Button>
			<Button
				isPrimary
				icon={ArrowDown}
				iconSize={24}
				className="edit-site-save-button__dropdown"
				aria-disabled={disabled}
				disabled={disabled}
				onClick={disabled ? undefined : openEntitiesSavedStates}
			></Button>
		</>
	);
}
