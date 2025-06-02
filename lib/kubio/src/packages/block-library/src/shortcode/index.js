import edit from './edit';
import { elementsByName } from './elements';
import metadata from './block.json';
import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import { __ } from '@wordpress/i18n';

const settings = extendBlockMeta(metadata, {
	title: __('Shortcode', 'kubio'),
	description: __(
		'Use shortcodes to insert various custom-made forms, galleries, tables, and more, depending on the plugins you use.',
		'kubio'
	),
	keywords: [__('shortcode', 'kubio')],
	icon: BlockIcons.Shortcode,
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
	},
	edit,
});

export { metadata, settings };
