import edit from './edit';
import { elementsByName } from './elements';
import metadata from './block.json';
import { BlockIcons } from '@kubio/icons';
import { extendBlockMeta } from '@kubio/colibri';
import { __ } from '@wordpress/i18n';
import { variationsFilter } from './variations-filter';

const settings = extendBlockMeta(metadata, {
	title: __('Divider', 'kubio'),
	icon: BlockIcons.Divider,
	keywords: [
		__('separator', 'kubio'),
		__('hr', 'kubio'),
		__('divider', 'kubio'),
		__('line', 'kubio'),
	],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
	},
	edit,
	variationsFilter,
});

export { metadata, settings };
