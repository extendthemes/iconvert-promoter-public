import { createContext, useContext, useRef } from '@wordpress/element';
import { useGlobalDataEntityRecord } from './use-global-data-entity';
const defaultValue = {};
const KubioGlobalDataContext = createContext(defaultValue);
const useKubioGlobalDataContext = () => {
	return useContext(KubioGlobalDataContext);
};

const KubioGlobalDataContextProvider = ({ children }) => {
	const record = useGlobalDataEntityRecord();
	const ref = useRef();
	const globalChanged = record && ref.current?.global !== record;
	if (globalChanged) {
		ref.current = {
			global: record,
		};
	}
	return (
		<KubioGlobalDataContext.Provider value={ref.current}>
			{children}
		</KubioGlobalDataContext.Provider>
	);
};
export {
	KubioGlobalDataContext,
	KubioGlobalDataContextProvider,
	useKubioGlobalDataContext,
};
