import { extendBlockMeta } from '@kubio/colibri';
import { InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { blockIcon } from './block-icon';
import metadata from './block.json';
import edit from './edit';
import { elementsByName } from './elements';
import defaultVariation from './variations/default';
import './inspector-state-selector-hook';

const settings = extendBlockMeta( metadata, {
	title: __( 'Yes/No', 'iconvert-promoter' ),
	icon: blockIcon,
	keywords: [ __( 'yes no', 'iconvert-promoter' ) ],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
		multiple: false,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
	variations: [ defaultVariation ],
} );

export { metadata, settings };
