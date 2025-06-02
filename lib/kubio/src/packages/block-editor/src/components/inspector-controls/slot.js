/**
 * WordPress dependencies
 */
import { __experimentalUseSlotFills as useSlotFills } from '@wordpress/components';
import warning from '@wordpress/warning';
import deprecated from '@wordpress/deprecated';
/**
 * Internal dependencies
 */
import { useContext, useEffect, useMemo } from '@wordpress/element';
import { useKubioSlotHasFills } from '../../fixers/use-kubio-slot-has-fills';
import BlockSupportSlotContainer from './block-support-slot-container';
import BlockSupportToolsPanel from './block-support-tools-panel';
import groups from './groups';
import { wpVersionCompare } from '@kubio/utils';

export default function InspectorControlsSlot( {
	__experimentalGroup,
	group = 'default',
	label,
	fillProps,
	...props
} ) {
	let hasFills, Slot;
	const isWp67 = wpVersionCompare( '6.8', '<' );
	if ( isWp67 ) {
		Slot = groups[ group ]?.Slot;
		hasFills = useKubioSlotHasFills( Slot?.__unstableName );
	} else {
		if ( __experimentalGroup ) {
			deprecated(
				'`__experimentalGroup` property in `InspectorControlsSlot`',
				{
					since: '6.2',
					version: '6.4',
					alternative: '`group`',
				}
			);
			group = __experimentalGroup;
		}
		const slotFill = groups[ group ];
		hasFills = useSlotFills( slotFill?.name )?.length;
		Slot = slotFill?.Slot;
	}

	if ( ! Slot ) {
		warning( `Unknown InspectorControls group "${ group }" provided.` );
		return null;
	}
	if ( ! hasFills ) {
		return null;
	}

	if ( label ) {
		return (
			<BlockSupportToolsPanel group={ group } label={ label }>
				<BlockSupportSlotContainer
					{ ...props }
					fillProps={ fillProps }
					Slot={ Slot }
				/>
			</BlockSupportToolsPanel>
		);
	}

	return <Slot { ...props } fillProps={ fillProps } bubblesVirtually />;
}
