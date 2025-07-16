import { usePrimaryMenuBlockEditor } from '@kubio/menu-data';
import { createContext, useContext } from '@wordpress/element';

const SectionListMenuContext = createContext(null);

const useSectionListMenuContext = () => {
	return useContext(SectionListMenuContext);
};

const SectionListMenuContextProvider = ({ children }) => {
	const context = usePrimaryMenuBlockEditor();

	return (
		<SectionListMenuContext.Provider value={context}>
			{children}
		</SectionListMenuContext.Provider>
	);
};

export { SectionListMenuContextProvider, useSectionListMenuContext };
