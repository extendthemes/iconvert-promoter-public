import { extendBlockMeta } from '@kubio/colibri';
import { InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { blockIcon } from '../../block-icon';
import metadata from './block.json';
import Component from './component';
import { elementsByName } from './elements';
import { Inspector } from './inspector';

const edit = ( props ) => {
	return (
		<>
			<Inspector { ...props } />
			<Component { ...props } />
		</>
	);
};

const settings = extendBlockMeta( metadata, {
	title: __( 'Yes/No - Content', 'iconvert-promoter' ),
	__experimentalLabel: ( { action } ) => {
		if ( action === 'yes' ) {
			return __( 'Yes - Content', 'iconvert-promoter' );
		}

		if ( action === 'no' ) {
			return __( 'No - Content', 'iconvert-promoter' );
		}

		return __( 'Yes/No - Content', 'iconvert-promoter' );
	},
	icon: blockIcon,
	keywords: [
		__( 'yes no', 'iconvert-promoter' ),
		__( 'yes', 'iconvert-promoter' ),
		__( 'no', 'iconvert-promoter' ),
	],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
} );

export { metadata, settings };
