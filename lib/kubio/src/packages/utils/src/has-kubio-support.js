import { hasBlockSupport } from '@wordpress/blocks';

export const hasKubioSupport = ( name ) => {
	return hasBlockSupport( name, 'kubio' );
};
