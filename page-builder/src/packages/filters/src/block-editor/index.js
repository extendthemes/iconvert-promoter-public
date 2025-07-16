import { addFilter } from '@wordpress/hooks';

addFilter( 'kubio.block-editor.showGutentagSectionsTab', 'kubio-child', () => {
	return false;
} );

addFilter( 'kubio.block-editor.showPatterns', 'kubio-child', () => {
	return false;
} );
