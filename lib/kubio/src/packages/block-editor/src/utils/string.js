import { paramCase } from 'change-case';

export function kebabCase( str ) {
	let input = str?.toString?.() ?? '';

	// See https://github.com/lodash/lodash/blob/b185fcee26b2133bd071f4aaca14b455c2ed1008/lodash.js#L4970
	input = input.replace( /['\u2019]/, '' );

	return paramCase( input, {
		splitRegexp: [
			/(?!(?:1ST|2ND|3RD|[4-9]TH)(?![a-z]))([a-z0-9])([A-Z])/g, // fooBar => foo-bar, 3Bar => 3-bar
			/(?!(?:1st|2nd|3rd|[4-9]th)(?![a-z]))([0-9])([a-z])/g, // 3bar => 3-bar
			/([A-Za-z])([0-9])/g, // Foo3 => foo-3, foo3 => foo-3
			/([A-Z])([A-Z][a-z])/g, // FOOBar => foo-bar
		],
	} );
}
