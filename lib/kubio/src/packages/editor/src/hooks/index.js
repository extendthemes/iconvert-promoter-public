import './components';
import { addFilter } from '@wordpress/hooks';
import { withInspectorControlsAdvancedPanel } from '@kubio/advanced-panel';

addFilter(
	'editor.BlockEdit',
	'kubio/advancedPanel',
	withInspectorControlsAdvancedPanel
);
