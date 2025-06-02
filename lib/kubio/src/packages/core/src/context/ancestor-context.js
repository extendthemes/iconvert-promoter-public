import { createContext, useContext } from '@wordpress/element';
import { noop } from 'lodash';

const AncestorContext = createContext( {
	setAncestor: noop,
	ancestor: '',
} );

const useAncestorContext = () => {
	return useContext( AncestorContext );
};

export { AncestorContext, useAncestorContext };
