import edit from './edit';
import { elementsByName } from './elements';
import metadata from './block.json';
import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

const settings = extendBlockMeta(metadata, {
	title: __('Paragraph', 'kubio'),
	keywords: [__('text', 'kubio'), __('paragraph', 'kubio')],
	icon: BlockIcons.Paragraph,
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
	merge(attributes, attributesToMerge) {
		return {
			content:
				(attributes.content || '') + (attributesToMerge.content || ''),
		};
	},
	save: ({ attributes }) => <RichText.Content value={attributes.content} />,
	// moved default content to a variations. This allows an empty text to be added when enter is pressed at the end of current text block
	variations: [
		{
			name: 'default',
			isDefault: true,
			title: __('Paragraph', 'kubio'),
			description: __(
				'Add text that can be stylized your way: from font-family, font-weight, and size, to color, borders, and shadows.',
				'kubio'
			),
			attributes: {
				content:
					'Lorem ipsum dolor sit amet, at mei dolore tritani repudiandae. In his nemore temporibus consequuntur, vim ad prima vivendum consetetur. Viderer feugiat at pro, mea aperiam',
			},
		},
	],
});

export { metadata, settings };
