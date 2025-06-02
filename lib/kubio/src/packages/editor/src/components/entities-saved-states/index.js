/**
 * External dependencies
 */
/**
 * WordPress dependencies
 */
import { Button, withFocusReturn } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';
import { _n, __ } from '@wordpress/i18n';
import { close as closeIcon } from '@wordpress/icons';
import { groupBy, some } from 'lodash';
/**
 * Internal dependencies
 */
import EntityTypeList from './entity-type-list';

const TRANSLATED_SITE_PROTPERTIES = {
	title: __('Title', 'kubio'),
	description: __('Tagline', 'kubio'),
	site_logo: __('Logo', 'kubio'),
	sitelogo: __('Logo', 'kubio'),
	show_on_front: __('Show on front', 'kubio'),
	page_on_front: __('Page on front', 'kubio'),
};

const ENTITY_NAMES = {
	wp_template_part: (number) =>
		_n('template part', 'template parts', number, 'kubio'),
	wp_template: (number) => _n('template', 'templates', number, 'kubio'),
	post: (number) => _n('post', 'posts', number, 'kubio'),
	page: (number) => _n('page', 'pages', number, 'kubio'),
	site: (number) => _n('site', 'sites', number, 'kubio'),
};

function EntitiesSavedStates({ isOpen, close }) {
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
				title: TRANSLATED_SITE_PROTPERTIES[property] || property,
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
	const { saveEditedEntityRecord } = useDispatch('core');
	// To group entities by type.
	const partitionedSavables = Object.values(
		groupBy(dirtyEntityRecords, 'name')
	);

	// Get labels for text-prompt phrase.
	const entityNamesForPrompt = [];
	partitionedSavables.forEach((list) => {
		if (ENTITY_NAMES[list[0].name]) {
			entityNamesForPrompt.push(ENTITY_NAMES[list[0].name](list.length));
		}
	});

	// Unchecked entities to be ignored by save function.
	const [unselectedEntities, _setUnselectedEntities] = useState([]);

	const setUnselectedEntities = ({ kind, name, key }, checked) => {
		if (checked) {
			_setUnselectedEntities(
				unselectedEntities.filter(
					(elt) =>
						elt.kind !== kind ||
						elt.name !== name ||
						elt.key !== key
				)
			);
		} else {
			_setUnselectedEntities([
				...unselectedEntities,
				{ kind, name, key },
			]);
		}
	};

	const getDirtyChckedEntities = () => {
		const entitiesToSave = dirtyEntityRecords.filter(
			({ kind, name, key }) => {
				return !some(
					unselectedEntities,
					(elt) =>
						elt.kind === kind &&
						elt.name === name &&
						elt.key === key
				);
			}
		);
		return entitiesToSave;
	};

	const saveCheckedEntities = () => {
		const entitiesToSave = getDirtyChckedEntities();

		close(entitiesToSave);

		entitiesToSave.forEach(({ kind, name, key }) => {
			saveEditedEntityRecord(kind, name, key);
		});
	};

	// Explicitly define this with no argument passed.  Using `close` on
	// its own will use the event object in place of the expected saved entities.
	const dismissPanel = useCallback(() => close(), [close]);
	const saveLabel = __('Save', 'kubio');
	return isOpen ? (
		<div className="entities-saved-states__panel kubio-entities-saved-states__panel">
			<div className="entities-saved-states__panel-header">
				<Button
					isPrimary
					disabled={
						dirtyEntityRecords.length -
							unselectedEntities.length ===
						0
					}
					onClick={saveCheckedEntities}
					className="editor-entities-saved-states__save-button"
				>
					{saveLabel}
				</Button>
				<Button
					onClick={dismissPanel}
					icon={closeIcon}
					label={__('Close panel', 'kubio')}
				/>
			</div>

			<div className="entities-saved-states__text-prompt">
				<strong>
					{__('Select the changes you want to save', 'kubio')}
				</strong>
				<p>
					{__(
						'Some changes may affect other areas of your site.',
						'kubio'
					)}
				</p>
			</div>

			{partitionedSavables.map((list) => {
				return (
					<EntityTypeList
						key={list[0].name}
						list={list}
						closePanel={dismissPanel}
						unselectedEntities={unselectedEntities}
						setUnselectedEntities={setUnselectedEntities}
					/>
				);
			})}
		</div>
	) : null;
}

export default withFocusReturn(EntitiesSavedStates);
