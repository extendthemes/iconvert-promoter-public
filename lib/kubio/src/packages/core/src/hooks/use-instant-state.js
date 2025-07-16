import { useCallback, useEffect, useRef, useState } from '@wordpress/element';

//this is the same same as useState the only differences are that the value changes instantly and when you are using the
//value you need to use with  ".current" to get the current data.
//The setter also forces a refresh so the component rerenders
const useInstantState = ( initialState ) => {
	const stateRef = useRef( initialState );
	const [ forceRefreshState, setForceRefreshState ] = useState();

	const onForceRefresh = useCallback( () => {
		setForceRefreshState( Math.random() );
	}, [ setForceRefreshState ] );

	const onChangeState = useCallback(
		( newValue ) => {
			stateRef.current = newValue;
			onForceRefresh();
		},
		[ stateRef, onForceRefresh ]
	);

	return [ stateRef, onChangeState, forceRefreshState ];
};

export { useInstantState };
