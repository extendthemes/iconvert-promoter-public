import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';

const withIsSelected = createHigherOrderComponent(
	( WrappedComponent ) => ( ownProps ) => {
		const { clientId } = ownProps;
		const isSelected = useSelect(
			( select ) =>
				select( 'core/block-editor' ).getSelectedBlockClientId() ===
				clientId,
			[ clientId ]
		);
		return (
			<>
				<WrappedComponent { ...ownProps } isSelected={ isSelected } />
			</>
		);
	},
	'withIsSelected'
);

export { withIsSelected };
