import { useIsomorphicLayoutEffect } from '@wordpress/compose';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';

const useDragging = ( { onDragStart, onDragMove, onDragEnd } ) => {
	const [ isDragging, setIsDragging ] = useState( false );
	const document = useRef();

	const eventsRef = useRef( {
		onDragStart,
		onDragMove,
		onDragEnd,
	} );
	useIsomorphicLayoutEffect( () => {
		eventsRef.current.onDragStart = onDragStart;
		eventsRef.current.onDragMove = onDragMove;
		eventsRef.current.onDragEnd = onDragEnd;
	}, [ onDragStart, onDragMove, onDragEnd ] );

	const onMouseMove = useCallback( ( /** @type {MouseEvent} */ event ) => {
		if ( eventsRef.current.onDragMove ) {
			event.preventDefault();
			event.stopPropagation();
			event?.stopImmediatePropagation();
			eventsRef.current.onDragMove( event );
		}
	}, [] );
	const endDrag = useCallback( ( /** @type {MouseEvent} */ event ) => {
		if ( eventsRef.current.onDragEnd ) {
			eventsRef.current.onDragEnd( event );
		}
		document.current.removeEventListener( 'mousemove', onMouseMove );
		document.current.removeEventListener( 'mouseup', endDrag );
		setIsDragging( false );
	}, [] );
	const startDrag = useCallback( ( /** @type {MouseEvent} */ event ) => {
		if ( eventsRef.current.onDragStart ) {
			eventsRef.current.onDragStart( event );
		}
		document.current = event.target.ownerDocument;
		document.current.addEventListener( 'mousemove', onMouseMove );
		document.current.addEventListener( 'mouseup', endDrag );
		setIsDragging( true );
	}, [] );

	// Remove the global events when unmounting if needed.
	useEffect( () => {
		return () => {
			if ( isDragging ) {
				document.current.removeEventListener(
					'mousemove',
					onMouseMove
				);
				document.current.removeEventListener( 'mouseup', endDrag );
			}
		};
	}, [ isDragging ] );

	return {
		startDrag,
		endDrag,
		isDragging,
	};
};

export { useDragging };
