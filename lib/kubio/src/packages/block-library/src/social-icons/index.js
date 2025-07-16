import edit from './edit';
import save from './save';
import { elementsByName } from './elements';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import { variationsFilter } from './variations-filter';

const settings = extendBlockMeta( metadata, {
	title: __( 'Social Icons', 'kubio' ),
	icon: BlockIcons.SocialButtons,
	keywords: [
		__( 'social icons', 'kubio' ),
		__( 'icons', 'kubio' ),
		__( 'social', 'kubio' ),
		__( 'facebook', 'kubio' ),
		__( 'twitter', 'kubio' ),
		__( 'instagram', 'kubio' ),
		__( 'linkedin', 'kubio' ),
		__( 'youtube', 'kubio' ),
		__( 'snapchat', 'kubio' ),
		__( 'tik tok', 'kubio' ),
	],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
			unlinkStyleIncludesChildren: true,
		},
		reusable: false,
		html: false,
	},
	edit,
	save,
	innerBlocksDisableInBetweenInserter: true,
	variationsFilter,
	variations: [
		variationsFilter( {
			name: 'cspromo/social-icons',
			title: __( 'Social Icons', 'kubio' ),
			isDefault: true,
		} ),
	],
} );

export { metadata, settings };
