/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { combineReducers } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { MENU_ROOT } from '../components/navigation-sidebar/navigation-panel/constants';
import { PREFERENCES_DEFAULTS } from './defaults';
import isEqual from 'react-fast-compare';

/**
 * Reducer returning the user preferences.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 * @return {Object} Updated state.
 */
export const preferences = combineReducers({
	features(state = PREFERENCES_DEFAULTS.features, action) {
		switch (action.type) {
			case 'TOGGLE_FEATURE': {
				return {
					...state,
					[action.feature]: !state[action.feature],
				};
			}
			default:
				return state;
		}
	},
});

/**
 * Reducer returning the editing canvas device type.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function deviceType(state = 'Desktop', action) {
	switch (action.type) {
		case 'SET_PREVIEW_DEVICE_TYPE':
			return action.deviceType;
	}

	return state;
}

/**
 * Reducer returning the settings.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function settings(state = {}, action) {
	switch (action.type) {
		case 'UPDATE_SETTINGS':
			return {
				...state,
				...action.settings,
			};

		case 'UPDATE_UI_VERSION':
			apiFetch({
				path: addQueryArgs('/kubio/v1/update-ui-version', {
					version: action.version,
				}),
			});

			return {
				...state,
				kubioGlobalSettings: {
					...(state.kubioGlobalSettings || {}),
					editorUIVersion: action.version,
				},
			};
	}

	return state;
}

/**
 * Reducer keeping track of the currently edited Post Type,
 * Post Id and the context provided to fill the content of the block editor.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function editedPost(state = {}, action) {
	switch (action.type) {
		case 'SET_TEMPLATE':
		case 'SET_PAGE':
			return {
				type: 'wp_template',
				id: action.templateId,
				page: action.page,
			};

		case 'SET_PAGE_CONTENT':
			return {
				page: action.page,
			};
		case 'SET_TEMPLATE_PART':
			return {
				type: 'wp_template_part',
				id: action.templatePartId,
				page: {
					context: {},
				},
			};
	}

	return state;
}

/**
 * Reducer for information about the site's homepage.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function homeTemplateId(state, action) {
	switch (action.type) {
		case 'SET_HOME_TEMPLATE':
			return action.homeTemplateId;
	}

	return state;
}

/**
 * Reducer for information about the navigation panel, such as its active menu
 * and whether it should be opened or closed.
 *
 * Note: this reducer interacts with the block inserter panel reducer to make
 * sure that only one of the two panels is open at the same time.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 */
export function navigationPanel(
	state = { menu: MENU_ROOT, isOpen: false },
	action
) {
	switch (action.type) {
		case 'OPEN_NAVIGATION_PANEL_TO_MENU':
			return {
				...state,
				isOpen: true,
				menu: action.menu,
			};
		case 'SET_IS_NAVIGATION_PANEL_OPENED':
			return {
				...state,
				menu: !action.isOpen ? MENU_ROOT : state.menu, // Set menu to root when closing panel.
				isOpen: action.isOpen,
			};
		case 'SET_IS_INSERTER_OPENED':
			return {
				...state,
				menu: state.isOpen && action.isOpen ? MENU_ROOT : state.menu, // Set menu to root when closing panel.
				isOpen: action.isOpen ? false : state.isOpen,
			};
	}
	return state;
}

/**
 * Reducer to set the block inserter panel open or closed.
 *
 * Note: this reducer interacts with the navigation panel reducer to make
 * sure that only one of the two panels is open at the same time.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 */
export function blockInserterPanel(state = false, action) {
	switch (action.type) {
		case 'OPEN_NAVIGATION_PANEL_TO_MENU':
			return false;
		case 'SET_IS_NAVIGATION_PANEL_OPENED':
			return action.isOpen ? false : state;
		case 'SET_IS_INSERTER_OPENED':
			return action.isOpen;
	}
	return state;
}
/**
 * Reducer returning the template ID.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function templateId(state, action) {
	switch (action.type) {
		case 'SET_TEMPLATE':
		case 'ADD_TEMPLATE':
		case 'SET_PAGE':
		case 'SET_ENTITY':
			return action.templateId;
		case 'SET_TEMPLATE_PART':
			return undefined;
	}

	return state;
}

/**
 * Reducer returning the template part ID.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function templatePartId(state, action) {
	switch (action.type) {
		case 'SET_TEMPLATE_PART':
			return action.templatePartId;
	}

	return state;
}

/**
 * Reducer returning the template type.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function templateType(state, action) {
	switch (action.type) {
		case 'SET_TEMPLATE':
		case 'ADD_TEMPLATE':
		case 'SET_PAGE':
		case 'SET_ENTITY':
			return 'wp_template';
		case 'SET_TEMPLATE_PART':
			return 'wp_template_part';
	}

	return state;
}

/**
 * Reducer returning the list of template IDs.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function templateIds(state = [], action) {
	switch (action.type) {
		case 'ADD_TEMPLATE':
			return [...state, action.templateId];
		case 'REMOVE_TEMPLATE':
			return state.filter((id) => id !== action.templateId);
	}

	return state;
}

/**
 * Reducer returning the list of template part IDs.
 *
 * @param {Object} state Current state.
 *
 * @return {Object} Updated state.
 */
