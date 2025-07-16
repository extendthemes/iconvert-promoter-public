import { useRef } from '@wordpress/element';
import { useDeepMemo } from './use-deep-memo';

function useGetRefreshKeyBeforeRender( dependencies ) {
	const refreshKeyRef = useRef();
	let dependenciesChanged = false;

	//the useMemo is called exactly when the dependencies are changed.
	//The useEffect runs after the changes have already been rendered. So we can't use it to detect changes before the
	//rendered occurred.
	const memoizedDependencies = useDeepMemo( () => {
		dependenciesChanged = true;
		return dependencies;
	}, [ dependencies ] );

	//The useref does not trigger state refreshes so we can change the ref without the fear of infinit loops
	if ( dependenciesChanged ) {
		refreshKeyRef.current = Math.random();
	}

	return refreshKeyRef.current;
}

export { useGetRefreshKeyBeforeRender };
