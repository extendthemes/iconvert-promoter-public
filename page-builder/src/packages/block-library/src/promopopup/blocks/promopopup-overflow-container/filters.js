import { addFilter } from '@wordpress/hooks';
import _ from 'lodash';

import NamesOfBlocks from '../../../blocks-list';

addFilter(
	'kubio.get-linked-block',
	'kubio.get-linked-block-' + NamesOfBlocks.PROMOPOPUPOVERFLOW,
	( currentProps, hooks = {} ) => {
		if ( currentProps?.name !== NamesOfBlocks.PROMOPOPUPOVERFLOW ) {
			return currentProps;
		}
		const { getBlockOrder = _.noop, getBlock = _.noop } = hooks;
		const childId = getBlockOrder( currentProps.clientId );
		if ( childId.length > 0 ) {
			const childBlock = getBlock( childId[ 0 ] );
			if ( childBlock ) {
				return {
					name: childBlock.name,
					clientId: childBlock.clientId,
					attributes: childBlock.attributes,
				};
			}
		}

		return currentProps;
	}
);
