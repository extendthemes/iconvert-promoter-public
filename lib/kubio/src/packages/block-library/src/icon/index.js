import edit from './edit';
import { elementsByName, ElementsEnum } from './elements';
import metadata from './block.json';
import { extendBlockMeta } from '@kubio/colibri';
import { BlockIcons } from '@kubio/icons';
import { __ } from '@wordpress/i18n';
import { variationsFilter } from './variations-filter';
import IconSection from './inspector/style/icon';
import BackgroundAndBorderSection from './inspector/style/background-and-border';

const settings = extendBlockMeta(metadata, {
	title: __('Icon', 'kubio'),
	keywords: [__('icon', 'kubio'), __('symbol', 'kubio')],
	icon: BlockIcons.Icon,
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
	variationsFilter,
});

const Components = {
	style: {
		IconSection,
		BackgroundAndBorderSection,
	},
};

export { metadata, settings, Components, ElementsEnum };
