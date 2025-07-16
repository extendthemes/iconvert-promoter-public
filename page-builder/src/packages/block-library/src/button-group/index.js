import { BlockIcons } from '@kubio/icons';
import { __ } from '@wordpress/i18n';
import { extendBlockMeta } from '@kubio/colibri';
import { metadata } from './metadata';
import { variationsFilter } from './variations-filter';
import NamesOfBlocks from '../blocks-list';
import edit from './edit';
import save from './save';
import { elementsByName } from './elements';
import { defaultVariation } from '../button/variations';

const buttonAttributes = defaultVariation.attributes;

const settings = extendBlockMeta( metadata, {
	title: __( 'Buttons', 'iconvert-promoter' ),
	icon: BlockIcons.Button,
	keywords: [
		__( 'button', 'iconvert-promoter' ),
		__( 'buttons', 'iconvert-promoter' ),
		__( 'group', 'iconvert-promoter' ),
	],
	supports: {
		kubio: {
			elementsByName,
			isGutentagQuickInsertDefault: true,
		},
		reusable: false,
		html: false,
	},
	variations: [
		{
			name: 'default',
			title: __( 'Buttons', 'iconvert-promoter' ),
			icon: BlockIcons.Button,
			innerBlocks: [
				[ NamesOfBlocks.BUTTON_EXTENDED, buttonAttributes, [] ],
			],
			isDefault: true,
		},
	],
	edit,
	save,
	innerBlocksDisableInBetweenInserter: true,
	variationsFilter,
} );

export { metadata, settings };
