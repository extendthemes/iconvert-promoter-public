import {
	__experimentalRecursionProvider as DefaultRecursionProvider,
	__experimentalUseHasRecursion,
	useHasRecursion as internalUseHasRecursion,
	__experimentalUseNoRecursiveRenders as useDefaultNoRecursiveRenders,
} from '@wordpress/block-editor';

import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { useRef } from '@wordpress/element';
const useHasRecursion = internalUseHasRecursion || __experimentalUseHasRecursion;
let useNoRecursiveRenders = useDefaultNoRecursiveRenders;

if (DefaultRecursionProvider) {
	useNoRecursiveRenders = (uniqueId) => {
		const hasAlreadyRendered = useHasRecursion(uniqueId);
		const provider = useRef();

		if (!provider.current) {
			provider.current = compose(
				createHigherOrderComponent(
					(WrappedComponent) => (props) => {
						return (
							<WrappedComponent {...props} uniqueId={uniqueId} />
						);
					},
					'withKubioRecursionProvider'
				)
			)(DefaultRecursionProvider);
		}

		return [hasAlreadyRendered, provider.current];
	};
}

export { useNoRecursiveRenders };
