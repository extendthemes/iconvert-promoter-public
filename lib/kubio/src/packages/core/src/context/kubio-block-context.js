import { createHigherOrderComponent } from '@wordpress/compose';
import {
	createContext,
	useContext,
	useLayoutEffect,
	useMemo,
} from '@wordpress/element';
import { doAction } from '@wordpress/hooks';
import { useActiveMedia, useKubioDataHelper } from '../hooks';
import {
	DataHelperDefaultOptionsContext,
	useDataHelperDefaultOptionsContext,
} from './data-helper-default-options-context';
import { hasKubioSupport } from '@kubio/utils';

/**
 * @property {(ColibriHelper|null)} dataHelper - Kubio data helper
 */
const defaultValue = {
	dataHelper: null,
};

const KubioBlockContext = createContext( defaultValue );

/**
 *
 * @return {import('../hooks').useKubioDataHelperResponse} Kubio data helper.
 */
const useKubioBlockContext = () => {
	return useContext( KubioBlockContext );
};

const KubioBlockContextProvider = ( { WrappedComponent, ...props } ) => {
	const { dataHelper: parentHelper } = useKubioBlockContext();

	const optionsOverwrite = useMemo(
		() => ( { parentDataHelper: () => parentHelper } ),
		[ parentHelper ]
	);
	const value = useKubioDataHelper( props, optionsOverwrite );

	useLayoutEffect( () => {
		return () => doAction( 'kubio.block-removed', props.clientId );
	}, [ props.clientId ] );

	return (
		<KubioBlockContext.Provider value={ value }>
			<WrappedComponent { ...props } />
		</KubioBlockContext.Provider>
	);
};

const withKubioBlockContext = createHigherOrderComponent(
	( WrappedComponent ) => {
		return ( props ) => {
			if ( ! hasKubioSupport( props.name ) ) {
				<WrappedComponent { ...props } />;
			}

			return (
				<KubioBlockContextProvider
					{ ...props }
					WrappedComponent={ WrappedComponent }
				/>
			);
		};
	},
	'withKubioBlockContext'
);

const DataHelperDefaultOptionsContextProvider = ( {
	WrappedComponent,
	...props
} ) => {
	const media = useActiveMedia();
	const defaultOptions = useMemo( () => {
		return {
			media,
		};
	}, [ media ] );
	const defaultsValue = useDataHelperDefaultOptionsContext( {
		defaultOptions,
	} );
	return (
		<DataHelperDefaultOptionsContext.Provider value={ defaultsValue }>
			<WrappedComponent { ...props } />
		</DataHelperDefaultOptionsContext.Provider>
	);
};

const withHelperDefaultOptions = createHigherOrderComponent(
	( WrappedComponent ) => {
		return ( props ) => {
			if ( ! hasKubioSupport( props.name ) ) {
				return <WrappedComponent { ...props } />;
			}

			return (
				<DataHelperDefaultOptionsContextProvider
					{ ...props }
					WrappedComponent={ WrappedComponent }
				/>
			);
		};
	},
	'withHelperDefaultOptions'
);

export {
	KubioBlockContext,
	useKubioBlockContext,
	withKubioBlockContext,
	withHelperDefaultOptions,
};
