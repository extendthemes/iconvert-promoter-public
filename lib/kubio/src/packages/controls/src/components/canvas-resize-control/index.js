import { useDragging } from '@kubio/core';
import { Icon } from '@wordpress/components';
import { useDebounce, useThrottle } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	createPortal,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import { dragHandle } from '@wordpress/icons';
import classNames from 'classnames';
import _, { noop } from 'lodash';

const snapTresholdDefault = 5;
const snapDragTresholdDefault = 30;
const decimals = 2;
const MODIFIED_SIBLING_ATTRIBUTE = 'data-kubio-canvas-resize-modified';
const MIN_VALUE = 50;

const preventDefault = ( event ) => {
	event.preventDefault();
	event.stopPropagation();
};

const toggleBodyClass = ( document, value ) => {
	const fn = value ? 'add' : 'remove';

	document.body.classList[ fn ]( 'kubio-resize-control--resizing' );
	if ( top.document !== document ) {
		top.document.body.classList[ fn ]( 'kubio-resize-control--resizing' );
	}
};

const isOnSameLine = ( source, target, direction ) => {
	let onSameLine = false;
	if ( direction === 'horizontal' ) {
		const targetTop = target.getBoundingClientRect().top;
		const targetBottom = target.getBoundingClientRect().bottom;

		const sourceTop = source.getBoundingClientRect().top;
		const sourceBottom = source.getBoundingClientRect().bottom;

		if ( targetTop >= sourceTop && targetTop < sourceBottom ) {
			onSameLine = true;
		}

		if ( sourceTop >= targetTop && sourceTop < targetBottom ) {
			onSameLine = true;
		}
	}

	return onSameLine;
};

const getAffectedSibling = ( el, direction ) => {
	if ( el.nextSibling ) {
		const next = el.nextSibling;
		if ( isOnSameLine( el, next, direction ) ) {
			return next;
		}
	}

	return null;
};

const getDimensionValue = ( el, direction, int = false ) => {
	let value = 0;
	if ( direction === 'horizontal' ) {
		value = el.getBoundingClientRect().width;
	} else {
		value = el.getBoundingClientRect().height;
	}
	return int ? parseFloat( value ) : value;
};

/**
 *
 * @param {HTMLElement} el
 * @param {string}      direction
 */
const getMaxValueAccountingSiblings = ( el, direction ) => {
	const parentDimension = getDimensionValue( el.parentElement, direction );
	const siblingsDimension = Array.from( el.parentElement.children ).reduce(
		( acc, item ) => {
			if ( item !== el && isOnSameLine( el, item, direction ) ) {
				acc += getDimensionValue( item, direction );
			}

			return acc;
		},
		0
	);

	return parentDimension - siblingsDimension;
};

const getSnapPosition = (
	dimention,
	parentDimention,
	snapPoints = [],
	snapTreshold = 0,
	fixedSnappingPoints = []
) => {
	let snapped = null;
	const points = snapPoints
		.map( ( point ) => ( point.value / 100 ) * parentDimention )
		.concat( fixedSnappingPoints.map( ( point ) => point.value ) )
		.sort();

	for ( let i = 0; i < points.length; i++ ) {
		const snapValue = points[ i ];

		if (
			dimention >= snapValue - snapTreshold &&
			dimention <= snapValue + snapTreshold
		) {
			snapped = snapValue;
			break;
		}
	}

	return snapped;
};

const getSnapPositionLabel = (
	dimention,
	parentDimention,
	snapPoints = [],
	fixedSnappingPoints = []
) => {
	let label = null;
	const snapTreshold = 1;
	const points = snapPoints
		.map( ( point ) => ( {
			label: point.label,
			value: ( point.value / 100 ) * parentDimention,
		} ) )
		.concat( fixedSnappingPoints );

	for ( let i = 0; i < points.length; i++ ) {
		const snapValue = points[ i ].value;

		if (
			dimention >= snapValue - snapTreshold &&
			dimention <= snapValue + snapTreshold
		) {
			label = points[ i ].label;
			break;
		}
	}

	return label;
};

const getMousePosition = ( event, direction ) => {
	if ( direction === 'horizontal' ) {
		return event.screenX;
	}
	return event.screenY;
};

