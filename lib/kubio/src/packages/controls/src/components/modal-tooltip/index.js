import { useCallback, useEffect, useRef } from '@wordpress/element';

const { memo, createPortal } = require('@wordpress/element');
import { createPopper } from '@popperjs/core';

const ModalTooltip = memo(({ anchorRef, children }) => {
	const tooltipRef = useRef();
	const popperInstanceRef = useRef();

	const enableTooltip = useCallback(() => {
		const node = tooltipRef?.current;
		const popperInstance = popperInstanceRef.current;
		if (!node || !popperInstance) {
			return;
		}

		node.removeAttribute('data-hidden');

		popperInstance?.setOptions((options) => ({
			...options,
			modifiers: [
				...options.modifiers,
				{ name: 'eventListeners', enabled: true },
			],
		}));

		// Update its position
		popperInstance?.update();
	}, [popperInstanceRef, tooltipRef?.current]);

	const disableTooltip = useCallback(() => {
		const node = tooltipRef?.current;
		const popperInstance = popperInstanceRef.current;
		if (!node || !popperInstance) {
			return;
		}

		node.setAttribute('data-hidden', '');

		//https://popper.js.org/docs/v2/tutorial/#performance
		//disable event listeners of the popperjs when element is not hovered
		popperInstance?.setOptions((options) => ({
			...options,
			modifiers: [
				...options.modifiers,
				{ name: 'eventListeners', enabled: false },
			],
		}));
	}, [tooltipRef.current]);

	useEffect(() => {
		if (anchorRef?.current && tooltipRef?.current) {
			const popperInstance = createPopper(
				anchorRef?.current,
				tooltipRef?.current,
				{
					placement: 'top',
					modifiers: [
						{
							name: 'offset',
							options: {
								offset: [0, 10],
							},
						},
					],
				}
			);
			popperInstanceRef.current = popperInstance;
			disableTooltip();
		}
		return () => {
			popperInstanceRef.current?.destroy();
			popperInstanceRef.current = null;
		};
	}, [anchorRef?.current, tooltipRef?.current, disableTooltip]);

	useEffect(() => {
		// const showEvents = ['mouseenter', 'focus'];
		// const hideEvents = ['mouseleave', 'blur'];
		const node = anchorRef?.current;
		if (node) {
			node.addEventListener('mouseenter', enableTooltip);
			node.addEventListener('mouseleave', disableTooltip);
		}
		return () => {
			const node = anchorRef?.current;
			if (node) {
				node.removeEventListener('mouseenter', enableTooltip);
				node.removeEventListener('mouseleave', disableTooltip);
			}
		};
	}, [anchorRef?.current, enableTooltip, disableTooltip]);

	return createPortal(
		<div className="kubio-modal-tooltip" ref={tooltipRef} data-hidden>
			{children}
		</div>,
		document.body
	);
});

export { ModalTooltip };
