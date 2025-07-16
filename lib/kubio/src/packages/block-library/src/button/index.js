import NamesOfBlocks from '../blocks-list';
import { BlockIcons } from '@kubio/icons';
import edit, {ButtonProperties, Style} from './edit';
import { elementsByName } from './elements';
import './filters';
import metadata from './block.json';
import {ComponentParts} from './component';
const { BUTTON_GROUP, VIDEO, DOWN_ARROW } = NamesOfBlocks;

import { __ } from '@wordpress/i18n';
import { extendBlockMeta } from '@kubio/colibri';
import { RichText } from '@wordpress/block-editor';
import { ButtonSize } from './inspector/content';
import { buttonSizesDefaults } from './inspector/content/button-size/sizes';
import { buttonSize, buttonSizeOptions } from './inspector/content/button-size/config';
import { ButtonSizeBase } from './inspector/content/button-size/component';
import { buttonWidth } from './inspector/content/button-width/config';

const settings = extendBlockMeta(metadata, {
	title: __('Button', 'kubio'),
	icon: BlockIcons.Button,
	keywords: [
		__('button', 'kubio'),
		__('cta', 'kubio'),
		__('call to action', 'kubio'),
	],
	parent: [BUTTON_GROUP, VIDEO, DOWN_ARROW],
	apiVersion: 2,
	supports: {
		kubio: {
			elementsByName,
		},
		reusable: false,
		html: false,
	},

	edit,

	save: ({ attributes }) => <RichText.Content value={attributes.text} />,
});



const Components = {
	edit,
	ComponentParts,
	Style,
	ButtonProperties,
	ButtonSize,
	ButtonSizeBase,
	buttonSizesDefaults,
	buttonSizeConfig: buttonSize,
	buttonWidthConfig: buttonWidth,
};

export { metadata, settings, elementsByName, Components };
