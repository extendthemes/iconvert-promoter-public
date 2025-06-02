import { isObject, transform } from 'lodash';
import isEqual from 'react-fast-compare';

function changes( object, base ) {
	return transform( object, function ( result, value, key ) {
		if ( ! isEqual( value, base[ key ] ) ) {
			result[ key ] =
				isObject( value ) && isObject( base[ key ] )
					? changes( value, base[ key ] )
					: value;
		}
	} );
}

const differenceObj = ( object, base ) => {
	return changes( object, base );
};

export { differenceObj };
