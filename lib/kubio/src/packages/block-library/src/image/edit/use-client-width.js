/**
 * WordPress dependencies
 */
import { useDebounce } from '@wordpress/compose';
import { useCallback, useLayoutEffect, useState } from '@wordpress/element';

export default function useClientWidth(ref) {
	const [clientWidth, setClientWidth] = useState();
	const [width, setWidth] = useState();

	const calculateClientWidth = useDebounce(
		useCallback((resizeObserver) => {
			if (!ref.current) {
				resizeObserver.disconnect();
			}
			if (ref.current?.clientWidth !== undefined) {
				setClientWidth(ref.current.clientWidth);
			}
		}, []),
		100
	);

	useLayoutEffect(() => {
		if (!ref.current) {
			return;
		}

		const resizeObserver = new ResizeObserver(() =>
			calculateClientWidth(resizeObserver)
		);
		resizeObserver.observe(ref.current);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	/**
	 * update state in layout effect after the dom was rendered
	 */
	useLayoutEffect(() => {
		setWidth(clientWidth);
	}, [clientWidth]);

	return { clientWidth: width, calculateClientWidth };
}
