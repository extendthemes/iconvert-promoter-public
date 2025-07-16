import edit from './edit';
import save from './save';
import { elementsByName } from './elements';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import NamesOfBlocks from '../blocks-list';
const settings = extendBlockMeta(metadata, {
	title: __('Link Group', 'kubio'),
	description: __(
		'Add multiple stylish links to your content. Adjust them while in a normal or hovered state.',
		'kubio'
	),
	icon: BlockIcons.Link,
	keywords: [
		__('link', 'kubio'),
		__('links', 'kubio'),
		__('anchor', 'kubio'),
	],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
	},
	//colibriMapper: {},
	edit,
	save,
	variations: [
		{
			name: 'default',
			title: __('Link Group', 'kubio'),
			icon: BlockIcons.Link,
			innerBlocks: [[NamesOfBlocks.LINK, {}, []]],
			isDefault: true,
		},
	],
	innerBlocksDisableInBetweenInserter: true,
});

export { metadata, settings };
