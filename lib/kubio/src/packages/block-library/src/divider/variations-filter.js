import { __ } from '@wordpress/i18n';

const blockDescription = __(
	'Use dividers to separate website sections in a creative way. Customize their color, line thickness, and more.',
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
