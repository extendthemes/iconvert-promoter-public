import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import { elementsByName } from './elements';

import { variationsFilter } from './variations-filter';

let blockEdit = () => <></>;
let blockSave = () => null;


const settings = extendBlockMeta( metadata, {
	title: __( 'Countdown', 'iconvert-promoter' ),
	icon: BlockIcons.Countdown,
	keywords: [ __( 'countdown', 'iconvert-promoter' ) ],
	isPro: true,
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
		multiple: false,
	},

	variationsFilter,
	innerBlocksDisableInBetweenInserter: true,

	edit: blockEdit,
	save: blockSave,
} );

export { metadata, settings };
