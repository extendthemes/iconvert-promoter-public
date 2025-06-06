/**
 * WordPress dependencies
 */
import {
	store as blocksStore,
	getBlockType,
	serialize,
} from '@wordpress/blocks';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { pipe, useCopyToClipboard } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	Children,
	cloneElement,
	useCallback,
	useRef,
} from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { moreVertical } from '@wordpress/icons';
import {
	__unstableUseShortcutEventMatch,
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { store as blockEditorStore } from '../../store';
import BlockActions from '../block-actions';
import BlockIcon from '../block-icon';
import BlockSettingsMenuControls from '../block-settings-menu-controls';
import { useShowHoveredOrFocusedGestures } from '../block-toolbar/utils';
import BlockHTMLConvertButton from './block-html-convert-button';
import __unstableBlockSettingsMenuFirstItem from './block-settings-menu-first-item';

const POPOVER_PROPS = {
	className: 'block-editor-block-settings-menu__popover',
	placement: 'bottom-start',
};

function CopyMenuItem( { blocks, onCopy, label } ) {
	const ref = useCopyToClipboard( () => serialize( blocks ), onCopy );
	const copyMenuItemLabel = label ? label : __( 'Copy', 'kubio' );
	return <MenuItem ref={ ref }>{ copyMenuItemLabel }</MenuItem>;
}

function ParentSelectorMenuItem( { parentClientId, parentBlockType } ) {
	const { selectBlock } = useDispatch( blockEditorStore );

	// Allows highlighting the parent block outline when focusing or hovering
	// the parent block selector within the child.
	const menuItemRef = useRef();
	const gesturesProps = useShowHoveredOrFocusedGestures( {
		ref: menuItemRef,
		highlightParent: true,
	} );

	return (
		<MenuItem
			{ ...gesturesProps }
			ref={ menuItemRef }
			icon={ <BlockIcon icon={ parentBlockType.icon } /> }
			onClick={ () => selectBlock( parentClientId ) }
		>
			{ sprintf(
				/* translators: %s: Name of the block's parent. */
				__( 'Select parent block (%s)', 'kubio' ),
				parentBlockType.title
			) }
		</MenuItem>
	);
}

export function BlockSettingsDropdown( {
	block,
	clientIds,
	__experimentalSelectBlock,
	children,
	__unstableDisplayLocation,
	...props
} ) {
	// Get the client id of the current block for this menu, if one is set.
	const currentClientId = block?.clientId;
	const blockClientIds = Array.isArray( clientIds )
		? clientIds
		: [ clientIds ];
	const count = blockClientIds.length;
	const firstBlockClientId = blockClientIds[ 0 ];
	const {
		firstParentClientId,
		onlyBlock,
		parentBlockType,
		previousBlockClientId,
		selectedBlockClientIds,
	} = useSelect(
		( select ) => {
			const {
				getBlockCount,
				getBlockName,
				getBlockRootClientId,
				getPreviousBlockClientId,
				getSelectedBlockClientIds,
				getBlockAttributes,
			} = select( blockEditorStore );

			const { getActiveBlockVariation } = select( blocksStore );

			const _firstParentClientId =
				getBlockRootClientId( firstBlockClientId );
			const parentBlockName =
				_firstParentClientId && getBlockName( _firstParentClientId );

			return {
				firstParentClientId: _firstParentClientId,
				onlyBlock: 1 === getBlockCount( _firstParentClientId ),
				parentBlockType:
					_firstParentClientId &&
					( getActiveBlockVariation(
						parentBlockName,
						getBlockAttributes( _firstParentClientId )
					) ||
						getBlockType( parentBlockName ) ),
				previousBlockClientId:
					getPreviousBlockClientId( firstBlockClientId ),
				selectedBlockClientIds: getSelectedBlockClientIds(),
			};
		},
		[ firstBlockClientId ]
	);
	const { getBlockOrder, getSelectedBlockClientIds } =
		useSelect( blockEditorStore );

	const openedBlockSettingsMenu = useSelect(
		( select ) =>
			unlock( select( blockEditorStore ) ).getOpenedBlockSettingsMenu(),
		[]
	);

	const { setOpenedBlockSettingsMenu } = unlock(
		useDispatch( blockEditorStore )
	);

	const shortcuts = useSelect( ( select ) => {
		const { getShortcutRepresentation } = select( keyboardShortcutsStore );
		return {
			duplicate: getShortcutRepresentation(
				'core/block-editor/duplicate'
			),
			remove: getShortcutRepresentation( 'core/block-editor/remove' ),
			insertAfter: getShortcutRepresentation(
				'core/block-editor/insert-after'
			),
			insertBefore: getShortcutRepresentation(
				'core/block-editor/insert-before'
			),
		};
	}, [] );
	const isMatch = __unstableUseShortcutEventMatch();
	const hasSelectedBlocks = selectedBlockClientIds.length > 0;

	const updateSelectionAfterDuplicate = useCallback(
		async ( clientIdsPromise ) => {
			if ( __experimentalSelectBlock ) {
				const ids = await clientIdsPromise;
				if ( ids && ids[ 0 ] ) {
					__experimentalSelectBlock( ids[ 0 ], false );
				}
			}
		},
		[ __experimentalSelectBlock ]
	);

	const updateSelectionAfterRemove = useCallback( () => {
		if ( __experimentalSelectBlock ) {
			let blockToFocus = previousBlockClientId || firstParentClientId;

			// Focus the first block if there's no previous block nor parent block.
			if ( ! blockToFocus ) {
				blockToFocus = getBlockOrder()[ 0 ];
			}

			// Only update the selection if the original selection is removed.
			const shouldUpdateSelection =
				hasSelectedBlocks && getSelectedBlockClientIds().length === 0;

			__experimentalSelectBlock( blockToFocus, shouldUpdateSelection );
		}
	}, [
		__experimentalSelectBlock,
		previousBlockClientId,
		firstParentClientId,
		getBlockOrder,
		hasSelectedBlocks,
		getSelectedBlockClientIds,
	] );

	// This can occur when the selected block (the parent)
	// displays child blocks within a List View.
	const parentBlockIsSelected =
		selectedBlockClientIds?.includes( firstParentClientId );

	// When a currentClientId is in use, treat the menu as a controlled component.
	// This ensures that only one block settings menu is open at a time.
	// This is a temporary solution to work around an issue with `onFocusOutside`
	// where it does not allow a dropdown to be closed if focus was never within
	// the dropdown to begin with. Examples include a user either CMD+Clicking or
	// right clicking into an inactive window.
	// See: https://github.com/WordPress/gutenberg/pull/54083
	const open = ! currentClientId
		? undefined
		: openedBlockSettingsMenu === currentClientId || false;

	const onToggle = useCallback(
		( localOpen ) => {
			if ( localOpen && openedBlockSettingsMenu !== currentClientId ) {
				setOpenedBlockSettingsMenu( currentClientId );
			} else if (
				! localOpen &&
				openedBlockSettingsMenu &&
				openedBlockSettingsMenu === currentClientId
			) {
				setOpenedBlockSettingsMenu( undefined );
			}
		},
		[ currentClientId, openedBlockSettingsMenu, setOpenedBlockSettingsMenu ]
	);

	return (
		<BlockActions
			clientIds={ clientIds }
			__experimentalUpdateSelection={ ! __experimentalSelectBlock }
		>
			{ ( {
				canCopyStyles,
				canDuplicate,
				canInsertDefaultBlock,
				canMove,
				canRemove,
				onDuplicate,
				onInsertAfter,
				onInsertBefore,
				onRemove,
				onCopy,
				onPasteStyles,
				onMoveTo,
				blocks,
			} ) => {
				const hasKubioBlock = !! blocks.find( ( b ) =>
					b?.name?.startsWith( 'kubio/' ) || b?.name?.startsWith( 'cspromo/' )
				);

				return (
					<DropdownMenu
						icon={ moreVertical }
						label={ __( 'Options', 'kubio' ) }
						className="block-editor-block-settings-menu"
						popoverProps={ POPOVER_PROPS }
						noIcons
						menuProps={ {
							/**
							 * @param {KeyboardEvent} event
							 */
							onKeyDown( event ) {
								if ( event.defaultPrevented ) return;

								if (
									isMatch(
										'core/block-editor/remove',
										event
									) &&
									canRemove
								) {
									event.preventDefault();
									updateSelectionAfterRemove( onRemove() );
								} else if (
									isMatch(
										'core/block-editor/duplicate',
										event
									) &&
									canDuplicate
								) {
									event.preventDefault();
									updateSelectionAfterDuplicate(
										onDuplicate()
									);
								} else if (
									isMatch(
										'core/block-editor/insert-after',
										event
									) &&
									canInsertDefaultBlock
								) {
									event.preventDefault();
									setOpenedBlockSettingsMenu( undefined );
									onInsertAfter();
								} else if (
									isMatch(
										'core/block-editor/insert-before',
										event
									) &&
									canInsertDefaultBlock
								) {
									event.preventDefault();
									setOpenedBlockSettingsMenu( undefined );
									onInsertBefore();
								}
							},
						} }
						{ ...props }
					>
						{ ( { onClose } ) => (
							<>
								<MenuGroup>
									<__unstableBlockSettingsMenuFirstItem.Slot
										fillProps={ { onClose } }
									/>
									{ ! parentBlockIsSelected &&
										!! firstParentClientId && (
											<ParentSelectorMenuItem
												parentClientId={
													firstParentClientId
												}
												parentBlockType={
													parentBlockType
												}
											/>
										) }
									{ count === 1 && (
										<BlockHTMLConvertButton
											clientId={ firstBlockClientId }
										/>
									) }
									{ /*<CopyMenuItem*/ }
									{ /*	blocks={blocks}*/ }
									{ /*	onCopy={onCopy}*/ }
									{ /*/>*/ }
									{ canDuplicate && (
										<MenuItem
											onClick={ pipe(
												onClose,
												onDuplicate,
												updateSelectionAfterDuplicate
											) }
											shortcut={ shortcuts.duplicate }
										>
											{ __( 'Duplicate', 'kubio' ) }
										</MenuItem>
									) }
									{ canInsertDefaultBlock && (
										<>
											<MenuItem
												onClick={ pipe(
													onClose,
													onInsertBefore
												) }
												shortcut={
													shortcuts.insertBefore
												}
											>
												{ __( 'Add before', 'kubio' ) }
											</MenuItem>
											<MenuItem
												onClick={ pipe(
													onClose,
													onInsertAfter
												) }
												shortcut={
													shortcuts.insertAfter
												}
											>
												{ __( 'Add after', 'kubio' ) }
											</MenuItem>
										</>
									) }
								</MenuGroup>
								{ canCopyStyles && ! hasKubioBlock && (
									<MenuGroup>
										<CopyMenuItem
											blocks={ blocks }
											onCopy={ onCopy }
											label={ __(
												'Copy styles',
												'kubio'
											) }
										/>
										<MenuItem onClick={ onPasteStyles }>
											{ __( 'Paste styles', 'kubio' ) }
										</MenuItem>
									</MenuGroup>
								) }
								<BlockSettingsMenuControls.Slot
									fillProps={ {
										onClose,
										canMove,
										onMoveTo,
										onlyBlock,
										count,
										firstBlockClientId,
									} }
									clientIds={ clientIds }
									__unstableDisplayLocation={
										__unstableDisplayLocation
									}
								/>
								{ typeof children === 'function'
									? children( { onClose } )
									: Children.map( ( child ) =>
											cloneElement( child, { onClose } )
									  ) }
								{ canRemove && (
									<MenuGroup>
										<MenuItem
											onClick={ pipe(
												onClose,
												onRemove,
												updateSelectionAfterRemove
											) }
											shortcut={ shortcuts.remove }
										>
											{ __( 'Delete', 'kubio' ) }
										</MenuItem>
									</MenuGroup>
								) }
							</>
						) }
					</DropdownMenu>
				);
			} }
		</BlockActions>
	);
}

export default BlockSettingsDropdown;
