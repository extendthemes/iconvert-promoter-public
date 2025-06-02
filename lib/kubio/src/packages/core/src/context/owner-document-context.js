import { createContext, useContext } from '@wordpress/element';
import { noop } from 'lodash';

const OwnerDocumentContext = createContext( {
	ownerDocument: null,
	setOwnerDocument: noop,
} );

const useOwnerDocumentContext = () => {
	return useContext( OwnerDocumentContext );
};

export { OwnerDocumentContext, useOwnerDocumentContext };
