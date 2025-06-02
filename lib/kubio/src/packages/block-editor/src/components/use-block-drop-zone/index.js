/**
 * WordPress dependencies
 */
import {
	useThrottle,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseDropZone as useDropZone,
} from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useRef, useState } from '@wordpress/element';
import { isRTL } from '@wordpress/i18n';
import memize from 'memize';
import { store as blockEditorStore } from '../../store';
import { getDistanceToNearestEdge } from '../../utils/math';
import { __unstableUseBlockElement } from '../block-list/use-block-props/use-block-refs';

const DRAG_TRESHOLD = 20;
const HIDE_INSERTER_CLASS = 'kubio-dragging-from-inserter--active';

const isOutsideTreshold = ( prevValue, currentValue ) => {
	return (
		currentValue < prevValue - DRAG_TRESHOLD ||
		currentValue > prevValue + DRAG_TRESHOLD
	);
};

const showInsertSiderbar = () => {
	top.requestIdleCallback( () => {
		setTimeout(
			() => top.document.body.classList.remove( HIDE_INSERTER_CLASS ),
			10
		);
	} );
};

/**
 * Internal dependencies
 */
import useOnBlockDrop from '../use-on-block-drop';
/** @typedef {import('../../utils/math').WPPoint} WPPoint */

/**
 * The orientation of a block list.
 *
 * @typedef {'horizontal'|'vertical'|undefined} WPBlockListOrientation
 */

/**
 * Given a list of block DOM elements finds the index that a block should be dropped
 * at.
 *
 * @param {Element[]}              elements    Array of DOM elements that represent each block in a block list.
 * @param {WPPoint}                position    The position of the item being dragged.
 * @param {WPBlockListOrientation} orientation The orientation of a block list.
 * @return {number|undefined} The block index that's closest to the drag position.
 */
export function getNearestBlockIndex( elements, position, orientation ,indexMap) {
	const allowedEdges =
		orientation === 'horizontal'
			? [ 'left', 'right' ]
			: [ 'top', 'bottom' ];

	const isRightToLeft = isRTL();

	let candidateIndex;
	let candidateDistance;

	elements.forEach( ( element, index ) => {
		const rect = element.getBoundingClientRect();
		const [ distance, edge ] = getDistanceToNearestEdge(
			position,
			rect,
			allowedEdges
		);

		if ( candidateDistance === undefined || distance < candidateDistance ) {
			// If the user is dropping to the trailing edge of the block
			// add 1 to the index to represent dragging after.
			// Take RTL languages into account where the left edge is
			// the trailing edge.
			const isTrailingEdge =
				edge === 'bottom' ||
				( ! isRightToLeft && edge === 'right' ) ||
				( isRightToLeft && edge === 'left' );
			let offset = isTrailingEdge ? 1 : 0;

			// If the target is the dragged block itself and another 1 to
			// index as the dragged block is set to `display: none` and
			// should be skipped in the calculation.
			const isTargetDraggedBlock =
				isTrailingEdge &&
				elements[ index + 1 ] &&
				elements[ index + 1 ].classList.contains( 'is-dragging' );
			offset += isTargetDraggedBlock ? 1 : 0;

			// Update the currently known best candidate.
			candidateDistance = distance;

			let mapIndex = indexMap.has( element ) ? indexMap.get( element ) : index;

			candidateIndex = mapIndex + offset;
		}
	} );

	return candidateIndex;
}

const addDropOverlay = ( targetEl ) => {
	targetEl.ownerDocument
		.querySelectorAll( '.kubio-is-hovered-on-drop' )
		.forEach( ( element ) => {
			if ( ! element.isSameNode( targetEl ) ) {
				element.classList.remove(
					'is-hovered',
					'kubio-is-hovered-on-drop'
				);
			}
		} );

	targetEl.classList.add( 'is-hovered', 'kubio-is-hovered-on-drop' );
};

/**
 * Check if the dragged blocks can be dropped on the target.
 * @param {Function} getBlockType
 * @param {Object[]} allowedBlocks
 * @param {string[]} draggedBlockNames
 * @param {string}   targetBlockName
 * @return {boolean} Whether the dragged blocks can be dropped on the target.
 */
