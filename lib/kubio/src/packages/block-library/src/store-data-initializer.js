import { useCallback, useEffect } from '@wordpress/element';
import { subscribe } from '@wordpress/data';
import { useDebounce } from '@wordpress/compose';
import { reactRender } from '@kubio/core';

const StoreDataInitilizer = () => {
	// load contact form and page templates a bit later, allow the page to load first
	const init = useDebounce(
		useCallback( ( unsubscribe ) => {
			unsubscribe();
		}, [] ),
		2500
	);

	useEffect( () => {
		const unsubscribe = subscribe( () => init( unsubscribe ) );
		return () => unsubscribe();
	}, [] );
	return <></>;
};

const initialize = () => {
	const container = document.createElement( 'div' );
	reactRender( <StoreDataInitilizer />, container );
};

export default initialize;
