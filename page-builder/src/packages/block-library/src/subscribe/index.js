import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import { InnerBlocks, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import { getContextPropDefaultValue } from './config';
import edit from './edit';
import { elementsByName } from './elements';
import defaultVariation from './default-variation';
import { v1 } from './deprecated/v1';
import './inspector-state-selector-hook';

const contextPropsDefault = getContextPropDefaultValue();

const settings = extendBlockMeta( metadata, {
	title: __( 'Subscribe Form', 'iconvert-promoter' ),
	icon: BlockIcons.Subscribe,
	keywords: [
		__( 'subscribe', 'iconvert-promoter' ),
		__( 'form', 'iconvert-promoter' ),
		__( 'mail', 'iconvert-promoter' ),
	],
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
	save: () => <InnerBlocks.Content />,
	variations: [ defaultVariation ],
	contextPropsDefault,
	deprecated: [ v1 ],
} );

export { metadata, settings };
