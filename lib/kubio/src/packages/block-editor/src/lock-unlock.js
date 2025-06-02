/**
 * WordPress dependencies
 */
import { requiredConsent } from './private-api-fallback-implementation';
import { identity } from 'lodash';

// import { __dangerousOptInToUnstableAPIsOnlyForCoreModules as fallback } from './private-api-fallback-implementation';

const fallback = () => ( {
	lock: identity,
	unlock: identity,
} );

// use in this form to ensure backwad compatibility
const { __dangerousOptInToUnstableAPIsOnlyForCoreModules = fallback } =
	top.wp?.experiments || top.wp?.privateApis || {};

export const { lock, unlock } =
	__dangerousOptInToUnstableAPIsOnlyForCoreModules(
		requiredConsent,
		'@wordpress/block-editor'
	);
