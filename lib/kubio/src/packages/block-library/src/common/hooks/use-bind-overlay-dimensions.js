import {
	useEffect,
	useRef,
	useState,
	useCallback,
	useLayoutEffect,
} from '@wordpress/element';
import { each /* , isEqual */ } from 'lodash';

import isEqual from 'react-fast-compare';

import { useDebounce } from '@wordpress/compose';

const getDimension = (container, element, offset = 0) => {
	const blockContainerRect = container.getBoundingClientRect();
	const elementRect = element.getBoundingClientRect();
	return {
		left: elementRect.x - blockContainerRect.x - offset,
		top: elementRect.y - blockContainerRect.y - offset,
		width: elementRect.width + 2 * offset,
		height: elementRect.height + 2 * offset,
	};
};

const getOverlayDimensions = (currentElement, bindElement, offset) =>
	currentElement && bindElement
		? getDimension(currentElement, bindElement, offset)
		: {};

const useBindOverlayDimensions = ({
	clientId,
	containerRef,
	bindToRef,
	offset = 0,
}) => {
	const [overlayStyle, setOverlayStyle] = useState({ display: 'none' });
	const styleEl = useRef();

	const updateOverlayStyle = useDebounce(
		useCallback(() => {
			const style = getOverlayDimensions(
				containerRef.current,
				bindToRef.current,
				offset
			);
			if (!isEqual(overlayStyle, style)) {
				setOverlayStyle(style);
			}
		}, [overlayStyle]),
		100
	);

	useEffect(() => {
		if (!styleEl.current) {
			styleEl.current = document.createElement('style');
			document.head.appendChild(styleEl.current);
			return () => {
				styleEl.current.remove?.();
			};
		}
	}, []);

	useLayoutEffect(() => {
		if (containerRef?.current && bindToRef?.current) {
			containerRef?.current?.addEventListener(
				'mouseenter',
				updateOverlayStyle
			);

			containerRef?.current?.addEventListener(
				'transitionend',
				updateOverlayStyle
			);

			return () => {
				containerRef?.current?.removeEventListener(
					'mouseenter',
					updateOverlayStyle
				);
				containerRef?.current?.removeEventListener(
					'transitionend',
					updateOverlayStyle
				);
			};
		}
	}, []);

	useEffect(() => {
		let styleText = '';

		if (!styleEl.current) {
			return;
		}

		each(overlayStyle, (value, key) => {
			styleText += `${key}:${value}px; `;
		});

		styleEl.current.textContent = `#block-${clientId}:after{ ${styleText} }`;
	}, [overlayStyle]);
};

export { useBindOverlayDimensions };
