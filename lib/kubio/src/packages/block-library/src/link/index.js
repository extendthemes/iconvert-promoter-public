import NamesOfBlocks from '../blocks-list';
import edit from './edit';
import { elementsByName } from './elements';

import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import { RichText } from '@wordpress/block-editor';

const { LINK_GROUP } = NamesOfBlocks;

const settings = extendBlockMeta(metadata, {
	title: __('Link', 'kubio'),
	icon: BlockIcons.Link,
	keywords: [],
	parent: [LINK_GROUP],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
	},
	edit,

	save: ({ attributes }) => <RichText.Content value={attributes.text} />,
});

export { metadata, settings };
