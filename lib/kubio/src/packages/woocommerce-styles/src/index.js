import { registerSubSidebarArea } from '@kubio/editor';
import { select } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { WooCommerceStyleSidebarArea } from './woocommerce-style-sidebar-area';

import styleTypes from './style-types.json';

registerSubSidebarArea({
	name: 'kubio-woocommerce',
	title: __('WooCommerce style', 'kubio'),
	parent: 'document',
	render: () => <WooCommerceStyleSidebarArea />,
});

addFilter(
	'kubio.showRenderedPostContent',
	'kubio.showRenderedPostContent.WooCommercePage',
	(showRenderedContnt, postType, postId) => {
		const ids = select('core/block-editor').getSettings()
			?.kubioBasicWooCommerce?.pagesIds;

		const wooCommercePagesIds = Object.values(ids || {});
		if (wooCommercePagesIds.indexOf(parseInt(postId)) !== -1) {
			return true;
		}

		return showRenderedContnt;
	}
);

addFilter('kubio.style-types', 'kubio.style-types.WooCommerce', (types) => {
	return {
		...types,
		definitions: {
			...types.definitions,
			globalStyle: {
				...types.definitions.globalStyle,

				elementsEnum: {
					...types.definitions.globalStyle.elementsEnum,
					...styleTypes.elementsEnum,
				},

				elementsByName: {
					...types.definitions.globalStyle.elementsByName,
					...styleTypes.elementsByName,
				},
			},
		},
	};
});
