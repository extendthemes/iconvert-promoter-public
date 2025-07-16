/**
 * WordPress dependencies
 */
import { getBlockType } from '@wordpress/blocks';
import { useRefEffect } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useContext, useRef } from '@wordpress/element';
import { first, last, throttle } from 'lodash';
/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import { InsertionPointOpenRef } from '../block-tools/insertion-point';

const MOUSE_THRESHOLD = 15;
const MOUSE_THRESHOLD_MIN = 5;

const getClosestBlock = ( el ) => {
	return el?.closest( '[data-block]' );
};

const getClosestInnerBlocksList = ( el ) => {
	// Firefox - if el is text nodex set el to the parent element
	if ( el.nodeType === 3 ) {
		el = el.parentElement;
	}

	return el?.classList?.contains( 'block-editor-block-list__layout' )
		? el.parentElement.closest( '.block-editor-block-list__layout' )
		: el?.closest( '.block-editor-block-list__layout' );
};

const shouldGoUpper = ( closestBlock ) => {
	if ( ! closestBlock ) {
		return false;
	}

	if ( ! closestBlock?.getAttribute( 'data-type' ) ) {
		return;
	}

	return (
		closestBlock.hasAttribute( 'data-kubio-disable-inbetween-inserter' ) ||
		getBlockType( closestBlock?.getAttribute( 'data-type' ) )
			?.innerBlocksDisableInBetweenInserter
	);
};

