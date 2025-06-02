import { createContext, useContext, useMemo } from '@wordpress/element';
import { deepmergeAll } from '@kubio/utils';

const defaultValue = {};
const KubioInheritedStyleContext = createContext(defaultValue);

const useKubioInheritedStyleContext = ({ style } = {}) => {
	const context = useContext(KubioInheritedStyleContext);
	const finalContext = useMemo(() => {
		return deepmergeAll([{}, context, style]);
	}, [context, style]);
	return finalContext;
};

export { KubioInheritedStyleContext, useKubioInheritedStyleContext };
