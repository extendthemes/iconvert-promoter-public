/**
 * External dependencies
 */
import { debounce, merge } from 'lodash';
import { useMemoOne } from 'use-memo-one';

/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

function useDebounce( fn, wait, options, useDebounceOptions = {} ) {
	const useDebounceOptionsDefaultOptions = {
		flushOnRecreation: true,
		cancelOnUnMount: true,
	};
	const mergedUseDebouncedOptions = merge(
		{},
		useDebounceOptionsDefaultOptions,
		useDebounceOptions
	);
	const { flushOnRecreation, cancelOnUnMount } = mergedUseDebouncedOptions;

	const debounced = useMemoOne(
		() => debounce( fn, wait, options ),
		[ fn, wait, options ]
	);

	const unmounting = useRef( false );

	//hook to know when unmounting
	useEffect( () => {
		return () => {
			unmounting.current = true;
		};
	}, [] );

	useEffect( () => {
		return () => {
			//on unmount cancel the to stop side effects from happening. For example on debounce the masonry script will
			//apply to the blog layout. We don't want to run debounce calls fi the component gets destroyed. There is an
			//option to overwrite this logic if it's needed in some places like ui controls
			if ( cancelOnUnMount && unmounting.current ) {
				debounced.cancel();
				return;
			}
			if ( flushOnRecreation ) {
				debounced.flush();
			} else {
				debounced.cancel();
			}
		};
	}, [ debounced ] );

	return debounced;
}

export { useDebounce };
