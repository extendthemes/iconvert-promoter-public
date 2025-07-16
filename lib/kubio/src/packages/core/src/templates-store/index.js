/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import { TEMPLATE_STORE_NAME } from './constants';
import { startSync } from './sync';

const storeConfig = {
	reducer,
	actions,
	selectors,
	persist: [ 'preferences' ],
};
const defaultState = {
	isEditableTemplatePartAreaById: {
		header: false,
		footer: false,
		sidebar: false,
	},
	data: {
		storeData: {
			currentTemplate: null,
			postId: null,
			postType: null,
			editedTemplatesById: {},
		},
		computedData: {
			configPerType: {},
			currentPageUrl: null,
			templateIsUsedOnMultiplePages: false,
			templateOptions: [],
			templateParsedContentById: {},
			templatePartDataByType: {},
		},
	},
};

export function registerTemplateStore() {
	const store = registerStore( TEMPLATE_STORE_NAME, {
		...storeConfig,
		initialState: defaultState,
	} );

	startSync();

	return store;
}

export function currentTemplateIsPage( slug ) {
	slug = slug.split( '//' ).pop();
	return (
		slug === 'page' ||
		slug?.startsWith( 'page-' ) ||
		slug?.startsWith( 'kubio-page-' ) ||
		slug === 'full-width' ||
		slug === 'kubio-full-width'
	);
}

export function currentTemplateIsPost( slug ) {
	return (
		slug === 'single' || slug === 'singular' || slug.startsWith( 'post-' )
	);
}

export { TEMPLATE_STORE_NAME };
export * from './sync';
export {
	coreTemplatesSlugThatCanBeCopied,
	defaultTemplatesByPostType,
} from './config';
export { useTemplatePartLock, isCoreTemplate } from './utils';