export function isDropTargetValid(
	getBlockType,
	allowedBlocks,
	draggedBlockNames,
	targetBlockName
) {
	// At root level allowedBlocks is undefined and all blocks are allowed.
	// Otherwise, check if all dragged blocks are allowed.
	let areBlocksAllowed = true;
	if ( allowedBlocks ) {
		const allowedBlockNames = allowedBlocks?.map( ( { name } ) => name );

		areBlocksAllowed = draggedBlockNames.every( ( name ) =>
			allowedBlockNames?.includes( name )
		);
	}

	// Work out if dragged blocks have an allowed parent and if so
	// check target block matches the allowed parent.
	const draggedBlockTypes = draggedBlockNames.map( ( name ) =>
		getBlockType( name )
	);
	const targetMatchesDraggedBlockParents = draggedBlockTypes.every(
		( block ) => {
			const [ allowedParentName ] = block?.parent || [];
			if ( ! allowedParentName ) {
				return true;
			}

			return allowedParentName === targetBlockName;
		}
	);

	return areBlocksAllowed && targetMatchesDraggedBlockParents;
}

/**
 * @typedef  {Object} WPBlockDropZoneConfig
 * @property {string} rootClientId The root client id for the block list.
 */

/**
 * A React hook that can be used to make a block list handle drag and drop.
 *
 * @param {WPBlockDropZoneConfig} dropZoneConfig configuration data for the drop zone.
 */
