/**
 * WordPress dependencies
 */
import {
	__experimentalUseSlot as useSlot,
	__experimentalUseSlotFills as useSlotFills,
} from '@wordpress/components';

import { isFunction } from 'lodash';

const useKubioSlotHasFills = ( slotName ) => {
	const slot = useSlot( slotName );

	let hasFills = !! slot.fills?.length;

	if ( isFunction( useSlotFills ) ) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		hasFills = !! useSlotFills( slotName )?.length;
	}

	return hasFills;
};

export { useKubioSlotHasFills };
