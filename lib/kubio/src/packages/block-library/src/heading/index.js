import { BlockIcons } from '@kubio/icons';
import edit from './edit';
import { elementsByName } from './elements';
import metadata from './block.json';
import { extendBlockMeta } from '@kubio/colibri';
import { example } from './example';
import { __ } from '@wordpress/i18n';
import { getHeadingVariations } from './variations';
import { RichText } from '@wordpress/block-editor';

const settings = extendBlockMeta(metadata, {
	title: __('Heading', 'kubio'),
	keywords: [
		__('title', 'kubio'),
		__('subtitle', 'kubio'),
		__('headline', 'kubio'),
	],
	icon: BlockIcons.Heading,
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
			isGutentagQuickInsertDefault: true,
		},
		reusable: false,
		html: false,
	},
	edit,
	example,

	merge(attributes, attributesToMerge) {
		return {
			content:
				(attributes.content || '') + (attributesToMerge.content || ''),
		};
	},

	variations: getHeadingVariations(),

	save: ({ attributes }) => <RichText.Content value={attributes.content} />,
});

export { metadata, settings };
