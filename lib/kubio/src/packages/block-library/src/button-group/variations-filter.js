import { __ } from '@wordpress/i18n';

const blockDescription = __(
	'Create enticing calls to action. Fine-tune them until you get the right colors, contrast, and spacing.',
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
