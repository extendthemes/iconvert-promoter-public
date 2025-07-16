import { useCallback, useEffect } from '@wordpress/element';
import { isFunction } from 'lodash';

const useEffectAsync = (asynCallback, deps = []) => {
	const effect = useCallback(asynCallback, [...deps]);

	useEffect(() => {
		let mounted = true;
		const isMounted = () => mounted;
		const onUnmount = effect(isMounted);

		return () => {
			if (isFunction(onUnmount)) {
				onUnmount();
			}
			mounted = false;
		};
	}, [effect, ...deps]);
};

export { useEffectAsync };
