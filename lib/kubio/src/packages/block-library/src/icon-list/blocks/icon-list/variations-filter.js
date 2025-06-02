import { __ } from '@wordpress/i18n';

const blockDescription = __(
	'Create beautiful lists of items and their icons. Style their spacing, borders, shadows, color, and typography.',
	'kubio'
);

const variationsFilter = (variation) => {
	if (variation?.isDefault) {
		return {
			...variation,
			description: blockDescription,
		};
	}

	return variation;
};

export { variationsFilter };
