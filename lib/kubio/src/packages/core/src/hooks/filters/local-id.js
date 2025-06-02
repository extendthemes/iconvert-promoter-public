import { hasKubioSupport } from '@kubio/utils';
import { createHigherOrderComponent } from '@wordpress/compose';
import { createContext, useContext } from '@wordpress/element';

const LocalIdContext = createContext( null );

const useLocalId = () => {
	return useContext( LocalIdContext );
};

const withLocalId = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		if ( ! hasKubioSupport( props.name ) ) {
			return <BlockListBlock { ...props } />;
		}

		const attrLocalId = props?.attributes?.kubio?.id ?? null;
		return (
			<LocalIdContext.Provider value={ attrLocalId ?? props.clientId }>
				<BlockListBlock { ...props } />
			</LocalIdContext.Provider>
		);
	};
}, 'withLocalId' );

export { useLocalId, withLocalId };
