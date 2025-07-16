/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import {
	useCallback,
	useMemo,
	createContext,
	useReducer,
	useLayoutEffect,
} from '@wordpress/element';
import { Popover } from '@wordpress/components';
import { isRTL } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import { useBlockElement } from '../block-list/use-block-props/use-block-refs';
import usePopoverScroll from './use-popover-scroll';
import { isFunction } from 'lodash';
import { wpVersionCompare } from '@kubio/utils';

const MAX_POPOVER_RECOMPUTE_COUNTER = Number.MAX_SAFE_INTEGER;

// eslint-disable-next-line camelcase
const isBelowWp6_3 = wpVersionCompare( '6.3', '<' );

export const InsertionPointOpenRef = createContext();

function BlockPopoverInbetween( {
	previousClientId,
	nextClientId,
	children,
	__unstablePopoverSlot,
	__unstableContentRef,
	kubioInsertionEdge,
	disableInserter,
	...props
} ) {
	// This is a temporary hack to get the inbetween inserter to recompute properly.
	const [ popoverRecomputeCounter, forcePopoverRecompute ] = useReducer(
		// Module is there to make sure that the counter doesn't overflow.
		( s ) => ( s + 1 ) % MAX_POPOVER_RECOMPUTE_COUNTER,
		0
	);

	const { orientation, rootClientId, isVisible } = useSelect(
		( select ) => {
			const {
				getBlockListSettings,
				getBlockRootClientId,
				isBlockVisible,
			} = select( blockEditorStore );

			const _rootClientId = getBlockRootClientId(
				previousClientId ?? nextClientId
			);
			return {
				orientation:
					getBlockListSettings( _rootClientId )?.orientation ||
					'vertical',
				rootClientId: _rootClientId,
				isVisible: ! isFunction( isBlockVisible )
					? true
					: isBlockVisible( previousClientId ) &&
					  isBlockVisible( nextClientId ),
			};
		},
		[ previousClientId, nextClientId ]
	);
	const previousElement = useBlockElement( previousClientId );
	const nextElement = useBlockElement( nextClientId );
	const isVertical = orientation === 'vertical';
	const style = useMemo( () => {
		if ( ( ! previousElement && ! nextElement ) || ! isVisible ) {
			return {};
		}

		if ( ! ( previousElement || nextElement ) ) {
			return {
				width: 0,
				height: 0,
			};
		}

		const previousRect = previousElement
			? previousElement.getBoundingClientRect()
			: null;
		const nextRect = nextElement
			? nextElement.getBoundingClientRect()
			: null;

		if ( isVertical ) {
			if ( previousRect || nextRect ) {
				const blockList = ( previousElement || nextElement )
					.closest( '.block-editor-block-list__layout' )
					.getBoundingClientRect();

				return {
					width: blockList.width,
					height:
						nextRect && previousRect
							? nextRect.top - previousRect.bottom
							: 0,
				};
			} else {
				return {
					width: 0,
					height: 0,
				};
			}
		}

		let width = 0;
		if ( previousRect && nextRect ) {
			width = isRTL()
				? previousRect.left - nextRect.right
				: nextRect.left - previousRect.right;
		}

		return {
			width,
			height: previousRect ? previousRect.height : nextRect.height,
		};
	}, [ previousElement, nextElement, isVertical, isVisible ] );

	const anchor = useMemo( () => {
		if (
			( ! kubioInsertionEdge && ! previousElement && ! nextElement ) ||
			! isVisible
		) {
			return undefined;
		}

		const extraProps = {};

		const contextElement = previousElement || nextElement;

		if ( isBelowWp6_3 ) {
			extraProps.ownerDocument = contextElement?.ownerDocument;
		}
		return {
			contextElement,
			getBoundingClientRect() {
				if ( ! ( previousElement || nextElement ) ) {
					return new window.DOMRect( 0, 0, 0, 0 );
					// return {
					// 	top: 0,
					// 	left: 0,
					// 	right: 0,
					// 	bottom: 0,
					// 	height: 0,
					// 	width: 0,
					// 	ownerDocument,
					// };
				}

				let previousRect = previousElement
					? previousElement.getBoundingClientRect()
					: null;
				const nextRect = nextElement
					? nextElement.getBoundingClientRect()
					: null;

				if ( kubioInsertionEdge === 'top' ) {
					previousRect = null;
				}

				if ( kubioInsertionEdge === 'bottom' ) {
					previousRect = nextRect;
				}

				const blockListRect = ( previousElement || nextElement )
					.closest( '.block-editor-block-list__layout' )
					?.getBoundingClientRect?.();

				let left =
					( previousRect ? previousRect?.right : nextRect?.right ) ||
					0;
				let right =
					( previousRect ? previousRect?.right : nextRect?.right ) ||
					0;

				if ( blockListRect ) {
					left = blockListRect?.left;
					right = blockListRect?.right;
				}

				if ( isVertical ) {
					if ( isRTL() ) {
						// return {
						// 	top: previousRect ? previousRect.bottom : nextRect.top,
						// 	left,
						// 	right,
						// 	bottom: previousRect ? previousRect.bottom : nextRect.top,
						// 	height: 0,
						// 	width: 0,
						// 	ownerDocument,
						// 	contextElement,
						// };
						const top = previousRect
							? previousRect?.bottom
							: nextRect?.top;
						const bottom = previousRect
							? previousRect?.bottom || 0
							: nextRect?.top || 0;
						const height = 0;
						const width = 0;

						return new window.DOMRect( left, top, width, height );
					}

					// return {
					// 	top: previousRect ? previousRect.bottom : nextRect.top,
					// 	left,
					// 	right,
					// 	bottom: previousRect
					// 		? previousRect.bottom
					// 		: nextRect.top,
					// 	height: 0,
					// 	width: 0,
					// 	ownerDocument,
					// 	contextElement,
					// };
					const height = 0;
					const width = 0;
					const top = previousRect
						? previousRect?.bottom || 0
						: nextRect?.top || 0;
					return new window.DOMRect( left, top, width, height );
				}

				if ( isRTL() ) {
					// return {
					// 	top: previousRect ? previousRect.top : nextRect.top,
					// 	left: previousRect ? previousRect.left : nextRect.right,
					// 	right: previousRect
					// 		? previousRect.left
					// 		: nextRect.right,
					// 	bottom: previousRect ? previousRect.top : nextRect.top,
					// 	height: 0,
					// 	width: 0,
					// 	ownerDocument,
					// 	contextElement,
					// };
					const top =
						( previousRect ? previousRect?.top : nextRect?.top ) ||
						0;
					left =
						( previousRect
							? previousRect?.left
							: nextRect?.right ) || 0;
					const height = 0;
					const width = 0;
					return new window.DOMRect( left, top, width, height );
				}

				// return {
				// 	top: previousRect ? previousRect.top : nextRect.top,
				// 	left: previousRect ? previousRect.right : nextRect.left,
				// 	right: previousRect ? previousRect.right : nextRect.left,
				// 	bottom: previousRect ? previousRect.left : nextRect.right,
				// 	height: 0,
				// 	width: 0,
				// 	ownerDocument,
				// 	contextElement,
				// };
				const top =
					( previousRect ? previousRect?.top : nextRect?.top ) || 0;
				left =
					( previousRect ? previousRect?.right : nextRect?.left ) ||
					0;
				const height = 0;
				const width = 0;
				return new window.DOMRect( left, top, width, height );
			},
			...extraProps,
		};
	}, [
		kubioInsertionEdge,
		previousElement,
		nextElement,
		isVisible,
		isVertical,
	] );

	const popoverScrollRef = usePopoverScroll( __unstableContentRef );

	// This is only needed for a smooth transition when moving blocks.
	useLayoutEffect( () => {
		if ( ! previousElement ) {
			return;
		}
		const observer = new window.MutationObserver( forcePopoverRecompute );
		observer.observe( previousElement, { attributes: true } );

		return () => {
			observer.disconnect();
		};
	}, [ previousElement ] );

	useLayoutEffect( () => {
		if ( ! nextElement ) {
			return;
		}
		const observer = new window.MutationObserver( forcePopoverRecompute );
		observer.observe( nextElement, { attributes: true } );

		return () => {
			observer.disconnect();
		};
	}, [ nextElement ] );

	useLayoutEffect( () => {
		if ( ! previousElement ) {
			return;
		}
		previousElement.ownerDocument.defaultView.addEventListener(
			'resize',
			forcePopoverRecompute
		);
		return () => {
			previousElement.ownerDocument.defaultView.removeEventListener(
				'resize',
				forcePopoverRecompute
			);
		};
	}, [ previousElement ] );

	// If there's either a previous or a next element, show the inbetween popover.
	// Note that drag and drop uses the inbetween popover to show the drop indicator
	// before the first block and after the last block.
	if ( ( ! previousElement && ! nextElement ) || ! isVisible ) {
		return null;
	}

	/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
	// While ideally it would be enough to capture the
	// bubbling focus event from the Inserter, due to the
	// characteristics of click focusing of `button`s in
	// Firefox and Safari, it is not reliable.
	//
	// See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
	return (
		<Popover
			ref={ popoverScrollRef }
			animate={ false }
			anchor={ anchor }
			focusOnMount={ false }
			// Render in the old slot if needed for backward compatibility,
			// otherwise render in place (not in the default popover slot).
			__unstableSlotName={ __unstablePopoverSlot || null }
			// Forces a remount of the popover when its position changes
			// This makes sure the popover doesn't animate from its previous position.
			key={ nextClientId + '--' + rootClientId }
			{ ...props }
			className={ classnames(
				'block-editor-block-popover',
				'block-editor-block-popover__inbetween',
				kubioInsertionEdge
					? `kubio-editor-block-popover__inbetween-${ kubioInsertionEdge }`
					: '',
				{
					'kubio-inserter-popup-disabled': disableInserter,
				},
				props.className
			) }
			resize={ false }
			flip={ false }
			placement="bottom-start"
			variant="unstyled"
		>
			<div
				className="block-editor-block-popover__inbetween-container"
				style={ style }
			>
				{ children }
			</div>
		</Popover>
	);
	/* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
}

export default BlockPopoverInbetween;
