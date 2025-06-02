import _ from 'lodash';

const LodashBasic = _;

LodashBasic.compactWithExceptions = ( array, exceptions = [] ) => {
	let index = -1;
	let resIndex = 0;

	const length = array === null ? 0 : array.length;
	const result = [];

	while ( ++index < length ) {
		const value = array[ index ];
		if ( value || exceptions.includes( value ) ) {
			result[ resIndex++ ] = value;
		}
	}
	return result;
};

export { LodashBasic };
