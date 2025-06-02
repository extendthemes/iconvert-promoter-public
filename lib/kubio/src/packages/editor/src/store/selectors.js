/**
 * External dependencies
 */
import _, { find, get, isEmpty } from 'lodash';
import createSelector from 'rememo';

/**
 * WordPress dependencies
 */
import { createRegistrySelector, select as storeSelect } from '@wordpress/data';
import { uploadMedia } from '@wordpress/media-utils';
import { STORE_KEY } from './constants';
import { currentTemplateIsPage, defaultTemplatesByPostType } from '@kubio/core';

const classicThemeDefaultTemplates = Object.values(
	defaultTemplatesByPostType
).map((item) => `${item}.php`);

/**
 * Returns whether the given feature is enabled or not.
 *
 * @param {Object} state   Global application state.
 * @param {string} feature Feature slug.
 * @return {boolean} Is active.
 */
export function isFeatureActive(state, feature) {
	if (feature === 'fullscreenMode') {
		return true;
	}

	// modified in kubio - feature removed
	if (feature === 'fixedToolbar') {
		return false;
	}

	return get(state.preferences.features, [feature], false);
}

/**
 * Returns the current editing canvas device type.
 *
 * @param {Object} state Global application state.
 * @return {string} Device type.
 */
export function __experimentalGetPreviewDeviceType(state) {
	return state.deviceType;
}

/**
 * Returns whether the current user can create media or not.
 *
 * @param {Object} state Global application state.
 * @return {Object} Whether the current user can create media or not.
 */
export const getCanUserCreateMedia = createRegistrySelector((select) => () =>
	select('core').canUser('create', 'media')
);

/**
 * Returns the settings, taking into account active features and permissions.
 *
 * @param {Object}   state             Global application state.
 * @param {Function} setIsInserterOpen Setter for the open state of the global inserter.
 * @return {Object} Settings.
 */
export const getSettings = createSelector(
	(state, setIsInserterOpen) => {
		const settings = {
			...state.settings,
			outlineMode: true,
			focusMode: isFeatureActive(state, 'focusMode'),
			hasFixedToolbar: isFeatureActive(state, 'fixedToolbar'),
			__experimentalSetIsInserterOpened: setIsInserterOpen,
		};

		const canUserCreateMedia = getCanUserCreateMedia(state);
		if (!canUserCreateMedia) {
			return settings;
		}

		settings.mediaUpload = ({ onError, ...rest }) => {
			uploadMedia({
				wpAllowedMimeTypes: state.settings.allowedMimeTypes,
				onError: ({ message }) => onError(message),
				...rest,
			});
		};
		return settings;
	},
	(state) => [
		getCanUserCreateMedia(state),
		state.settings,
		isFeatureActive(state, 'focusMode'),
		isFeatureActive(state, 'fixedToolbar'),
	]
);

/**
 * Returns the current home template ID.
 *
 * @param {Object} state Global application state.
 * @return {number?} Home template ID.
 */
export function getHomeTemplateId(state) {
	return state.homeTemplateId;
}

/**
 * Returns the current edited post type (wp_template or wp_template_part).
 *
 * @param {Object} state Global application state.
 * @return {number?} Template ID.
 */
export function getEditedPostType(state) {
	return state.editedPost.type;
}

/**
 * Returns the ID of the currently edited template or template part.
 *
 * @param {Object} state Global application state.
 * @return {number?} Post ID.
 */
export function getEditedPostId(state) {
	return state.editedPost.id;
}

/**
 * Returns the current page object.
 *
 * @param {Object} state Global application state.
 * @return {Object} Page.
 */
export function getPage(state) {
	return state.editedPost.page;
}

/**
 * Returns the current opened/closed state of the navigation panel.
 *
 * @param {Object} state Global application state.
 * @return {boolean} True if the navigation panel should be open; false if closed.
 */
export function isNavigationOpened(state) {
	return state.navigationPanel.isOpen;
}

/**
 * Returns the current opened/closed state of the navigation panel.
 *
 * @param {Object} state Global application state.
 * @return {boolean} True if the navigation panel should be open; false if closed.
 */
export function getNavigationMenu(state) {
	return state.navigationPanel?.menu;
}

/**
 * Returns the current opened/closed state of the inserter panel.
 *
 * @param {Object} state Global application state.
 * @return {boolean} True if the inserter panel should be open; false if closed.
 */
export function isInserterOpened(state) {
	return state.blockInserterPanel;
}

/**
 * Returns the current template ID.
 *
 * @param {Object} state Global application state.
 * @return {number} Template ID.
 */
export function getTemplateId(state) {
	return state.templateId;
}