const applyDimensionDiff = (
	el,
	direction,
	diff,
	{
		container,
		maxToContainer,
		sibling,
		snapPoints = [],
		snapTreshold = snapTresholdDefault,
		snapDragTreshold = snapDragTresholdDefault,
		fixedSnappingPoints = [],
	} = {}
) => {
	if ( ! diff ) {
		return {
			isSnapped: false,
		};
	}

	const currentValue = getDimensionValue( el, direction );
	const maxValue = getMaxValueAccountingSiblings( el, direction );

	let nextValue = currentValue - diff;
	let siblingDiff = diff;

	if ( nextValue < MIN_VALUE ) {
		nextValue = MIN_VALUE;
		siblingDiff = currentValue - nextValue;
	}

	const containerValue = getDimensionValue( container, direction );

	const currentSnap = getSnapPosition(
		currentValue,
		containerValue,
		snapPoints,
		Math.max( 2, snapTreshold - 1 ), // set +/- 1px treshold to accomodate truncated values decimals
		fixedSnappingPoints
	);
	let isSnapped = !! currentSnap;

	if ( isSnapped ) {
		if ( Math.abs( diff ) > snapDragTreshold ) {
			nextValue = currentValue - Math.sign( diff ) * ( snapTreshold + 1 );
			siblingDiff = currentValue - nextValue;
		} else {
			nextValue = currentSnap;
			siblingDiff = 0;
		}
	} else {
		const snapPosition = getSnapPosition(
			nextValue,
			containerValue,
			snapPoints,
			snapTreshold,
			fixedSnappingPoints
		);

		if ( !! snapPosition ) {
			nextValue = snapPosition;
			siblingDiff = currentValue - nextValue;
			isSnapped = true;
		}
	}

	if ( maxToContainer ) {
		nextValue = Math.min( nextValue, containerValue );
		if ( containerValue === nextValue ) {
			siblingDiff = 0;
		}

		if ( nextValue < maxValue && nextValue > currentValue ) {
			siblingDiff = 0;
		}

		// if is the last element don't allow it to exceed the container size ( wrap for horizontal layout )
		if ( nextValue >= maxValue && ! sibling ) {
			nextValue = maxValue;
		}
	}

	let siblingNextValue = null;

	if ( sibling && siblingDiff ) {
		siblingNextValue =
			getDimensionValue( sibling, direction ) + siblingDiff;

		if ( siblingNextValue < MIN_VALUE ) {
			nextValue = nextValue - ( MIN_VALUE - siblingNextValue );
			siblingNextValue = MIN_VALUE;
		}
	}

	const affectedProps =
		direction === 'horizontal'
			? [ 'minWidth', 'width', 'maxWidth' ]
			: [ 'minHeight', 'height', 'maxHeight' ];

	affectedProps.forEach( ( dimention ) => {
		el.style[ dimention ] = nextValue + 'px';
	} );

	if ( siblingNextValue !== null ) {
		sibling.setAttribute( MODIFIED_SIBLING_ATTRIBUTE, true );
		affectedProps.forEach( ( dimention ) => {
			sibling.style[ dimention ] = siblingNextValue + 'px';
		} );
	}

	return {
		isSnapped,
		value: nextValue,
	};
};

const resetContainerProp = ( el, direction, instant = false ) => {
	const dimentions =
		direction === 'horizontal'
			? [ 'minWidth', 'width', 'maxWidth' ]
			: [ 'minHeight', 'height', 'maxHeight' ];
	return setTimeout(
		() => {
			dimentions.forEach( ( dimention ) => {
				if ( el?.style ) {
					el.style[ dimention ] = '';
				}
			} );
		},
		instant ? 0 : 1000
	);
};

/**
 *
 * @param {Object}                  param0
 * @param {import('react').Ref}     param0.containerRef     ref of element to be resized
 * @param {boolean}                 param0.enabled          determine if the resizer should be displayed or not
 * @param {'horizontal'|'vertical'} param0.direction        resizer direction horizontal or vertical
 * @param {Function}                param0.onChange         callback for drag stop event
 * @param {boolean}                 param0.maxToContainer   stop resizing to container parentElement
 * @param {string}                  param0.clientId         block clientId
 * @param {*}                       param0.referance        used to trigger the inline style remover ( can be the block current dimension value )
 * @param {string|Array|Object}     param0.className
 * @param {boolean}                 param0.affectNext
 * @param {boolean}                 param0.forceVisible
 * @param {Array}                   param0.snapPoints
 * @param {number}                  param0.snapTreshold
 * @param {number}                  param0.snapDragTreshold
 * @param {string}                  param0.tooltipUnit
 * @return {JSXElement}
 */
