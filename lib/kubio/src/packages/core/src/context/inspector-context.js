import { createHigherOrderComponent } from '@wordpress/compose';
import { createContext } from '@wordpress/element';
import { useKubioDataHelper } from '../hooks';

const defaultValue = {
	clientId: null,
	rootClientId: null,
};

const DataHelperClientIdContext = createContext( defaultValue );

const WithKubioDataHelperProp = createHigherOrderComponent(
	( WrappedComponent ) => {
		return ( props ) => {
			const itemAttrContainsTheBlock = !! (
				props?.item?.clientId && props?.item?.attributes
			);
			const { dataHelper } = useKubioDataHelper(
				itemAttrContainsTheBlock ? props.item : props
			);
			return <WrappedComponent { ...props } dataHelper={ dataHelper } />;
		};
	},
	'WithKubioDataHelperProp'
);

export { WithKubioDataHelperProp, DataHelperClientIdContext };
