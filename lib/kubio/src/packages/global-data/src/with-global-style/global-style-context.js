import { createContext, useContext } from '@wordpress/element';

const defaultValue = {};
const KubioGlobalStyleContext = createContext(defaultValue);
const useKubioGlobalStyleContext = () => {
	return useContext(KubioGlobalStyleContext);
};

export { KubioGlobalStyleContext, useKubioGlobalStyleContext };
