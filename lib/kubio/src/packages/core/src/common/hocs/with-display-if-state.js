import { createHigherOrderComponent } from '@wordpress/compose';
import { useDataHelperDefaultOptionsContext } from '../../context';

const withDisplayIfState = ( conditions = {} ) =>
	createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const dataHelperDefaultOptions =
				useDataHelperDefaultOptionsContext();
			const { defaultOptions: inheritedOptions } =
				dataHelperDefaultOptions;

			let show = true;
			for ( const key in conditions ) {
				if ( inheritedOptions[ key ] !== conditions[ key ] ) {
					show = false;
				}
			}

			if ( ! show ) {
				return <></>;
			}

			return <WrappedComponent { ...ownProps } />;
		},
		'withDisplayIfState'
	);
export { withDisplayIfState };
