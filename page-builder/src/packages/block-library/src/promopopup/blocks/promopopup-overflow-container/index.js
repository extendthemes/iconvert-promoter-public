import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import edit from './edit';
import { elementsByName } from './elements';
import save from './save';

const settings = extendBlockMeta( metadata, {
	title: __( 'Scrolling container', 'iconvert-promoter' ),
	icon: BlockIcons.Offscreen,
	keywords: [],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
		inserter: true,
	},
	edit,
	save,
} );

export { metadata, settings };
