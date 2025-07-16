import edit from './edit';
import save from './save';
import metadata from './block.json';
import { elementsByName } from './elements';
import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { defaultAssetURL } from '@kubio/utils';

const metadataWithDefaults = _.cloneDeep( metadata );
_.set(
	metadataWithDefaults,
	'attributes.internalUrl.default',
	''
);

const settings = extendBlockMeta( metadataWithDefaults, {
	title: __( 'Video', 'kubio' ),
	description: __(
		'Add self-hosted, Youtube, or Vimeo videos. Adjust their background, spacing, aspect ratios, and shadows.',
		'kubio'
	),
	icon: BlockIcons.Video,
	keywords: [
		__( 'movie', 'kubio' ),
		__( 'video', 'kubio' ),
		__( 'vimeo', 'kubio' ),
		__( 'youtube', 'kubio' ),
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
	save,
} );

export { metadataWithDefaults as metadata, settings };
