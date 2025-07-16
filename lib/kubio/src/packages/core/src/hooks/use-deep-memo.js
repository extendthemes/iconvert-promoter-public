import { useCallback, useEffect, useMemo, useRef } from '@wordpress/element';
import isEqual from 'react-fast-compare';

const useDeepCompareMemoize = ( value = [] ) => {
	const ref = useRef( [] );
	if ( ! isEqual( ref.current, value ) ) {
		ref.current = value;
	}
	return ref.current;
};

//react's use memo compares references for array/objects because of this we use a ref to store the current reference
//and only change the reference when the value of the object changes using a deep compare method.
const useDeepMemo = ( callback, dependencies ) => {
	const memoisedDependencies = useDeepCompareMemoize( dependencies );
	return useMemo( callback, memoisedDependencies );
};

const useEffectDeep = ( callback, dependencies ) => {
	const memoisedDependencies = useDeepCompareMemoize( dependencies );
	return useEffect( callback, memoisedDependencies );
};

const useDeepCallback = ( callback, dependencies ) => {
	const memoisedDependencies = useDeepCompareMemoize( dependencies );
	return useCallback( callback, memoisedDependencies );
};

export { useDeepMemo, useDeepCallback, useEffectDeep };
