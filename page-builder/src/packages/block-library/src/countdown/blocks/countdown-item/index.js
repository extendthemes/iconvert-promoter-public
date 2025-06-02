import { elementsByName } from './elements';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';

let blockEdit = () => <></>;
let blockSave = () => null;


const settings = extendBlockMeta( metadata, {
	title: __( 'Countdown item', 'iconvert-promoter' ),
	icon: BlockIcons.Countdown,
	keywords: [],
	parent: [ 'cspromo/countdown' ],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
		// inserter: true,
		lightBlockWrapper: true,
	},
	edit: blockEdit,
	save: blockSave,
	displayAdvancedPanelFor: ( clientId, select ) => {
		const { getBlocks } = select( 'core/block-editor' );
		const innerBlock = getBlocks( clientId );
		return innerBlock.clientId;
	},
} );

export { metadata, settings };
