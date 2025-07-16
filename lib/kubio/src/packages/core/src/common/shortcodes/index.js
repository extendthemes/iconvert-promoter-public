import { string as wordpressShortcodeToString } from '@wordpress/shortcode';
import _ from 'lodash';
function encodeShortcodeData( data ) {
	// eslint-disable-next-line no-undef
	return btoa( encodeURIComponent( data ) );
}

function shortcodeToString( options, mergeDefaults = true ) {
	if ( ! mergeDefaults ) {
		return wordpressShortcodeToString( options );
	}

	const defaultOptions = {
		attrs: {},
	};

	options = window.structuredClone( options );

	const { named } = options.attrs;
	delete options.attrs.named;

	options.attrs = {
		...options.attrs,
		...named,
	};

	const mergedOptions = _.merge( {}, defaultOptions, options );

	return wordpressShortcodeToString( mergedOptions );
}

export { encodeShortcodeData, shortcodeToString };