const CanvasResizeControl = ( {
	containerRef,
	enabled = false,
	direction = 'horizontal',
	onChange = noop,
	maxToContainer = false,
	clientId = null,
	referance = null,
	className = null,
	affectNext = false,
	forceVisible = false,
	snapPoints: snapPoints = [],
	snapTreshold = snapTresholdDefault,
	snapDragTreshold = snapDragTresholdDefault,
	tooltipUnit = 'px',
} ) => {
	const resizerRef = useRef();
	const fixedSnappingPoints = useRef();
	const [ isVisible, setIsVisible ] = useState( false );
	const [ tooltipDimensions, setTooltipDimensions ] = useState( {
		px: null,
		percent: null,
	} );
	const initialDimensionRef = useRef();
	const prevMousePositionRef = useRef();
	const cancelMouseLeave = useRef( false );
	const siblingRef = useRef();

	const affectSiblings = affectNext && direction === 'horizontal';

	const onChangeRef = useRef();
	onChangeRef.current = onChange;

	const { selectBlock } = useDispatch( 'core/block-editor' );

	const updateTooltipDimensions = () => {
		const value = getDimensionValue(
			containerRef.current,
			direction,
			true
		);
		const containerValue = getDimensionValue(
			containerRef.current.parentElement,
			direction,
			true
		);
		setTooltipDimensions( {
			snapPointLabel: getSnapPositionLabel(
				value,
				containerValue,
				snapPoints,
				fixedSnappingPoints.current.points
			),
			px: value.toFixed( 0 ),
			percent: ( ( value * 100 ) / containerValue ).toFixed( decimals ),
		} );
	};

	const onMouseMove = useThrottle(
		useCallback( () => {
			cancelMouseLeave.current = true;
			setIsVisible( true );
		}, [] ),
		300
	);

	const onMouseLeave = useDebounce(
		useCallback( () => {
			onMouseMove.cancel();
			setIsVisible( false );
		}, [] ),
		50
	);

	const moved = useRef( false );
	const resetTimeout = useRef( false );

	const onDragStart = useCallback( ( event ) => {
		if ( resetTimeout.current ) {
			clearTimeout( resetTimeout.current );
		}

		resetTimeout.current = null;
		moved.current = false;
		top.document.addEventListener( 'keydown', onKeyDown );
		prevMousePositionRef.current = getMousePosition( event, direction );
		fixedSnappingPoints.current = {
			points: [
				{
					label: __( 'Initial value', 'kubio' ),
					value: getDimensionValue( containerRef.current, direction ),
				},
			],
			display: false,
		};

		siblingRef.current = affectSiblings
			? getAffectedSibling( containerRef.current, direction )
			: null;
		initialDimensionRef.current = getDimensionValue(
			containerRef.current,
			direction
		);
		containerRef.current.classList.add( 'is-selected' );
		toggleBodyClass( event.target.ownerDocument, true );
		updateTooltipDimensions();
	}, [] );

	const onDragMove = useCallback( ( event ) => {
		moved.current = true;
		containerRef.current.classList.add( 'is-selected' );

		const nextPosition = getMousePosition( event, direction );
		const diff = prevMousePositionRef.current - nextPosition;

		const { isSnapped } = applyDimensionDiff(
			containerRef.current,
			direction,
			diff,
			{
				container: containerRef.current.parentElement,
				maxToContainer,
				sibling: siblingRef.current,
				snapPoints,
				snapTreshold,
				snapDragTreshold,
				fixedSnappingPoints: fixedSnappingPoints.current.display
					? fixedSnappingPoints.current.points
					: [],
			}
		);

		// don't update the mouse position while locked in a snap point to accumulate distance from it in the diff variable
		if ( ! isSnapped ) {
			prevMousePositionRef.current = nextPosition;
		}

		// display fixed snapping points ( max and initial ) after the element is dragged outside the treshold
		const currentValue = getDimensionValue(
			containerRef.current,
			direction
		);
		const isLess =
			currentValue + snapDragTreshold + 10 < initialDimensionRef.current;
		const isMore =
			currentValue - snapDragTreshold - 10 > initialDimensionRef.current;

		if ( isLess || isMore ) {
			fixedSnappingPoints.current.display = true;
		}

		updateTooltipDimensions();
	}, [] );

	const onDragEnd = useCallback( ( event ) => {
		toggleBodyClass( containerRef.current.ownerDocument, false );
		top.document.removeEventListener( 'keydown', onKeyDown );

		if ( ! event || ! moved.current ) {
			return;
		}
		moved.current = false;

		const updateSiblig =
			affectSiblings &&
			siblingRef.current &&
			siblingRef.current?.getAttribute?.(
				'data-kubio-canvas-resize-modified'
			);

		siblingRef.current?.removeAttribute?.(
			'data-kubio-canvas-resize-modified'
		);

		onChangeRef.current( {
			initial: initialDimensionRef.current,
			current: getDimensionValue( containerRef.current, direction, true ),
			sibling: updateSiblig
				? {
						element: siblingRef.current,
						current: getDimensionValue(
							siblingRef.current,
							direction
						),
				  }
				: null,
		} );
		if ( clientId ) {
			selectBlock( clientId );
		}
	}, [] );

	const { startDrag, isDragging, endDrag } = useDragging( {
		onDragStart,
		onDragMove,
		onDragEnd,
	} );

	const cancelDragging = useCallback( () => {
		if ( containerRef.current ) {
			resetTimeout.current = resetContainerProp(
				containerRef.current,
				direction,
				true
			);
			if ( siblingRef.current ) {
				resetTimeout.current = resetContainerProp(
					siblingRef.current,
					direction,
					true
				);
			}
		}
		endDrag();
	}, [ endDrag ] );

	const onKeyDown = useCallback(
		( event ) => {
			if ( event.which === 27 ) {
				cancelDragging();
			}
		},
		[ cancelDragging ]
	);

	useEffect( () => {
		if ( containerRef.current ) {
			resetTimeout.current = resetContainerProp(
				containerRef.current,
				direction
			);
			if ( siblingRef.current ) {
				resetTimeout.current = resetContainerProp(
					siblingRef.current,
					direction
				);
			}
		}
	}, [ referance ] );

	useLayoutEffect( () => {
		const node = containerRef.current;
		node?.addEventListener( 'mouseleave', onMouseLeave );
		node?.addEventListener( 'mousemove', onMouseMove );

		return () => {
			node?.removeEventListener( 'mouseleave', onMouseLeave );
			node?.removeEventListener( 'mousemove', onMouseMove );
		};
	}, [ containerRef.current ] );

	useLayoutEffect( () => {
		const node = resizerRef.current;
		node?.addEventListener( 'focusin', preventDefault );

		return () => {
			node?.addEventListener( 'focusin', preventDefault );
		};
	}, [ resizerRef.current ] );

	let tooltipLabel = `${ tooltipDimensions.px }px`;

	if ( tooltipDimensions.percent && tooltipUnit === '%' ) {
		tooltipLabel = `${ tooltipDimensions.percent }%`;
	}
	if ( tooltipDimensions.snapPointLabel ) {
		tooltipLabel = `${ tooltipDimensions.snapPointLabel }<br/>${ tooltipLabel }`;
	}

	return (
		enabled && (
			<>
				{ /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */ }
				<div
					onMouseDown={ startDrag }
					ref={ resizerRef }
					tabIndex="0"
					className={ classNames(
						`kubio-canvas-resize kubio-canvas-resize__${ direction }`,
						{
							'kubio-canvas-resize--display':
								isVisible || isDragging || forceVisible,
						},
						className
					) }
				>
					<p
						className={ classNames(
							`kubio-canvas-resize__tooltip`,
							{
								'kubio-canvas-resize__tooltip--display':
									isDragging,
							}
						) }
					>
						<span
							dangerouslySetInnerHTML={ { __html: tooltipLabel } }
						/>
					</p>
					<Icon icon={ dragHandle } />
				</div>

				{ isDragging &&
					createPortal(
						<>
							{ /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */ }
							<div
								onMouseDown={ endDrag }
								className={ `kubio-canvas-resize__overlay kubio-canvas-resize__overlay--${ direction }` }
							/>
						</>,
						containerRef.current.ownerDocument.body
					) }
			</>
		)
	);
};

export { CanvasResizeControl };