export default function useBlockDropZone( {
	// An undefined value represents a top-level block. Default to an empty
	// string for this so that `targetRootClientId` can be easily compared to
	// values returned by the `getRootBlockClientId` selector, which also uses
	// an empty string to represent top-level blocks.
	rootClientId = '',
} = {} ) {
	const [ targetBlockIndex, setTargetBlockIndex ] = useState( null );
	const showId = useRef( null );
	const targetRootClientIdRef = useRef( null );
	targetRootClientIdRef.current = rootClientId;

	const {
		isLockedAll,
		orientation,
		noDragInside,
		canInsert,
		isInsertionPointVisible,
	} = useSelect(
		( select ) => {
			const {
				getBlockListSettings,
				getTemplateLock,
				getBlock,
				canInsertBlockType,
				isBlockInsertionPointVisible,
			} = select( blockEditorStore );

			const { getBlockType } = select( 'core/blocks' );

			const targetBlock = getBlock( rootClientId );
			const targetBlockType = getBlockType( targetBlock?.name );

			return {
				isLockedAll: getTemplateLock( rootClientId ) === 'all',
				orientation: getBlockListSettings( rootClientId )?.orientation,

				noDragInside: rootClientId
					? targetBlockType?.innerBlocksDisableInBetweenInserter
					: false,
				canInsert: canInsertBlockType,
				isInsertionPointVisible: isBlockInsertionPointVisible,
			};
		},
		[ rootClientId ]
	);

	const {
		showInsertionPoint: showInsertionPoint_,
		hideInsertionPoint: hideInsertionPoint_,
	} = useDispatch( blockEditorStore );

	const showInsertionPoint = ( nextTargetIndex ) => {
		if ( showId.current !== rootClientId + nextTargetIndex ) {
			showId.current = rootClientId + nextTargetIndex;
			showInsertionPoint_( rootClientId, nextTargetIndex );
		}
	};

	const hideInsertionPoint = () => {
		if ( showId.current && isInsertionPointVisible ) {
			hideInsertionPoint_();
			showId.current = null;
		}
	};

	const targetEl = __unstableUseBlockElement( rootClientId );

	const memizedCanInsert = useCallback( memize( canInsert ), [] );

	const canInsertDraggedBlocks = useCallback( () => {
		const transferedBlocks = window.kubioDraggingData?.blocks?.map(
			( { name } ) => name
		);

		const canInsertBlocks = ( transferedBlocks || [] )
			.map( ( blockType ) =>
				memizedCanInsert( blockType, targetRootClientIdRef.current )
			)
			.reduce( ( acc, value ) => acc && value, true );

		return canInsertBlocks;
	}, [] );

	const _onBlockDrop = useOnBlockDrop( rootClientId, targetBlockIndex );

	const onBlockDrop = useCallback(
		( event ) => {
			event.target.ownerDocument
				.querySelectorAll( '.kubio-is-hovered-on-drop' )
				.forEach( ( item ) => {
					item.classList.remove( 'kubio-is-hovered-on-drop' );
				} );
			return _onBlockDrop( event );
		},
		[ _onBlockDrop ]
	);

	const onDragOver = useThrottle(
		useCallback(
			( event, currentTarget ) => {
				// ExtendThemes atempt to display insertion only on supporterd containers
				if ( ! targetEl || ! canInsertDraggedBlocks() ) {
					return;
				}

				const indexMap = new Map();

				const blockElements = Array.from(
					currentTarget.children
				).filter(
					( element, index ) => {

						if(element.getAttribute('data-skip-inbetween')) {
							return false;
						}

						const isValid =  element.classList.contains( 'wp-block' ) || !!element.getAttribute( 'data-block' ) ||
						!!element.querySelector( '.wp-block' );

						if( isValid ) {
							indexMap.set( element, index );
						}
						return isValid;
					}
						
				);

				const nearestTargetIndex = getNearestBlockIndex(
					blockElements,
					{ x: event.clientX, y: event.clientY },
					orientation,
					indexMap
				);

				const targetIndex =
					nearestTargetIndex === undefined ? 0 : nearestTargetIndex;

				setTargetBlockIndex( targetIndex );

				if ( targetEl && targetIndex !== null ) {
					addDropOverlay( targetEl );
					showInsertionPoint( targetIndex );
				}
			},
			[ targetEl ]
		),
		200
	);

	const onDragEnter = useThrottle(
		useCallback( () => {
			if ( ! targetEl ) {
				return;
			}

			if ( canInsertDraggedBlocks() ) {
				addDropOverlay( targetEl );
			} else {
				targetEl.classList.remove(
					'is-hovered',
					'kubio-is-hovered-on-drop'
				);
			}
		}, [ targetEl ] ),
		100
	);

	const onDragLeave = useCallback(
		( event ) => {
			if (
				targetEl &&
				targetEl?.classList?.contains( 'kubio-is-hovered-on-drop' )
			) {
				targetEl?.classList.remove(
					'is-hovered',
					'kubio-is-hovered-on-drop'
				);
			}

			const closestBlock = event?.target?.closest?.( '.wp-block' );
			if ( closestBlock && closestBlock.isSameNode( targetEl ) ) {
				return;
			}

			if ( ! showId.current ) {
				return;
			}

			onDragOver.cancel();
			hideInsertionPoint();
			setTargetBlockIndex( null );
		},
		[ targetEl ]
	);

	const dragOverPreviousePosition = useRef( { x: 0, y: 0 } );

	const onDragEnd = useCallback(
		( event ) => {
			showId.current = null;
			setTargetBlockIndex( null );
			dragOverPreviousePosition.current = { x: 0, y: 0 };

			showInsertSiderbar();

			if ( ! showId.current ) {
				return;
			}

			onDragEnter.cancel();
			onDragOver.cancel();

			hideInsertionPoint();

			if ( targetBlockIndex !== null ) {
				setTargetBlockIndex( null );
			}
			targetEl?.classList?.remove(
				'is-hovered',
				'kubio-is-hovered-on-drop'
			);
		},
		[ targetEl ]
	);

	const topDocumentDrop = useCallback( () => {
		showInsertSiderbar();
		top.document.removeEventListener( 'dragend', topDocumentDrop );
	} );

	return useDropZone( {
		isDisabled: isLockedAll || noDragInside,
		onDragStart: () => {
			top.document.addEventListener( 'dragend', topDocumentDrop );
		},
		onDrop: ( ...args ) => {
			showInsertSiderbar();
			onBlockDrop( ...args );
		},
		onDragOver( event ) {
			if (
				! event.currentTarget
					.closest( '.wp-block' )
					?.isSameNode( targetEl )
			) {
				return;
			}

			if (
				isOutsideTreshold(
					dragOverPreviousePosition.current.x,
					event.clientX
				) ||
				isOutsideTreshold(
					dragOverPreviousePosition.current.y,
					event.clientY
				)
			) {
				dragOverPreviousePosition.current = {
					x: event.clientX,
					y: event.clientY,
				};

				onDragOver( event, event.currentTarget );
			}
		},
		onDragEnd,
		onDragEnter,
		onDragLeave,
	} );
}
