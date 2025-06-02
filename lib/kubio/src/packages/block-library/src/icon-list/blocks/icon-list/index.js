import edit from './edit';
import save from './save';
import { elementsByName } from './elements';
import metadata from './block.json';
import { variationsFilter } from './variations-filter';
import { __ } from '@wordpress/i18n';
import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';

const settings = extendBlockMeta(metadata, {
	title: __('Icon List', 'kubio'),
	icon: BlockIcons.IconList,
	keywords: [__('icon', 'kubio'), __('list', 'kubio')],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
	},
	edit,
	save,
	variationsFilter,
	innerBlocksDisableInBetweenInserter: true,
});

export { metadata, settings };
