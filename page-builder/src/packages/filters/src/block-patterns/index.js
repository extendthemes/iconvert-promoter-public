import {
	replaceKubioBlockName,
	replaceKubioObjectBlockPrefix,
} from '@cspromo/utils';
import { addFilter } from '@wordpress/hooks';

addFilter( 'kubio.register-variation', 'kubio-child', ( block ) => {
	return replaceKubioObjectBlockPrefix( block );
} );
addFilter(
	'kubio.register-variation.blockName',
	'kubio-child',
	( blockName ) => {
		return replaceKubioBlockName( blockName );
	}
);
