import { createContext, useContext } from '@wordpress/element';

const SocialIconsContext = createContext({});
const useSocialIconsContext = () => {
	return useContext(SocialIconsContext);
};

export { SocialIconsContext, useSocialIconsContext };
