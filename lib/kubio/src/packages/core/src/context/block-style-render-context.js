import { createContext, useContext } from '@wordpress/element';

const defaultValue = {
	style: null,
	parentStyle: null,
};

const KubioBlockStyleContext = createContext( defaultValue );

const useKubioBlockStyleContext = () => {
	return useContext( KubioBlockStyleContext );
};

export { KubioBlockStyleContext, useKubioBlockStyleContext };
