import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import { __ } from '@wordpress/i18n';
import { merge } from 'lodash';
import { onBlockVariationRegistered } from '@kubio/core';
import NamesOfBlocks from '../blocks-list';
import { elementsByName } from './elements';
import edit from './edit';
import { metadata } from './metadata';
import { RichText } from '@wordpress/block-editor';
import { variations } from './variations';

const settings = extendBlockMeta( metadata, {
	title: __( 'Button', 'iconvert-promoter' ),
	keywords: [ __( 'button', 'iconvert-promoter' ) ],
	icon: BlockIcons.ReadMore,
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
	},
	variations,
	edit,
	save: ( { attributes } ) => <RichText.Content value={ attributes.text } />,
} );

export { metadata, settings };
