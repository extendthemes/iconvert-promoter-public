import { noop } from 'lodash';

import { createContext, useContext } from '@wordpress/element';

const sidebarContext = createContext( {
	clientId: null,
	dataHelper: null,
	updateClientId: noop,
	updateColibriData: noop(),
} );

const { Provider } = sidebarContext;
/**
 * A hook that returns the block edit context.
 *
 * @return {Object} Block edit context
 */

function useSidebarContext() {
	return useContext( sidebarContext );
}

export { Provider as SidebarContextProvider, useSidebarContext };
