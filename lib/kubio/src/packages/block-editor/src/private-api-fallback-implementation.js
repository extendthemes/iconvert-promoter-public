/**
 * wordpress/private-apis – the utilities to enable private cross-package
 * exports of private APIs.
 *
 * This "implementation.js" file is needed for the sake of the unit tests. It
 * exports more than the public API of the package to aid in testing.
 */

import { wpVersionCompare } from '@kubio/utils';

/**
 * The list of core modules allowed to opt-in to the private APIs.
 */
const CORE_MODULES_USING_PRIVATE_APIS = [
	'@wordpress/block-editor',
	'@wordpress/block-library',
	'@wordpress/blocks',
	'@wordpress/components',
	'@wordpress/customize-widgets',
	'@wordpress/data',
	'@wordpress/edit-post',
	'@wordpress/edit-site',
	'@wordpress/edit-widgets',
	'@wordpress/editor',
];

/**
 * A list of core modules that already opted-in to
 * the privateApis package.
 *
 * @type {string[]}
 */
const registeredPrivateApis = [];

/*
 * Warning for theme and plugin developers.
 *
 * The use of private developer APIs is intended for use by WordPress Core
 * and the Gutenberg plugin exclusively.
 *
 * Dangerously opting in to using these APIs is NOT RECOMMENDED. Furthermore,
 * the WordPress Core philosophy to strive to maintain backward compatibility
 * for third-party developers DOES NOT APPLY to private APIs.
 *
 * THE CONSENT STRING FOR OPTING IN TO THESE APIS MAY CHANGE AT ANY TIME AND
 * WITHOUT NOTICE. THIS CHANGE WILL BREAK EXISTING THIRD-PARTY CODE. SUCH A
 * CHANGE MAY OCCUR IN EITHER A MAJOR OR MINOR RELEASE.
 */
const isWp64 = wpVersionCompare( '6.4', '>=' );
const isWp66 = wpVersionCompare( '6.6', '>=' );
export let requiredConsent = isWp64
	? 'I know using unstable features means my theme or plugin will inevitably break in the next version of WordPress.'
	: 'I know using unstable features means my plugin or theme will inevitably break on the next WordPress release.';

if ( isWp66 ) {
	requiredConsent =
		'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.';
}

/** @type {boolean} */
let allowReRegistration;
// Use try/catch to force "false" if the environment variable is not explicitly
// set to true (e.g. when building WordPress core).
try {
	allowReRegistration = process.env.ALLOW_EXPERIMENT_REREGISTRATION ?? false;
} catch ( error ) {
	allowReRegistration = false;
}

/**
 * Called by a @wordpress package wishing to opt-in to accessing or exposing
 * private private APIs.
 *
 * @param {string} consent    The consent string.
 * @param {string} moduleName The name of the module that is opting in.
 * @return {{lock: typeof lock, unlock: typeof unlock}} An object containing the lock and unlock functions.
 */
export const __dangerousOptInToUnstableAPIsOnlyForCoreModules = (
	consent,
	moduleName
) => {
	if ( ! CORE_MODULES_USING_PRIVATE_APIS.includes( moduleName ) ) {
		throw new Error(
			`You tried to opt-in to unstable APIs as module "${ moduleName }". ` +
				'This feature is only for JavaScript modules shipped with WordPress core. ' +
				'Please do not use it in plugins and themes as the unstable APIs will be removed ' +
				'without a warning. If you ignore this error and depend on unstable features, ' +
				'your product will inevitably break on one of the next WordPress releases.'
		);
	}
	if (
		! allowReRegistration &&
		registeredPrivateApis.includes( moduleName )
	) {
		// This check doesn't play well with Story Books / Hot Module Reloading
		// and isn't included in the Gutenberg plugin. It only matters in the
		// WordPress core release.
		throw new Error(
			`You tried to opt-in to unstable APIs as module "${ moduleName }" which is already registered. ` +
				'This feature is only for JavaScript modules shipped with WordPress core. ' +
				'Please do not use it in plugins and themes as the unstable APIs will be removed ' +
				'without a warning. If you ignore this error and depend on unstable features, ' +
				'your product will inevitably break on one of the next WordPress releases.'
		);
	}
	if ( requiredConsent !== consent ) {
		throw new Error(
			`You tried to opt-in to unstable APIs without confirming you know the consequences. ` +
				'This feature is only for JavaScript modules shipped with WordPress core. ' +
				'Please do not use it in plugins and themes as the unstable APIs will removed ' +
				'without a warning. If you ignore this error and depend on unstable features, ' +
				'your product will inevitably break on the next WordPress release.'
		);
	}
	registeredPrivateApis.push( moduleName );

	return {
		lock,
		unlock,
	};
};

/**
 * Binds private data to an object.
 * It does not alter the passed object in any way, only
 * registers it in an internal map of private data.
 *
 * The private data can't be accessed by any other means
 * than the `unlock` function.
 *
 * @example
 * ```js
 * const object = {};
 * const privateData = { a: 1 };
 * lock( object, privateData );
 *
 * object
 * // {}
 *
 * unlock( object );
 * // { a: 1 }
 * ```
 *
 * @param {any} object      The object to bind the private data to.
 * @param {any} privateData The private data to bind to the object.
 */
function lock( object, privateData ) {
	if ( ! ( __private in object ) ) {
		object[ __private ] = {};
	}
	lockedData.set( object[ __private ], privateData );
}

/**
 * Unlocks the private data bound to an object.
 *
 * It does not alter the passed object in any way, only
 * returns the private data paired with it using the `lock()`
 * function.
 *
 * @example
 * ```js
 * const object = {};
 * const privateData = { a: 1 };
 * lock( object, privateData );
 *
 * object
 * // {}
 *
 * unlock( object );
 * // { a: 1 }
 * ```
 *
 * @param {any} object The object to unlock the private data from.
 * @return {any} The private data bound to the object.
 */
function unlock( object ) {
	if ( ! object ) {
		return object;
	}
	if ( ! ( __private in object ) ) {
		return object;
	}

	return lockedData.get( object[ __private ] );
}

const lockedData = new WeakMap();

/**
 * Used by lock() and unlock() to uniquely identify the private data
 * related to a containing object.
 */
const __private = Symbol( 'Private API ID' );

// Unit tests utilities:

/**
 * Private function to allow the unit tests to allow
 * a mock module to access the private APIs.
 *
 * @param {string} name The name of the module.
 */
export function allowCoreModule( name ) {
	CORE_MODULES_USING_PRIVATE_APIS.push( name );
}

/**
 * Private function to allow the unit tests to set
 * a custom list of allowed modules.
 */
export function resetAllowedCoreModules() {
	while ( CORE_MODULES_USING_PRIVATE_APIS.length ) {
		CORE_MODULES_USING_PRIVATE_APIS.pop();
	}
}
/**
 * Private function to allow the unit tests to reset
 * the list of registered private apis.
 */
export function resetRegisteredPrivateApis() {
	while ( registeredPrivateApis.length ) {
		registeredPrivateApis.pop();
	}
}
