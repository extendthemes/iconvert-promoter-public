/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import {
	hasBlockSupport,
	switchToBlockType,
	store as blocksStore,
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { useNotifyCopy } from '../../utils/use-notify-copy';
import usePasteStyles from '../use-paste-styles';
import { store as blockEditorStore } from '../../store';

export default function BlockActions( {
	clientIds,
	children,
	__experimentalUpdateSelection: updateSelection,
} ) {
	const {
		canCopyStyles,
		canDuplicate,
		canInsertDefaultBlock,
		canMove,
		canRemove,
		getGroupingBlockName,
		rootClientId,
		blocks,
	} = useSelect(
		( select ) => {
			const {
				canInsertBlockType,
				getBlockRootClientId,
				getBlocksByClientId,
				canMoveBlocks,
				canRemoveBlocks,
			} = select( blockEditorStore );

			const {
				getDefaultBlockName,
				getGroupingBlockName: _getGroupingBlockName,
			} = select( blocksStore );

			const _blocks = getBlocksByClientId( clientIds );
			const _rootClientId = getBlockRootClientId( clientIds[ 0 ] );

			const _canCopyStyles = _blocks.every( ( block ) => {
				return (
					!! block &&
					( hasBlockSupport( block.name, 'color' ) ||
						hasBlockSupport( block.name, 'typography' ) )
				);
			} );

			const _canDuplicate = _blocks.every( ( block ) => {
				return (
					!! block &&
					hasBlockSupport( block.name, 'multiple', true ) &&
					canInsertBlockType( block.name, _rootClientId )
				);
			} );

			const _canInsertDefaultBlock = canInsertBlockType(
				getDefaultBlockName(),
				_rootClientId
			);

			const _canMove = canMoveBlocks( clientIds, _rootClientId );
			const _canRemove = canRemoveBlocks( clientIds, _rootClientId );

			return {
				canCopyStyles: _canCopyStyles,
				canDuplicate: _canDuplicate,
				canInsertDefaultBlock: _canInsertDefaultBlock,
				canMove: _canMove,
				canRemove: _canRemove,
				getGroupingBlockName: _getGroupingBlockName,
				rootClientId: _rootClientId,
				blocks: _blocks,
			};
		},
		[ clientIds ]
	);

	const {
		removeBlocks,
		replaceBlocks,
		duplicateBlocks,
		insertAfterBlock,
		insertBeforeBlock,
		flashBlock,
		setBlockMovingClientId,
		setNavigationMode,
		selectBlock,
	} = useDispatch( blockEditorStore );

	const notifyCopy = useNotifyCopy();
	const pasteStyles = usePasteStyles();

	return children( {
		canCopyStyles,
		canDuplicate,
		canInsertDefaultBlock,
		canMove,
		canRemove,
		rootClientId,
		blocks,
		onDuplicate() {
			return duplicateBlocks( clientIds, updateSelection );
		},
		onRemove() {
			return removeBlocks( clientIds, updateSelection );
		},
		onInsertBefore() {
			const clientId = Array.isArray( clientIds )
				? clientIds[ 0 ]
				: clientId;
			insertBeforeBlock( clientId );
		},
		onInsertAfter() {
			const clientId = Array.isArray( clientIds )
				? clientIds[ clientIds.length - 1 ]
				: clientId;
			insertAfterBlock( clientId );
		},
		onMoveTo() {
			setNavigationMode( true );
			selectBlock( clientIds[ 0 ] );
			setBlockMovingClientId( clientIds[ 0 ] );
		},
		onGroup() {
			if ( ! blocks.length ) {
				return;
			}

			const groupingBlockName = getGroupingBlockName();

			// Activate the `transform` on `core/group` which does the conversion.
			const newBlocks = switchToBlockType( blocks, groupingBlockName );

			if ( ! newBlocks ) {
				return;
			}
			replaceBlocks( clientIds, newBlocks );
		},
		onUngroup() {
			if ( ! blocks.length ) {
				return;
			}

			const innerBlocks = blocks[ 0 ].innerBlocks;

			if ( ! innerBlocks.length ) {
				return;
			}

			replaceBlocks( clientIds, innerBlocks );
		},
		onCopy() {
			const selectedBlockClientIds = blocks.map(
				( { clientId } ) => clientId
			);
			if ( blocks.length === 1 ) {
				flashBlock( selectedBlockClientIds[ 0 ] );
			}
			notifyCopy( 'copy', selectedBlockClientIds );
		},
		async onPasteStyles() {
			await pasteStyles( blocks );
		},
	} );
}
