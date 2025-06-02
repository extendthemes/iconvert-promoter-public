import { castArray, map } from 'lodash';
import { PRODUCT_NAME } from '@kubio/constants';

const prefixClassNames = ( name ) => {
	const names = castArray( name );
	return map( names, ( name_ ) => PRODUCT_NAME + '-' + name_ );
};

export { prefixClassNames };
