const GUTENTAG_CATEGORIES_PREFIXES = [ 'kubio', 'cspromo' ];

const isGutentagPrefixed = ( toTest ) => {
	if ( ! toTest ) {
		return false;
	}

	if ( GUTENTAG_CATEGORIES_PREFIXES.indexOf( toTest ) !== -1 ) {
		return true;
	}

	for ( let i = 0; i < GUTENTAG_CATEGORIES_PREFIXES.length; i++ ) {
		const prefix = GUTENTAG_CATEGORIES_PREFIXES[ i ];

		if (
			toTest.indexOf( `${ prefix }-` ) === 0 ||
			toTest.indexOf( `${ prefix }_` ) === 0 ||
			toTest.indexOf( `${ prefix }/` ) === 0
		) {
			return true;
		}
	}

	return false;
};

export { isGutentagPrefixed };