/**
 * Returns the current template part ID.
 *
 * @param {Object} state Global application state.
 * @return {number} Template part ID.
 */
export function getTemplatePartId(state) {
	return state.templatePartId;
}

/**
 * Returns the current template type.
 *
 * @param {Object} state Global application state.
 * @return {string} Template type.
 */
export function getTemplateType(state) {
	return state.templateType;
}

/**
 * Returns the current template IDs.
 *
 * @param {Object} state Global application state.
 * @return {number[]} Template IDs.
 */
export function getTemplateIds(state) {
	return state.templateIds;
}

/**
 * Returns the current template part IDs.
 *
 * @param {Object} state Global application state.
 * @return {number[]} Template part IDs.
 */
export function getTemplatePartIds(state) {
	return state.templatePartIds;
}

/**
 * Returns the current entity object.
 *
 * @param {Object} state Global application state.
 * @return {Object} Page.
 */
export function getEntity(state) {
	return state.entity;
}

/**
 * Returns the site's current `show_on_front` setting.
 *
 * @param {Object} state Global application state.
 * @return {Object} The setting.
 */
export function getShowOnFront(state) {
	return state.showOnFront;
}

export const isEditorSidebarOpened = createRegistrySelector(
	(select) => (state, sidebar = null) => {
		const activeGeneralSidebar = select(
			'core/interface'
		).getActiveComplementaryArea(`${STORE_KEY}/sidebars`);

		if (sidebar) {
			return activeGeneralSidebar === `${STORE_KEY}/sidebar/${sidebar}`;
		}

		return !isEmpty(activeGeneralSidebar);
	}
);

export function getOpenedInserter(state) {
	return state.openedInserter?.value;
}

export function getOpenedInsertedClientId(state) {
	return state.openedInserter?.clientId;
}

export function getOpenedInsertedShouldReplace(state) {
	return !!state.openedInserter?.options?.replace;
}

export function getOpenedInsertedShouldCloseOnSelect(state) {
	return !!state.openedInserter?.options?.closeOnSelect;
}

export function getCurrentAncestor(state) {
	return state.currentAncestor;
}
export function getEditorOpenedSidebar() {
	return storeSelect('core/interface').getActiveComplementaryArea(
		`${STORE_KEY}/sidebars`
	);
}

export function getSubSidebars(state) {
	return state.subSidebars;
}

export function isGlobalStyleEditing(state) {
	return state.globalStyleEditing.value;
}

export function getGlobalStyleEditingPreviousEntity(state) {
	return state.globalStyleEditing.previousEntity;
}

export function isGutentagDebug(state) {
	return state.isGutentagDebug;
}
export function __experimentalGetInsertionPoint(state) {
	const { rootClientId, insertionIndex } = state.blockInserterPanel;
	return { rootClientId, insertionIndex };
}

/**
 * Returns true if the list view is opened.
 *
 * @param {Object} state Global application state.
 *
 * @return {boolean} Whether the list view is opened.
 */
export function isListViewOpened(state) {
	return state.listViewPanel;
}

export const getCurrentKubioTemplateSource = (state) => {
	const { templateId, templateType } = state;

	if (!templateId || !templateType) {
		return null;
	}

	return (
		storeSelect('core').getEditedEntityRecord(
			'postType',
			templateType,
			templateId
		)?.kubio_template_source || null
	);
};

export const getCurrentPageTemplate = (state) => {
	const context = state?.page?.context;
	let template = null;
	if (context?.postType && context?.postId) {
		template =
			storeSelect('core').getEditedEntityRecord(
				'postType',
				context?.postType,
				context?.postId
			).template ?? null;
	} else {
		template = state.templateId?.split('//').pop() ?? null;
	}

	const siteSettings = storeSelect('core').getEditedEntityRecord(
		'root',
		'site'
	);

	if (
		siteSettings.show_on_front === 'page' &&
		siteSettings.page_on_front === parseInt(context?.postId)
	) {
		const hasFrontPageTemplate = (
			storeSelect('core').getEntityRecords('postType', 'wp_template', {
				per_page: -1,
			}) || []
		)
			.map(({ id }) => id.split('//').pop())
			.includes('front-page');

		const { classicHasFrontPageTemplate } = storeSelect(
			'core/block-editor'
		).getSettings();
		if (hasFrontPageTemplate || classicHasFrontPageTemplate) {
			return 'front-page';
		}
	}

	if (template === '') {
		if (context?.postType === 'page') {
			template = 'page';
		} else {
			template = 'single';
		}
	}

	return template;
};

