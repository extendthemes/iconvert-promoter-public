import edit from './edit';
import { elementsByName } from './elements';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import { RichText } from '@wordpress/block-editor';

const settings = extendBlockMeta(metadata, {
	title: __('Image', 'kubio'),
	description: __(
		'Add images with styled borders and shadows. You can add frames and effects to them for a more appealing look.',
		'kubio'
	),
	icon: BlockIcons.Image,
	keywords: [
		__('img', 'kubio'),
		__('image', 'kubio'),
		__('photo', 'kubio'),
		__('picture', 'kubio'),
	],
	attributes: {},
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
			isGutentagQuickInsertDefault: true,
		},
		reusable: false,
		html: false,
	},
	__experimentalLabel(attributes, { context }) {
		if (context === 'accessibility') {
			const { caption, alt, url } = attributes;

			if (!url) {
				return __('Empty', 'kubio');
			}

			if (!alt) {
				return caption || '';
			}

			// This is intended to be read by a screen reader.
			// A period simply means a pause, no need to translate it.
			return alt + (caption ? '. ' + caption : '');
		}
	},
	edit,
	save: ({ attributes }) => <RichText.Content value={attributes.caption} />,
});

export { metadata, settings };
