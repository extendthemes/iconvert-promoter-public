import { useGlobalSessionProp } from '@kubio/editor-data';
import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';
import { useCallback, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { omit, pick } from 'lodash';
import { getKubioUrlWithRestPrefix } from '@kubio/constants';

const useChangesetPost = () => {
	const [entity, setEntity] = useGlobalSessionProp('previewChangest', {});

	const uuid = useSelect((select) => {
		return select('core/block-editor').getSettings()?.changeset_uuid;
	});

	useEffect(() => {
		if (!entity.id && uuid && !entity.isLoading) {
			setEntity({
				...entity,
				isLoading: true,
			});
			apiFetch({
				path: addQueryArgs('/wp/v2/kubio/preview-changeset/', {
					slug: uuid,
				}),
			}).then((currentEntity) => {
				if (currentEntity && currentEntity.length) {
					setEntity({
						...currentEntity[0],
						isLoading: false,
					});
				}
			});
		}
	}, [entity, setEntity, uuid]);

	const saveChangeset = async (data) => {
		let currentEntity = entity;
		if (!currentEntity.id) {
			currentEntity = await apiFetch({
				path: addQueryArgs('/wp/v2/kubio/preview-changeset/', {
					slug: uuid,
				}),
			});
			setEntity(currentEntity);
		}

		await apiFetch({
			path: `/wp/v2/kubio/preview-changeset/${currentEntity.id}`,
			method: 'POST',
			data: {
				...pick(entity, ['title', 'slug', 'type']),
				content: JSON.stringify(omit(data, 'updatesRecords')),
			},
		});

		return uuid;
	};

	const deleteChangesetOnWindowUnload = useCallback(() => {
		if (!entity.id) {
			return;
		}
		const action = getKubioUrlWithRestPrefix('kubio-delete-changeset');
		if (window.navigator.sendBeacon) {
			window.navigator.sendBeacon(
				`${window.ajaxurl}?action=${action}&uuid=${entity.slug}`
			);
		}
	}, [entity.id]);

	useEffect(() => {
		// eslint-disable-next-line @wordpress/no-global-event-listener
		window.addEventListener('beforeunload', deleteChangesetOnWindowUnload);

		return () =>
			// eslint-disable-next-line @wordpress/no-global-event-listener
			window.removeEventListener(
				'beforeunload',
				deleteChangesetOnWindowUnload
			);
	}, [entity.id]);

	return {
		saveChangeset,
	};
};

export { useChangesetPost };
