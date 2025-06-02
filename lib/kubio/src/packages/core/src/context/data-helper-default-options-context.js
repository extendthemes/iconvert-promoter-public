import { createContext, useContext, useMemo, useRef } from '@wordpress/element';
import _ from 'lodash';
import { createHigherOrderComponent } from '@wordpress/compose';
import isEqual from 'react-fast-compare';

const DataHelperDefaultOptionsContext = createContext( {
	defaultOptions: {},
} );

const useDataHelperDefaultOptionsContext = ( overwrite = null ) => {
	const context = useContext( DataHelperDefaultOptionsContext );
	const overwriteRef = useRef();

	if ( ! isEqual( overwriteRef.current, overwrite ) ) {
		overwriteRef.current = overwrite;
	}

	const finalContext = useMemo( () => {
		return overwrite ? _.merge( {}, context, overwrite ) : context;
	}, [ context, overwriteRef.current ] );

	return finalContext;
};

const defaultDataHelperDefaultOptions = {
	defaultOptions: { ancestor: '' },
};
const WithNoAncestorContext = createHigherOrderComponent(
	( WrappedComponent ) => ( ownProps ) => {
		const defaultsValue = useDataHelperDefaultOptionsContext(
			defaultDataHelperDefaultOptions
		);
		return (
			<DataHelperDefaultOptionsContext.Provider value={ defaultsValue }>
				<WrappedComponent { ...ownProps } />
			</DataHelperDefaultOptionsContext.Provider>
		);
	},
	'WithNoAncestorContext'
);

export {
	DataHelperDefaultOptionsContext,
	useDataHelperDefaultOptionsContext,
	WithNoAncestorContext,
};
