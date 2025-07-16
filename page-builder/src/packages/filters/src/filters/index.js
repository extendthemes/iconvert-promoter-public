import { addFilter } from '@wordpress/hooks';

addFilter( 'kubio.block-editor.showAdvancedPanel', 'kubio-child', () => {
	return false;
} );

addFilter( 'kubio.style-controls.showCustomCssMenu', 'kubio-child', () => {
	return false;
} );

addFilter( 'kubio.style-controls.showEditThemeDefaults', 'kubio-child', () => {
	return false;
} );
