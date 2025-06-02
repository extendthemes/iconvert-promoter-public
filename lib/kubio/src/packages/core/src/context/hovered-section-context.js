import { createContext, useContext } from '@wordpress/element';

import { noop } from 'lodash';

const HoveredSectionContext = createContext({
    clientId: null,
    setContainer: noop,
});
const useHoveredSection = () => {
    return useContext(HoveredSectionContext);
};
export { HoveredSectionContext, useHoveredSection };