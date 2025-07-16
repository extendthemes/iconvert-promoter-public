import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import { getContextPropDefaultValue } from './config';
import edit from './edit';
import { elementsByName } from './elements';
import save from './save';

const contextPropsDefault = getContextPropDefaultValue();

const settings = extendBlockMeta( metadata, {
	title: __( 'Promo Popup', 'iconvert-promoter' ),
	icon: BlockIcons.Hero,
	keywords: [
		__( 'popup', 'iconvert-promoter' ),
		__( 'promo', 'iconvert-promoter' ),
	],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: true,
		html: false,
		multiple: false,
	},
	edit,
	save,
	contextPropsDefault,
} );

export { metadata, settings };
