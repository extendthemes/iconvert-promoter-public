import { useDispatch, useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { serialize } from '@wordpress/blocks';
import { find, last } from 'lodash';
import {
	gutentagSaveEntity,
	entityStatus,
	autosaveTypes,
} from './gutentag-save-entity';

const nonAutosaveableEntities = [
	{
		kind: 'kubio',
		name: 'menu',
	},
	{
		kind: 'root',
		name: 'site',
	},
];

const usePrepareChangeset = () => {
	const {
		getDirtyEntityRecords,
		getAutosaves,
		getEntityRecordEdits,
		getEditedEntityRecord,
	} = useSelect((select) => {
		return {
			getDirtyEntityRecords: select('core')
				.__experimentalGetDirtyEntityRecords,
			getAutosaves: select('core').getAutosaves,
			getEntityRecordEdits: select('core').getEntityRecordEdits,
			getEditedEntityRecord: select('core').getEditedEntityRecord,
		};
	});

	const { saveEditedEntityRecord } = useDispatch('core');

	return async (
		entitiesToSave,
		{ autosaveType = autosaveTypes.PREVIEW } = {}
	) => {
		let dirtyEntities = [];
		if (entitiesToSave) {
			dirtyEntities = entitiesToSave;
		} else {
			dirtyEntities = getDirtyEntityRecords();
		}

		const autosaveableEntities = dirtyEntities.filter(({ kind, name }) => {
			return !find(nonAutosaveableEntities, { kind, name });
		});

		const specialEntities = dirtyEntities.filter(
			({ kind, name, key }) =>
				!find(autosaveableEntities, { kind, name, key })
		);

		const savePromises = autosaveableEntities.map(({ kind, name, key }) => {
			const postData = getEditedEntityRecord(kind, name, key);

			let content;
			if (postData?.blocks) {
				content = serialize(postData.blocks);
			} else if (typeof postData?.content === 'string') {
				content = postData?.content;
			} else {
				return null;
			}
			if (
				[
					'wp_template',
					'wp_template_part',
					'page',
					'post',
					'product',
				].indexOf(postData.type) !== -1
			) {
				return gutentagSaveEntity(
					{
						...postData,
						content,
					},
					entityStatus.AUTOSAVE,
					{ type: autosaveType }
				);
			}

			return saveEditedEntityRecord(kind, name, key, {
				isAutosave: true,
			});
		});

		const customEntities = specialEntities.map(({ kind, name, key }) => ({
			kind,
			name,
			key,
			...getEntityRecordEdits(kind, name, key),
		}));

		const pageTemplatesMap = getDirtyEntityRecords()
			?.filter(({ name }) => name === 'page' || name === 'post')
			.reduce((acc, { key, name, kind }) => {
				const entity = getEditedEntityRecord(kind, name, key);

				return (acc = {
					...acc,
					[key]: entity?.template,
				});
			}, {});

		return Promise.all(savePromises).then((responses) => {
			const autosavesPromises = autosaveableEntities.map(
				({ name, key }, index) => {
					if (responses[index]) {
						return {
							id: responses[index].ID || responses[index].id,
							parent:
								responses[index].post_parent ||
								responses[index].parent,
							data: responses[index],
						};
					}
					return last(getAutosaves(name, key));
				}
			);

			return Promise.all(autosavesPromises).then((values) => {
				const autosaves = values
					.filter(Boolean)
					.map(({ id, parent }) => ({
						id,
						parent,
					}));
				const updatesRecords = values.map((result) => result?.data);
				return {
					updatesRecords,
					autosaves,
					customEntities,
					pageTemplatesMap,
					customData: applyFilters('kubio/custom-preview-data', {}),
				};
			});
		});
	};
};

export { usePrepareChangeset };
