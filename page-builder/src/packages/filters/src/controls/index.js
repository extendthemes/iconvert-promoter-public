import { addFilter } from '@wordpress/hooks';

//removes front page suggestions
addFilter(
	'kubio.controls.layoutPicker.showFrontPageSuggestions',
	'kubio-child',
	() => {
		return false;
	}
);