export function useInBetweenInserter() {
	const openRef = useContext( InsertionPointOpenRef );
	const isInBetweenInserterDisabled = useSelect(
		( select ) =>
			select( blockEditorStore ).getSettings().hasReducedUI ||
			select( blockEditorStore ).__unstableGetEditorMode() === 'zoom-out',
		[]
	);
	const {
		getBlockListSettings,
		getBlockRootClientId,
		getBlockIndex,
		isBlockInsertionPointVisible,
		isMultiSelecting,
		getSelectedBlockClientIds,
		getTemplateLock,
	} = useSelect( blockEditorStore );

	const {
		showInsertionPoint: showInsertionPoint_,
		hideInsertionPoint: hideInsertionPoint_,
	} = useDispatch( blockEditorStore );

	const ref = useRef( {} );

	const showInsertionPoint = useCallback(
		( rootClientId, index, options, isVisible ) => {
			// skip store updating, it affects drag performance//
			if (
				isVisible &&
				ref.current &&
				ref.current.rootClientId === rootClientId &&
				ref.current.index === index
			) {
				return;
			}
			ref.current = {
				rootClientId,
				index,
			};
			showInsertionPoint_( rootClientId, index, options );
		},
		[ showInsertionPoint_ ]
	);

	const hideInsertionPoint = useCallback( () => {
		ref.current = null;
		hideInsertionPoint_();
	}, [ hideInsertionPoint_ ] );

	return useRefEffect(
		( node ) => {
			function onMouseMove( event ) {
				if ( openRef.current ) {
					return;
				}

				if ( isMultiSelecting() ) {
					return;
				}

				let blocksListElement = event.target;

				// don's show inserter for locked template parts
				if (
					blocksListElement.closest( '[data-kubio-template-overlay]' )
				) {
					hideInsertionPoint();
					return;
				}

				if (
					! blocksListElement.classList?.contains(
						'block-editor-block-list__layout'
					)
				) {
					blocksListElement =
						getClosestInnerBlocksList( blocksListElement );
				}

				let closestBlock = getClosestBlock( blocksListElement );
				while ( blocksListElement ) {
					if ( ! shouldGoUpper( closestBlock ) ) {
						break;
					}

					blocksListElement =
						getClosestInnerBlocksList( closestBlock );

					if ( blocksListElement ) {
						closestBlock = getClosestBlock( blocksListElement );
					}
				}

				if ( ! blocksListElement ) {
					if ( isBlockInsertionPointVisible() ) {
						hideInsertionPoint();
					}
					return;
				}

				let rootClientId;
				if (
					! blocksListElement.classList.contains(
						'is-root-container'
					)
				) {
					const blockElement = !! blocksListElement.getAttribute(
						'data-block'
					)
						? blocksListElement
						: blocksListElement.closest( '[data-block]' );
					rootClientId = blockElement.getAttribute( 'data-block' );
				}

				// Don't set the insertion point if the template is locked.
				if ( getTemplateLock( rootClientId ) ) {
					return;
				}

				const orientation =
					getBlockListSettings( rootClientId )?.orientation ||
					'vertical';
				const rect = blocksListElement.getBoundingClientRect();
				const mouseOffsetTop = event.clientY - rect.top;
				const mouseOffsetLeft = event.clientX - rect.left;


				const originalChildren = Array.from(
					blocksListElement.children)

				const children = originalChildren.filter(
					(item) => !item.getAttribute('data-skip-inbetween')
				); 

				let element = null;
				let edge = null;

				const firstChildTop = children.length
					? first( children ).getBoundingClientRect().top - rect.top
					: null;
				const lastChildBottom = children.length
					? last( children ).getBoundingClientRect().bottom - rect.top
					: null;

				const firstChildThreshold = ! children.length
					? 0
					: Math.min(
							Math.max(
								MOUSE_THRESHOLD_MIN,
								children[ 0 ].offsetHeight / 3
							),
							MOUSE_THRESHOLD
					  );

				const lastChildThreshold = ! children.length
					? 0
					: Math.min(
							Math.max(
								MOUSE_THRESHOLD_MIN,
								last( children ).offsetHeight / 3
							),
							MOUSE_THRESHOLD
					  );

				if (
					orientation === 'vertical' &&
					mouseOffsetTop <= firstChildTop + firstChildThreshold
				) {
					element = children[ 0 ];
					edge = 'top';
				} else if (
					orientation === 'vertical' &&
					mouseOffsetTop >= lastChildBottom - lastChildThreshold
				) {
					element = last( children );
					edge = 'bottom';
				} else {
					element = children.find( ( blockEl, index ) => {
						const previousBlockEl = index
							? children[ index - 1 ]
							: null;

						if ( orientation === 'vertical' && previousBlockEl ) {
							// is first element

							// set threshold between 5 and MOUSE_TRESHOLD depending on the height
							const threshold = Math.min(
								Math.max(
									5,
									Math.min(
										blockEl.offsetHeight,
										previousBlockEl.offsetHeight
									) / 3
								),
								MOUSE_THRESHOLD
							);

							const prevOffsetTop = previousBlockEl.getBoundingClientRect().top - rect.top;

							// threshold to previous block bottom
							const mouseMinValue =
								prevOffsetTop +
								previousBlockEl.offsetHeight -
								threshold;

							// MOUSE_THRESHOLD to current block top

							const offsetTop = blockEl.getBoundingClientRect().top - rect.top;

							const mouseMaxValue = offsetTop + threshold;

							return (
								mouseMinValue <= mouseOffsetTop &&
								mouseOffsetTop <= mouseMaxValue
							);
						}

						if ( orientation === 'horizontal' ) {
							return blockEl.offsetLeft > mouseOffsetLeft;
						}

						return false;
					} );
				}

				if ( ! element ) {
					if ( isBlockInsertionPointVisible() ) {
						hideInsertionPoint();
					}
					return;
				}

				// The block may be in an alignment wrapper, so check the first direct
				// child if the element has no ID.
				if ( ! element.id ) {
					element = element.firstElementChild;

					if ( ! element ) {
						if ( isBlockInsertionPointVisible() ) {
							hideInsertionPoint();
						}
						return;
					}
				}

				// do not show before de selected element - this will cover the block toolbar
				if ( element.classList.contains( 'is-selected' ) ) {
					if ( ! edge || edge === 'top' ) {
						if ( isBlockInsertionPointVisible() ) {
							hideInsertionPoint();
						}
						return;
					}
				}


				const clientId = element.id.slice( 'block-'.length );

				if ( ! clientId ) {
					return;
				}

				const elementRect = element.getBoundingClientRect();

				if (
					( orientation === 'horizontal' &&
						( event.clientY > elementRect.bottom ||
							event.clientY < elementRect.top ) ) ||
					( orientation === 'vertical' &&
						( event.clientX > elementRect.right ||
							event.clientX < elementRect.left ) )
				) {
					if ( isBlockInsertionPointVisible() ) {
						hideInsertionPoint();
					}
					return;
				}

				// Don't show the in-between inserter before the first block in
				// the list (preserves the original behaviour).
				if ( ! rootClientId ) {
					if ( isBlockInsertionPointVisible() ) {
						hideInsertionPoint();
					}
					return;
				}

				const index = getBlockIndex( clientId, rootClientId );

				showInsertionPoint(
					rootClientId,
					index,
					{
						__unstableWithInserter: true,
						kubioInsertionEdge: edge,
					},
					isBlockInsertionPointVisible()
				);
			}

			const onMouseMoveThrottled = throttle( onMouseMove, 1000 );
			node.addEventListener( 'mousemove', onMouseMoveThrottled );
			return () => {
				node.removeEventListener( 'mousemove', onMouseMoveThrottled );
			};
		},
		[
			getBlockListSettings,
			getBlockRootClientId,
			getBlockIndex,
			isBlockInsertionPointVisible,
			isMultiSelecting,
			showInsertionPoint,
			hideInsertionPoint,
			getSelectedBlockClientIds,
			isInBetweenInserterDisabled,
		]
	);
}
