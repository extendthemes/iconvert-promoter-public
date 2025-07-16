import {
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';
import _, { debounce, noop } from 'lodash';
import { useRootElementContext } from '../hooks';

const waitFrontendComponentLoad = ( el, callback ) => {
	let observer;

	if ( el.hasAttribute( 'data-loaded' ) ) {
		callback();
	} else {
		const MutationObserver =
			el?.ownerDocument?.defaultView?.MutationObserver;

		if ( MutationObserver ) {
			observer = new MutationObserver( () => {
				if ( el.hasAttribute( 'data-loaded' ) ) {
					observer.disconnect();
					callback();
				}
			} );

			observer?.observe( el, {
				attributes: true,
			} );
		}
	}

	return observer;
};

const useFrontEndComponent = ( { clientId, ref, componentName } ) => {
	const functionsMap = useRef( new Map() );
	const rootElement = useRootElementContext();

	const [ $el, setJQueryElement ] = useState( null );

	useLayoutEffect( () => {
		if ( ! rootElement ) {
			return;
		}

		const el =
			ref?.current ??
			rootElement.querySelector( `[data-block="${ clientId }"]` );

		let observer;

		if ( el ) {
			observer = waitFrontendComponentLoad( el, () => {
				const jQuery =
					el?.ownerDocument?.defaultView?.jQuery || top.jQuery;
				setJQueryElement( jQuery( el ) );
			} );
		}

		return () => {
			observer?.disconnect();
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ clientId, ref?.current, rootElement ] );

	const getFrontendComponent = useCallback( () => {
		if ( ! $el ) {
			return null;
		}

		const componentNameCamelCase = _.camelCase( componentName );
		return $el.data()[ `fn.cspromo.${ componentNameCamelCase }` ];
	}, [ $el, componentName ] );

	const getFrontendComponentFunction = useCallback(
		( funcName, debounceDuration = 0 ) => {
			const mapKey = `${ funcName }-${ debounceDuration }`;

			if ( functionsMap.current.has( mapKey ) ) {
				return functionsMap.current.get( mapKey );
			}

			const component = getFrontendComponent();

			if ( ! component ) {
				return noop;
			}

			const func = component?.[ funcName ]?.bind( component );

			if ( ! func ) {
				return noop;
			}

			let nextFunction = func;

			if ( debounceDuration ) {
				nextFunction = debounce( nextFunction, debounceDuration );
			}

			functionsMap.current.set( mapKey, nextFunction );
			return nextFunction;
		},
		[ getFrontendComponent ]
	);

	return {
		getFrontendComponent,
		getFrontendComponentFunction,
	};
};

export { useFrontEndComponent };
