import { createHigherOrderComponent } from '@wordpress/compose';
import { useRegistry, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { noop } from 'lodash';

const THRESHOLD = 100;

const withHooks = ( hooks = noop ) => {
	return createHigherOrderComponent(
		( WrappedComponent ) =>
			( ownProps = {} ) => {
				const stores = useRef( [] );
				const [ , setHash ] = useState();
				const { select: baseSelect, dispatch: baseDispatch } =
					useRegistry();

				const hash = useSelect(
					( monitorSelect ) => {
						stores.current?.forEach( ( store ) =>
							monitorSelect( store )
						);
						return (
							Math.floor( Date.now() / THRESHOLD ) * THRESHOLD + 1
						);
					},
					[ stores.current ]
				);

				useEffect( () => {
					setHash( hash );
				}, [ hash ] );

				const insertStore = useCallback(
					( store ) => {
						if ( stores.current.includes( store ) ) {
							return;
						}

						stores.current = [ ...stores.current, store ];
					},
					[ stores ]
				);

				const select = useCallback(
					( ...args ) => {
						insertStore( args[ 0 ] );
						return baseSelect( ...args );
					},
					[ baseSelect, insertStore ]
				);
				const dispatch = useCallback(
					( ...args ) => {
						insertStore( args[ 0 ] );
						return baseDispatch( ...args );
					},
					[ baseDispatch, insertStore ]
				);

				const hooksData = hooks( ownProps, select, dispatch );
				return <WrappedComponent { ...ownProps } { ...hooksData } />;
			},
		'withKubioHooksProp'
	);
};

export { withHooks };
