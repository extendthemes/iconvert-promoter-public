import edit from './edit';
import metadata from './block.json';
import { extendBlockMeta } from '@kubio/colibri';
import { elementsByName } from './elements';
import { BlockIcons } from '@kubio/icons';
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const settings = extendBlockMeta(metadata, {
	title: __('Icon list item', 'kubio'),
	icon: BlockIcons.IconList,
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
		lightBlockWrapper: true,
	},
	edit,
	save: ({ attributes }) => <RichText.Content value={attributes.text} />,
});

export { metadata, settings };
