import { STORE_KEY } from '@kubio/constants';
import { isKubioEditor } from '@kubio/core';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';
import { each, get, set } from 'lodash';

const useGlobalDataEntityRecord = () => {
	const {
		entityId,
		entityType,
		defaultSettings,
		initialDefaultSettings,
		content,
		currentUserCanEditGlobalData,
		getEditedEntityRecord,
		isEntityLoaded,
	} = useSelect((select) => {
		const { getSettings } = select('core/block-editor');
		const {
			getCurrentTheme,
			getEditedEntityRecord: getEditedRecord,
			getEntityRecord,
			canUserEditEntityRecord,
		} = select('core');
		const editorSettings = select('core/editor')?.getEditorSettings();

		const { getEditedPostType, getEditedPostId } = select(STORE_KEY) || {};

		const settings = {
			...(editorSettings || {}),
			...getSettings(),
		};

		const {
			kubioGlobalStyleEntityId: _entityId,
			kubioGlobalStyleEntityType: _entityType,
			kubioGlobalStyleDefaults: _defaultSettings,
			kubioInitialGlobalStyleDefaults: _initialDefaultSettings,
		} = settings || window.kubioEditSiteSettings || {};

		const canEditGlobalData =
			canUserEditEntityRecord('postType', _entityType, _entityId) ||
			false;

		const entity =
			canEditGlobalData && _entityType && _entityId
				? getEditedRecord('postType', _entityType, _entityId)
				: null;

		const entityContent = entity?.content || '';

		return {
			content: entityContent,
			defaultSettings: _defaultSettings,
			initialDefaultSettings: _initialDefaultSettings,
			entityId: _entityId,
			entityType: _entityType,
			currentUserCanEditGlobalData: canEditGlobalData,
			getEditedEntityRecord: getEditedRecord,
			isEntityLoaded: !!entity,
		};
	}, []);

	const globalData = useMemo(() => {
		if (!currentUserCanEditGlobalData) {
			return defaultSettings;
		}
		try {
			return JSON.parse(content || '{}');
		} catch (e) {
			return {};
		}
	}, [content, currentUserCanEditGlobalData]);

	const { editEntityRecord } = useDispatch('core');

	const updateValues = useCallback(
		(valueMap) => {
			if (!isKubioEditor() || !isEntityLoaded) {
				return;
			}

			let nextGlobalData = defaultSettings;
			let currentContent;
			try {
				currentContent =
					getEditedEntityRecord('postType', entityType, entityId)
						?.content || '';
				nextGlobalData = JSON.parse(currentContent);
			} catch (e) {
				nextGlobalData = defaultSettings;
			}

			each(valueMap, (value, path) => {
				nextGlobalData = set(nextGlobalData, path, value);
			});

			try {
				return editEntityRecord('postType', entityType, entityId, {
					content: JSON.stringify(nextGlobalData),
					title: 'Kubio Globals',
				});
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e);
			}
		},
		[isEntityLoaded]
	);

	return useMemo(() => {
		if (!entityType || !entityId) {
			return null;
		}

		if (!content && currentUserCanEditGlobalData) {
			return null;
		}

		return {
			entityId,
			entityType,
			defaultSettings,
			initialDefaultSettings,
			content,
			globalData,
			updateValues,
		};
	}, [
		entityId,
		entityType,
		defaultSettings,
		initialDefaultSettings,
		content,
		currentUserCanEditGlobalData,
	]);
};

export { useGlobalDataEntityRecord };
