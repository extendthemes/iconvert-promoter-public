import edit from './edit';
import { elementsByName } from './elements';
import save from './save';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import './filters';

const settings = extendBlockMeta( metadata, {
	title: __( 'Close Popup Icon', 'iconvert-promoter' ),
	icon: BlockIcons.Button,
	keywords: [],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		multiple: false,
		reusable: false,
		html: false,
		inserter: true,
	},
	edit,
	save,
	displayAdvancedPanelFor: ( clientId, select ) => {
		const { getBlocks } = select( 'core/block-editor' );
		const innerBlock = getBlocks( clientId )[ 0 ];
		return innerBlock.clientId;
	},
} );

export { metadata, settings };