export function templatePartIds(state = []) {
	return state;
}

/**
 * Reducer returning the page being edited.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function page(state = {}, action) {
	switch (action.type) {
		case 'SET_PAGE':
		case 'SET_PAGE_CONTENT':
		case 'SET_TEMPLATE':
			return action.page;
		case 'SET_TEMPLATE_PART':
			return {
				context: {},
			};
	}

	return state;
}

/**
 * Reducer returning the entity being edited.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function entity(state = {}, action) {
	switch (action.type) {
		case 'SET_ENTITY':
			return action.entity;
	}

	return state;
}

/**
 * Reducer returning the site's `show_on_front` setting.
 *
 * @param {Object} state Current state.
 *
 * @return {Object} Updated state.
 */
export function showOnFront(state) {
	return state;
}

export function subSidebars(state = {}, action) {
	switch (action.type) {
		case 'ADD_SUBSIDEBAR':
			if (state[action.areaIdentifier]) {
				return state;
			}

			return {
				...state,
				[action.areaIdentifier]: action.sidebar,
			};

		case 'REMOVE_SUBSIDEBAR':
			return {
				...state,
				[action.areaIdentifier]: false,
			};
	}

	return state;
}

export function globalStyleEditing(
	state = { value: undefined, previousEntity: null },
	action
) {
	switch (action.type) {
		case 'TOGGLE_GLOBAL_STYLE_EDITING':
			return {
				...state,
				value: action.value,
				previousEntity: action.previousEntity,
			};
	}

	return state;
}

export function openedInserter(state = false, action) {
	switch (action.type) {
		case 'TOGGLE_IS_INSERTER_OPEN':
			action.options = action.options || {};

			if (isEqual(state, action)) {
				return state;
			}

			return {
				value: action?.value,
				clientId: action?.rootClientId,
				options: action?.options || {},
			};
	}

	return state;
}

export function isGutentagDebug(state = false, action) {
	switch (action.type) {
		case 'TOGGLE_GUTENTAG_DEBUG':
			return action?.value;
	}

	return state;
}

export function currentAncestor(state = '', action) {
	switch (action.type) {
		case 'SET_CURRENT_ANCESTOR':
			return action.currentAncestor;
	}
	return state;
}
export function classicTemplate(state, action) {
	switch (action.type) {
		case 'SET_PAGE':
		case 'SET_PAGE_CONTENT':
			return {
				...state,
				id: action?.classicTemplateId,
			};
	}

	return state;
}
/**
 * Reducer to set the list view panel open or closed.
 *
 * Note: this reducer interacts with the navigation and inserter panels reducers
 * to make sure that only one of the three panels is open at the same time.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 */
export function listViewPanel(state = false, action) {
	switch (action.type) {
		case 'OPEN_NAVIGATION_PANEL_TO_MENU':
			return false;
		case 'SET_IS_NAVIGATION_PANEL_OPENED':
			return action.isOpen ? false : state;
		case 'SET_IS_INSERTER_OPENED':
			return action.value ? false : state;
		case 'SET_IS_LIST_VIEW_OPENED':
			return action.isOpen;
	}
	return state;
}

export default combineReducers({
	preferences,
	deviceType,
	settings,
	editedPost,
	homeTemplateId,
	navigationPanel,
	blockInserterPanel,
	currentAncestor,
	templateId,
	templatePartId,
	templateType,
	templateIds,
	templatePartIds,
	page,
	entity,
	showOnFront,
	subSidebars,
	globalStyleEditing,
	openedInserter,
	isGutentagDebug,
	classicTemplate,
	listViewPanel,
});
