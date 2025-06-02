import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import edit from './edit';
import { BlockIcons } from '@kubio/icons';
import { extendBlockMeta } from '@kubio/colibri';

const { name } = metadata;
export { metadata, name };

export const settings = extendBlockMeta(metadata, {
	title: __('Content', 'kubio'),
	icon: BlockIcons.PostContent,
	supports: {
		anchor: false,
		reusable: false,
		html: false,
		multiple: false,
	},
	edit,
});
