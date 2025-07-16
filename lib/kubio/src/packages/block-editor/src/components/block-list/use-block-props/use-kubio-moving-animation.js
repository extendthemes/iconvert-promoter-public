import {
	useLayoutEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from '@wordpress/element';

/**
 * Simple reducer used to increment a counter.
 *
 * @param {number} state Previous counter value.
 * @return {number} New state value.
 */
const counterReducer = ( state ) => state + 1;

const getAbsolutePosition = ( element ) => {
	return {
		top: element.offsetTop,
		left: element.offsetLeft,
	};
};

/**
 * Hook used to compute the styles required to move a div into a new position.
 *
 * The way this animation works is the following:
 *  - It first renders the element as if there was no animation.
 *  - It takes a snapshot of the position of the block to use it
 *    as a destination point for the animation.
 *  - It restores the element to the previous position using a CSS transform
 *  - It uses the "resetAnimation" flag to reset the animation
 *    from the beginning in order to animate to the new destination point.
 *
 * @param {Object}  $1                          Options
 * @param {boolean} $1.isSelected               Whether it's the current block or not.
 * @param {boolean} $1.adjustScrolling          Adjust the scroll position to the current block.
 * @param {boolean} $1.enableAnimation          Enable/Disable animation.
 * @param {*}       $1.triggerAnimationOnChange Variable used to trigger the animation if it changes.
 */
function useKubioMovingAnimation( {
	adjustScrolling,
	triggerAnimationOnChange,
} ) {
	const ref = useRef();
	const previous = useMemo(
		() => ( ref.current ? getAbsolutePosition( ref.current ) : null ),
		[ triggerAnimationOnChange ]
	);

	// Calculate the previous position of the block relative to the viewport and
	// return a function to maintain that position by scrolling.
	const preserveScrollPosition = useMemo( () => {
		if ( ! adjustScrolling || ! ref.current ) {
			return () => {};
		}

		const win = ref.current.ownerDocument.defaultView;

		if ( ! win ) {
			return () => {};
		}

		let prevTop = ref.current.getBoundingClientRect().top;
		return () => {
			const blockTop = ref.current.getBoundingClientRect().top;
			const diff = blockTop - prevTop;

			if ( diff ) {
				prevTop = blockTop;
				win.scrollBy( 0, diff );
			}
		};
	}, [ triggerAnimationOnChange, adjustScrolling ] );

	useLayoutEffect( () => {
		if ( ! previous ) {
			return;
		}
		preserveScrollPosition();
	}, [ triggerAnimationOnChange ] );

	return ref;
}

export { useKubioMovingAnimation };
