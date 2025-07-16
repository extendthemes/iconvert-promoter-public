import { BlockIcons } from '@kubio/icons';
import edit from './edit';
import save from './save';
import { __ } from '@wordpress/i18n';
import { elementsByName } from './elements';

import metadata from './block.json';

import { extendBlockMeta } from '@kubio/colibri';
import { set } from 'lodash';
import NamesOfBlocks from '../blocks-list';

const settings = extendBlockMeta(metadata, {
	title: __('Column', 'kubio'),
	icon: BlockIcons.Columns,
	keywords: [],
	apiVersion: 2,
	parent: [NamesOfBlocks.ROW],
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
	},
	edit,
	save,
	variationsFilter: (variation) => {
		// make default column 50%
		if (variation?.isDefault) {
			set(
				variation,
				'attributes.kubio._style.descendants.container.columnWidth',
				{
					type: 'custom',
					custom: { value: 50, unit: '%' },
				}
			);
		}
		return variation;
	},
});

export { metadata, settings };
