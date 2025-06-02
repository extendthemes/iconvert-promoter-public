/**
 * WordPress dependencies
 */
import { useContext, useMemo } from '@wordpress/element';
import {
	privateApis,
	__experimentalToolbarContext as ToolbarContext,
	ToolbarGroup,
	__experimentalUseSlotFills as useSlotFills,
} from '@wordpress/components';
import warning from '@wordpress/warning';

/**
 * Internal dependencies
 */
import groups from './groups';
import { unlock } from '../../lock-unlock';
import { wpVersionCompare } from '@kubio/utils';
import { useKubioSlotHasFills } from '../../fixers/use-kubio-slot-has-fills';
const { ComponentsContext } = unlock( privateApis || {} );

export default function BlockControlsSlot( { group = 'default', ...props } ) {
	const toolbarState = useContext( ToolbarContext );
	//modified in kubio
	let contextState;
	let fillProps;

	//for wp6.3
	if ( ComponentsContext ) {
		contextState = useContext( ComponentsContext );
		fillProps = useMemo(
			() => ( {
				forwardedContext: [
					[ ToolbarContext.Provider, { value: toolbarState } ],
					[ ComponentsContext.Provider, { value: contextState } ],
				],
			} ),
			[ toolbarState, contextState ]
		);

		//backward compatible before 6.3
	} else {
		fillProps = useMemo(
			() => ( {
				forwardedContext: [
					[ ToolbarContext.Provider, { value: toolbarState } ],
				],
			} ),
			[ toolbarState ]
		);
	}
	const isLessThan6_8 = wpVersionCompare( '6.8', '<' );
	let Slot;
	let hasFills;
	if ( isLessThan6_8 ) {
		Slot = groups[ group ]?.Slot;
		hasFills = useKubioSlotHasFills( Slot.__unstableName );
	} else {
		const slotFill = groups[ group ];
		hasFills = useSlotFills( slotFill.name )?.length;
		Slot = slotFill.Slot;
	}

	if ( ! Slot ) {
		warning( `Unknown BlockControls group "${ group }" provided.` );
		return null;
	}

	if ( ! hasFills ) {
		return null;
	}

	const slot = <Slot { ...props } bubblesVirtually fillProps={ fillProps } />;

	if ( group === 'default' ) {
		return slot;
	}

	return <ToolbarGroup>{ slot }</ToolbarGroup>;
}
