import { createHigherOrderComponent } from '@wordpress/compose';
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from '@wordpress/element';
import _ from 'lodash';
import { hasKubioSupport } from '@kubio/utils';

const defaultValue = {};
const KubioBlockEditSessionContext = createContext( defaultValue );

const useBlockContextProviderValue = ( clientId ) => {
	const [ contextData, setContextData ] = useState( {} );
	const getContextProp = useCallback(
		( path, defaultValue_ ) => {
			return _.get( contextData, path, defaultValue_ );
		},
		[ contextData ]
	);

	const setContextProp = useCallback( ( path, value ) => {
		setContextData( ( currentContext ) => {
			const newData = window.structuredClone( currentContext );
			_.set( newData, path, value );

			return newData;
		} );
	}, [] );

	const memoProviderValue = useMemo( () => {
		return {
			...contextData,
			clientId,
			getContextProp,
			setContextProp,
		};
	}, [ clientId, contextData, getContextProp, setContextProp ] );

	return memoProviderValue;
};

const useKubioBlockEditSessionContext = () => {
	return useContext( KubioBlockEditSessionContext );
};

const KubioBlockEditSessionContextProvider = ( {
	WrappedComponent,
	...props
} ) => {
	const { clientId } = props;
	const providerValue = useBlockContextProviderValue( clientId );
	return (
		<KubioBlockEditSessionContext.Provider value={ providerValue }>
			<WrappedComponent { ...props } />
		</KubioBlockEditSessionContext.Provider>
	);
};

const WithKubioSessionContext = createHigherOrderComponent(
	( WrappedComponent ) => {
		return ( props ) => {
			if ( ! hasKubioSupport( props.name ) ) {
				return <WrappedComponent { ...props } />;
			}

			return (
				<KubioBlockEditSessionContextProvider
					{ ...props }
					WrappedComponent={ WrappedComponent }
				/>
			);
		};
	},
	'WithKubioSessionContext'
);

export {
	useKubioBlockEditSessionContext,
	KubioBlockEditSessionContext,
	WithKubioSessionContext,
};
