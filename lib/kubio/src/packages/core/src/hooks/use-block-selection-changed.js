import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { noop } from 'lodash';

const useBlockSelectionChanged = ( onChange = noop ) => {
	const selectedClientId = useSelect( ( select ) =>
		select( 'core/block-editor' ).getSelectedBlockClientId()
	);

	const [ storedSelectedClientId, setStoredSelectedClientId ] =
		useState( selectedClientId );

	useEffect( () => {
		if ( storedSelectedClientId !== selectedClientId ) {
			setStoredSelectedClientId( selectedClientId );
			onChange( selectedClientId );
		}
	}, [ selectedClientId ] );
};

export { useBlockSelectionChanged };
