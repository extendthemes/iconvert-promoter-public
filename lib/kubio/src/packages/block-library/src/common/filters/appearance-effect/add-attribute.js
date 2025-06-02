import { addFilter } from '@wordpress/hooks';

export function addAttribute(settings) {
	// Allow blocks to specify their own attribute definition with default values if needed.

	if (settings?.name?.includes('kubio')) {
		settings.attributes = {
			...settings.attributes,
			appearanceEffect: {
				type: 'string',
			},
		};
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'core/appearance-effect/attribute',
	addAttribute
);
