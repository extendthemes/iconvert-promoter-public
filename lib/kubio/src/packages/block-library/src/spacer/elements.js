import { StylesEnum, StatesEnum } from '@kubio/style-manager';

import metadata from './block.json';
import { __ } from '@wordpress/i18n';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ElementsEnum.CONTAINER]: {
		label: __('Container', 'kubio'),
		supports: {
			styles: [StylesEnum.RESPONSIVE],
			states: [StatesEnum.NORMAL],
		},
	},
};

export { ElementsEnum, elementsByName };
