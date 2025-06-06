/**
 * WordPress dependencies
 */
import { createReduxStore, registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as privateActions from './private-actions';
import * as privateSelectors from './private-selectors';
import * as resolvers from './resolvers';
import * as actions from './actions';
import { STORE_NAME } from './constants';
import { unlock } from '../lock-unlock';
import { wpVersionCompare } from '@kubio/utils';

// private stuff were introduced in 6.3 , register them as normal stuff for older wp versions
const canRegisterPrivate = wpVersionCompare( '6.2', '>=' );

/**
 * Block editor data store configuration.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#registerStore
 */
export const storeConfig = {
	reducer,
	resolvers,
	selectors: canRegisterPrivate
		? selectors
		: {
				...selectors,
				...privateSelectors,
		  },
	actions: canRegisterPrivate
		? actions
		: {
				...actions,
				...privateActions,
		  },
};

/**
 * Store definition for the block editor namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 */
export const store = createReduxStore( STORE_NAME, {
	...storeConfig,
	persist: [ 'preferences' ],
} );

// We will be able to use the `register` function once we switch
// the "preferences" persistence to use the new preferences package.
const registeredStore = registerStore( STORE_NAME, {
	...storeConfig,
	persist: [ 'preferences' ],
} );
//modified in kubio
unlock( registeredStore )?.registerPrivateActions?.( privateActions );
unlock( registeredStore )?.registerPrivateSelectors?.( privateSelectors );

// TODO: Remove once we switch to the `register` function (see above).
//
// Until then, private functions also need to be attached to the original
// `store` descriptor in order to avoid unit tests failing, which could happen
// when tests create new registries in which they register stores.
//
// @see https://github.com/WordPress/gutenberg/pull/51145#discussion_r1239999590
unlock( store )?.registerPrivateActions?.( privateActions );
unlock( store )?.registerPrivateSelectors?.( privateSelectors );
