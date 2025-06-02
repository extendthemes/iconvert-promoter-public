/**
 * External dependencies
 */
import { noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import InserterMenu from './menu';
import { store as blockEditorStore } from '../../store';
import { forwardRef } from '@wordpress/element';

function InserterLibrary( {
	rootClientId,
	clientId,
	isAppender,
	showInserterHelpPanel,
	showMostUsedBlocks = false,
	__experimentalInsertionIndex,
	onSelect = noop,
	shouldFocusBlock = false,
	shouldSelectBlock = true,
	ownerDocument,
} ) {
	const destinationRootClientId = useSelect(
		( select ) => {
			const { getBlockRootClientId } = select( blockEditorStore );

			return (
				rootClientId || getBlockRootClientId( clientId ) || undefined
			);
		},
		[ clientId, rootClientId ]
	);

	return (
		<InserterMenu
			onSelect={ onSelect }
			rootClientId={ destinationRootClientId }
			clientId={ clientId }
			isAppender={ isAppender }
			showInserterHelpPanel={ showInserterHelpPanel }
			showMostUsedBlocks={ showMostUsedBlocks }
			__experimentalInsertionIndex={ __experimentalInsertionIndex }
			shouldFocusBlock={ shouldFocusBlock }
			shouldSelectBlock={ shouldSelectBlock }
			ownerDocument={ ownerDocument }
		/>
	);
}

export const PrivateInserterLibrary = forwardRef( InserterLibrary );

function PublicInserterLibrary( props, ref ) {
	return (
		<PrivateInserterLibrary
			{ ...props }
			onPatternCategorySelection={ undefined }
			ref={ ref }
		/>
	);
}

export default forwardRef( PublicInserterLibrary );
