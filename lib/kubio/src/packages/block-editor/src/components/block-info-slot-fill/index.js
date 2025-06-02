/**
 * WordPress dependencies
 */
import {
	createSlotFill,
	privateApis as componentsPrivateApis,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import {
	useBlockEditContext,
	mayDisplayControlsKey,
} from '../block-edit/context';

const { createPrivateSlotFill } = unlock( componentsPrivateApis || {} );
//Modified in kubio
let SlotFill;

if ( createPrivateSlotFill ) {
	//for 6.3 onwards
	SlotFill = createPrivateSlotFill( 'BlockInformation' );
} else {
	//backward compatability for < 6.3 as privateApi does not exist
	SlotFill = createSlotFill( 'BlockInformation' );
}
const { Fill, Slot } = SlotFill;

const BlockInfo = ( props ) => {
	const context = useBlockEditContext();
	if ( ! context[ mayDisplayControlsKey ] ) {
		return null;
	}
	return <Fill { ...props } />;
};
BlockInfo.Slot = ( props ) => <Slot { ...props } />;

export default BlockInfo;
