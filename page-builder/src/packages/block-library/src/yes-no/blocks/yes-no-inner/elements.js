import { __ } from '@wordpress/i18n';
import metadata from './block.json';

const ElementsEnum = metadata.supports.kubio.elementsEnum;

const elementsByName = {
	[ ElementsEnum.CONTAINER ]: {
		label: __( 'Container', 'iconvert-promoter' ),
		supports: {
			styles: [],
			states: [ 'normal' ],
		},
	},

	[ ElementsEnum.VSPACE ]: {
		internal: true,
	},
};

export { elementsByName, ElementsEnum };
