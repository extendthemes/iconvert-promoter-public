import { createRoot, render, unmountComponentAtNode } from '@wordpress/element';
import { isFunction } from 'lodash';

const dataMap = new WeakMap();

const reactRender = ( component, container ) => {
	if ( isFunction( createRoot ) ) {
		const root = createRoot( container );
		dataMap.set( container, root );
		root.render( component );
	} else {
		render( component, container );
	}
};

const reactUnmount = ( container ) => {
	if ( dataMap.get( container ) ) {
		dataMap.get( container ).unmount();
	} else {
		unmountComponentAtNode( container );
	}
};

export { reactRender, reactUnmount };
