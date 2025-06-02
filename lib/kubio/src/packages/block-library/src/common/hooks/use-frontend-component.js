import { useOwnerDocumentContext } from '@kubio/core';
import { useCallback, useEffect, useState } from '@wordpress/element';
import _, { debounce, noop } from 'lodash';
import { KUBIO_BLOCK_PREFIX } from '@kubio/constants';
const useFrontEndComponent = ({ clientId, ref, componentName }) => {
	const { ownerDocument } = useOwnerDocumentContext();
	const [jqElement, setJqElement] = useState(null);

	const jQuery = ownerDocument?.defaultView?.jQuery;

	useEffect(() => {
		if (!jQuery) {
			return;
		}

		const $element = ref?.current
			? jQuery(ref?.current)
			: jQuery(`[data-block="${clientId}"]`);
		let nextValue = $element.length ? $element : null;
		setJqElement(nextValue);

		if (!nextValue) {
			// retry getting the frontend element
			let attempts = 5;
			const intervalId = setInterval(() => {
				if (!attempts) {
					return;
				}
				attempts--;
				const $nextElement = ref?.current
					? jQuery(ref?.current)
					: jQuery(`[data-block="${clientId}"]`);
				nextValue = $nextElement.length ? $nextElement : null;
				setJqElement(nextValue);
				if (nextValue) {
					clearInterval(intervalId);
				}
			}, 300);

			return () => clearInterval(intervalId);
		}
	}, [ref?.current, clientId, jQuery]);
	const componentNameCamelCase = _.camelCase(componentName);
	const getFrontendComponent = useCallback(
		() =>
			jqElement?.data()[
				`fn.${KUBIO_BLOCK_PREFIX}.${componentNameCamelCase}`
			],
		[jqElement]
	);

	const getFrontendComponentFunction = useCallback(
		(funcName, debounceDuration = 0) => {
			const component = getFrontendComponent();
			const func = component?.[funcName]?.bind(component) || noop;

			if (debounceDuration) {
				return debounce(func, debounceDuration);
			}

			return func;
		},
		[getFrontendComponent]
	);

	return {
		getFrontendComponent,
		getFrontendComponentFunction,
	};
};

export { useFrontEndComponent };
