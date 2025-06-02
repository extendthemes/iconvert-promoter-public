import { __ } from '@wordpress/i18n';
import { get, isString } from 'lodash';
import { getKubioUrlWithRestPrefix } from '@kubio/constants';

const gutentagMenuEntity = {
	name: 'menu',
	kind: 'kubio',
	baseURL: getKubioUrlWithRestPrefix('/kubio/v1/menu'),
	plural: 'menus',
	label: __('Menu', 'kubio'),
	mergedEdits: { meta: true },
	getTitle: (record) => {
		if (isString(record?.data)) {
			record = JSON.parse(record.data);
		}
		return get(record, 'menu.name', __('Menu Title', 'kubio'));
	},
};

const MENU_ITEM_BLOCK = 'kubio/menu-item';

export { gutentagMenuEntity, MENU_ITEM_BLOCK };
