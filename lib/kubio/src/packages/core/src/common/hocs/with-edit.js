import { compose, createHigherOrderComponent } from '@wordpress/compose';
import memize from 'memize';

const getWrappedComponent = memize( ( save, WrappedComponent, restCompose ) => {
	let ComposedWrappedComponent = WrappedComponent;
	if ( ! save ) {
		ComposedWrappedComponent = restCompose( WrappedComponent );
	}
	return ComposedWrappedComponent;
} );

const withEdit = ( ...rest ) => {
	const restCompose = compose( rest );
	return createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const { save = false } = ownProps;
			const ComposedWrappedComponent = getWrappedComponent(
				save,
				WrappedComponent,
				restCompose
			);
			return (
				<>
					<ComposedWrappedComponent { ...ownProps } />
				</>
			);
		},
		'withEdit'
	);
};

export { withEdit };
