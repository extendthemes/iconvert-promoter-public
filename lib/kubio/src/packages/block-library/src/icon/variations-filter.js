import { __ } from '@wordpress/i18n';

const blockDescription = __(
	'Add attractive icons to web pages. 100+ free icons are available from the most popular libraries out there. Fully customizable.',
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
