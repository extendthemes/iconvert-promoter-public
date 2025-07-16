import { addFilter } from '@wordpress/hooks';

addFilter( 'kubio.constants.kubioPrefix', 'kubio-child', () => {
	return 'cspromo';
} );
