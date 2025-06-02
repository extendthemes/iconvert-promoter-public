/**
 * WordPress dependencies
 */
import {
	useState,
	useEffect,
	useCallback,
	useRef,
	useLayoutEffect,
} from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';

const useResizeDetector = () => {
	const [ clientWidth, setClientWidth ] = useState( 0 );
	const [ width, setWidth ] = useState( 0 );
	const ref = useRef();

	const calculateClientWidth = useDebounce(
		useCallback( () => {
			setClientWidth( ref.current.clientWidth );
		}, [] ),
		100
	);

	useEffect( () => {
		if ( ! ref.current ) {
			return;
		}

		const ResizeObserver =
			ref.current.ownerDocument.defaultView.ResizeObserver;
		const resizeObserver = new ResizeObserver( calculateClientWidth );
		resizeObserver.observe( ref.current );
		return () => {
			resizeObserver.disconnect();
		};
	}, [ ref.current ] );

	/**
	 * use layout effect to wait for dom rendering
	 */
	useLayoutEffect( () => {
		setWidth( clientWidth );
	}, [ clientWidth ] );

	return { width, ref };
};

export { useResizeDetector };
