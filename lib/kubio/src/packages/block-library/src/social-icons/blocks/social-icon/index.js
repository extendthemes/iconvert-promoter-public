import edit from './edit';
import { elementsByName } from './elements';

import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';

const settings = extendBlockMeta(metadata, {
	title: __('Social Icon', 'kubio'),
	icon: BlockIcons.SocialButtons,
	keywords: [],
	parent: ['kubio/social-icons'],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,

		inserter: true,
	},
	edit,
});

export { metadata, settings };
