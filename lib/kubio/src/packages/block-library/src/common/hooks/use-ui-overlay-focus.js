import { useCallback, useEffect, useRef } from '@wordpress/element';
import { debounce, isString } from 'lodash';

const useUIOverlayFocus = ({
	element,
	executionDelay = 300,
	scrollInView = false,
} = {}) => {
	const timeoutId = useRef();

	const showOverlay = useCallback((node) => {
		if (node) {
			node.classList.add('kubio-focus-animation');
			if (scrollInView) {
				node.scrollIntoView({
					behavior: 'smooth',
				});
			}
			timeoutId.current = setTimeout(() => {
				node.classList.remove('kubio-focus-animation');
			}, 2000);

			return () => clearTimeout(timeoutId);
		}
	}, []);

	const debouncedShowOverlay = useCallback(
		debounce((node) => {
			if (isString(node)) {
				node = document.querySelector(node);
			}
			showOverlay(node);
		}, executionDelay),
		[]
	);

	useEffect(() => {
		if (element) {
			showOverlay(element);
		}

		return () => timeoutId.current && clearTimeout(timeoutId.current);
	}, [element, timeoutId]);

	return { showOverlay, debouncedShowOverlay };
};

export { useUIOverlayFocus };
