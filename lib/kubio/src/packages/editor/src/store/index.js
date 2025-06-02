/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data';
import { controls } from '@wordpress/data-controls';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import { STORE_NAME } from './constants';

const storeConfig = {
	reducer,
	actions,
	selectors,
	controls,
	persist: ['preferences'],
};

//this is the equivalent of core/edit-site do not confuse with the core/editor.
export default async function registerEditSiteStore(initialState) {
	const store = registerStore(STORE_NAME, {
		...storeConfig,
		initialState,
	});

	// const template = await __experimentalGetTemplateForLink(
	// 	store.getState().entity.path
	// );
	// console.log('register edit site store');
	// wp.data.dispatch(STORE_NAME).setPage(store.getState().entity, template);

	return store;
}
