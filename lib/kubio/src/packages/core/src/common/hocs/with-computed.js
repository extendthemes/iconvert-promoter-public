import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { isObject, noop } from 'lodash';
import { useKubioBlockContext } from '../../context';

/**
 *
 * @param  mapSelectToProps
 * @return {WPComponent}
 */
const withComputedData = ( mapSelectToProps = null ) => {
	return compose(
		createHigherOrderComponent(
			( WrappedComponent ) => ( ownProps ) => {
				const { dataHelper } = useKubioBlockContext();

				const clientData = useSelect(
					( select ) =>
						select( 'core/block-editor' ).getBlock(
							dataHelper?.clientId
						),
					[ dataHelper?.clientId ]
				);

				const { computed } = ownProps;
				const mapped = mapSelectToProps
					? mapSelectToProps( dataHelper, ownProps )
					: null;

				const newComputed = useMemo( () => {
					if ( ! isObject( mapped ) ) {
						return computed;
					}

					return { ...computed, ...mapped };
				}, [ computed, mapped ] );

				if ( newComputed?.dataHelper ) {
					// developers error. leave it here as a warning message
					// eslint-disable-next-line no-console
					console.warn(
						'[Devs Note]: dataHelper should not be returned in while using withComputedData',
						WrappedComponent.name,
						WrappedComponent
					);
				}

				return (
					<WrappedComponent
						{ ...ownProps }
						computed={ newComputed }
						dataHelper={ dataHelper }
						clientData={ clientData }
					/>
				);
			},
			'withComputedData'
		)
	);
};
export { withComputedData };
