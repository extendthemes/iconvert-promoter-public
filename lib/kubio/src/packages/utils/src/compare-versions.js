const compareVersions = function ( v1, comparator, v2 ) {
	comparator = comparator === '=' ? '==' : comparator;
	if (
		[ '==', '===', '<', '<=', '>', '>=', '!=', '!==' ].indexOf(
			comparator
		) === -1
	) {
		throw new Error( 'Invalid comparator. ' + comparator );
	}
	const v1parts = v1.split( '.' ),
		v2parts = v2.split( '.' );
	const maxLen = Math.max( v1parts.length, v2parts.length );
	let part1, part2;
	let cmp = 0;
	for ( let i = 0; i < maxLen && ! cmp; i++ ) {
		part1 = parseInt( v1parts[ i ], 10 ) || 0;
		part2 = parseInt( v2parts[ i ], 10 ) || 0;
		if ( part1 < part2 ) cmp = 1;
		if ( part1 > part2 ) cmp = -1;
	}
	// eslint-disable-next-line no-eval
	return eval( '0' + comparator + cmp );
};

export { compareVersions };