export const currentPageHasFSETemplate = (state) => {
	const template = getCurrentPageTemplate(state);
	const templateList = storeSelect('core').getEntityRecords(
		'postType',
		'wp_template',
		{
			per_page: -1,
		}
	);
	return (
		!!template &&
		(templateList || [])
			.map(({ id }) => id.split('//').pop())
			.includes(template)
	);
};
export const getCurrentPostType = (state) => {
	const context = state?.page?.context;

	return context?.postType || null;
};

export const getCurrentPostId = (state) => {
	const context = state?.page?.context;
	return context?.postId || null;
};

export const getIsBlogPage = (state) => {
	const context = state?.page?.context;
	const siteData = storeSelect('core').getEditedEntityRecord('root', 'site');
	const pageForPosts = siteData?.page_for_posts;

	return parseInt(pageForPosts) === parseInt(context.postId);
};
export const getIsFrontPage = (state) => {
	const page = getPage(state);
	const templateSlug = page?.context?.templateSlug;
	//has FSE template

	const isFrontPageFSE = templateSlug === 'front-page';
	//classic theme with no fse template

	const siteData = storeSelect('core').getEditedEntityRecord('root', 'site');
	const frontPageId = siteData?.page_on_front;
	const currentPageId = page?.context?.postId;
	const showPageOnFront = siteData.show_on_front === 'page';
	const isFrontPageClassic =
		showPageOnFront && parseInt(frontPageId) === parseInt(currentPageId);

	//We need to check for both conditions in case the FSE theme does not have the front page template
	const isFrontPage = isFrontPageFSE || isFrontPageClassic;

	return isFrontPage;
};

//this intended mostly for third party logic because it does not take into account templates
export const getIsInnerPage = (state) => {
	const siteData = storeSelect('core').getEditedEntityRecord('root', 'site');

	const currentPage = getPage(state);

	const context = _.get(currentPage, 'context', {});
	const { postType, postId } = context;
	const showPageOnFront = siteData?.show_on_front === 'page';
	const frontPageId = siteData?.page_on_front;
	const isFrontPage =
		showPageOnFront && parseInt(frontPageId) === parseInt(postId);
	const isBlogPage =
		showPageOnFront &&
		parseInt(siteData?.page_for_posts) === parseInt(postId);
	const isInnerPage = postType === 'page' && !isBlogPage && !isFrontPage;

	return isInnerPage;
};

export const getAvailablePageTemplates = () => {
	const blockTemplates =
		storeSelect('core')
			.getEntityRecords('postType', 'wp_template', {
				per_page: -1,
			})
			?.filter(({ slug }) => currentTemplateIsPage(slug)) || [];
	const classicTemplates =
		storeSelect('core/block-editor').getSettings()?.classicThemeTemplates ||
		[];
	const mappedTemplates = blockTemplates.map(
		// eslint-disable-next-line no-shadow
		({ title, slug, kubio_template_source: source = 'custom' }) => {
			return {
				value: slug,
				label:
					source === 'kubio'
						? title.rendered.replace('Kubio', '').trim() // remove the Kubio from template name -> Kubio Full Width => Full Width
						: title.rendered,
				source,
			};
		}
	);
	Object.keys(classicTemplates).forEach((slug) => {
		const label = classicTemplates[slug];
		const hasBlockTemplateReplacement = find(blockTemplates, {
			slug: slug.replace('.php', ''),
		});
		if (!hasBlockTemplateReplacement) {
			mappedTemplates.push({
				value: classicThemeDefaultTemplates.includes(slug)
					? slug.replace('.php', '')
					: slug,
				label,
				isClassicTemplate: true,
				source: 'theme',
			});
		}
	});

	//this selector is intended for pages only.
	mappedTemplates.forEach((template) => {
		if (template.value === 'page') {
			template.value = '';
		}
	});

	return _.sortBy(mappedTemplates, ['source', 'label']);
};
export function getClassicTemplateId(state) {
	return state?.classicTemplate?.id;
}

export function getIsWooCommercePage(state) {
	const currentPage = getPage(state);
	const context = _.get(currentPage, 'context', {});
	const { postType, postId } = context;
	const woocommercePageIds = storeSelect('core/block-editor').getSettings()
		?.kubioBasicWooCommerce?.pagesIds;
	if (postType === 'product') {
		return true;
	}

	const wooCommercePagesIds = Object.values(woocommercePageIds || {});
	return wooCommercePagesIds.includes(parseInt(postId));
}

export const getUIVersion = createSelector(
	(state) => {
		const globalSettings = state.settings?.kubioGlobalSettings;
		return globalSettings?.editorUIVersion || 1;
	},
	(state) => [state.settings]
);
