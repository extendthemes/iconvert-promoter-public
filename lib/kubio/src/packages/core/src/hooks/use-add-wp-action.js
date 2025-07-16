import { useEffect, useRef } from '@wordpress/element';
import { addAction, removeAction } from '@wordpress/hooks';
import shortid from 'shortid';

export const useAddWPAction = ( action, onTrigger ) => {
	const actionTriggerRef = useRef( onTrigger );
	const actionNamespace = useRef(
		`kubio.react.action-hook.${ shortid.generate() }`
	);

	actionTriggerRef.current = onTrigger;

	useEffect( () => {
		const namespace = actionNamespace.current;
		addAction( action, namespace, ( ...args ) => {
			onTrigger( ...args );
		} );

		return () => {
			removeAction( action, namespace );
		};
	}, [ action, onTrigger ] );
};
