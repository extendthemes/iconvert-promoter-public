import edit from './edit';

import metadata from './block.json';
import { BlockIcons } from '@kubio/icons';
import { extendBlockMeta } from '@kubio/colibri';
import { elementsByName } from './elements';
import { __ } from '@wordpress/i18n';

const settings = extendBlockMeta(metadata, {
	title: __('Spacer', 'kubio'),
	description: __(
		'You can use the spacer block instead of margins and paddings, when you want to add space between content sections.',
		'kubio'
	),
	keywords: [__('space', 'kubio')],
	icon: BlockIcons.Spacer,
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
