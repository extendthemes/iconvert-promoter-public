import { BlockIcons } from '@kubio/icons';
import { __ } from '@wordpress/i18n';
import { extendBlockMeta } from '@kubio/colibri';
import edit from './edit';
import save from './save';
import { elementsByName } from './elements';
import metadata from './block.json';
import { variationsFilter } from './variations-filter';
import {ComponentParts} from './component';

const settings = extendBlockMeta(metadata, {
	title: __('Buttons', 'kubio'),
	icon: BlockIcons.Button,
	keywords: [
		__('button', 'kubio'),
		__('cta', 'kubio'),
		__('call to action', 'kubio'),
	],
	apiVersion: 2,
	supports: { 
		kubio: {
			elementsByName,
			isGutentagQuickInsertDefault: true,
		},
		reusable: false,
		html: false,
	},
	edit,
	save,
	innerBlocksDisableInBetweenInserter: true,
	variationsFilter,
	ComponentParts
});
const Components = { ComponentParts };
export { metadata, settings, Components };