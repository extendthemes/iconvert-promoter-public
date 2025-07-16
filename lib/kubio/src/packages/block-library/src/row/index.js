import { BlockIcons } from '@kubio/icons';
import edit from './edit';
import save from './save';
import { __ } from '@wordpress/i18n';
import { elementsByName } from './elements';
import { RowVariations } from './variations';

import metadata from './block.json';
import { extendBlockMeta } from '@kubio/colibri';

const settings = extendBlockMeta(metadata, {
	title: __('Columns', 'kubio'),
	icon: BlockIcons.Columns,
	keywords: [
		__('columns', 'kubio'),
		__('row', 'kubio'),
		__('column', 'kubio'),
	],
	providesContext: {
		'kubio/parentKubio': 'kubio',
	},
	apiVersion: 2,
	variations: RowVariations,
	supports: {
		kubio: {
			elementsByName,
			isGutentagQuickInsertDefault: true,
		},
		reusable: false,
		html: false,
	},
	edit,
	save,
	innerBlocksDisableInBetweenInserter: true,
});

export { metadata, settings };
