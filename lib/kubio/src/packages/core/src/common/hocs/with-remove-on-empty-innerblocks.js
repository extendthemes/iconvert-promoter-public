import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import _ from 'lodash';
import { useUndoTrapDispatch } from '../../utils';

const withRemoveOnEmptyInnerBlocks = () => {
	const onDelete = ( hooks, { clientId } ) => {
		const { removeBlock = _.noop } = hooks;

		removeBlock( clientId );
	};
	return withCallbackOnEmptyInnerBlocks( onDelete );
};

const withCallbackOnEmptyInnerBlocks = ( callback = _.noop ) => {
	return createHigherOrderComponent(
		( WrappedComponent ) => ( ownProps ) => {
			const {
				clientId,
				skipRemoveOnEmpty = false,
				dataHelper = {},
			} = ownProps;
			const hooks = useDispatch( 'core/block-editor' );
			const blockCount = useSelect(
				( select ) =>
					select( 'core/block-editor' ).getBlockCount( clientId ),
				[]
			);
			const previousBlockCount = useRef( blockCount );
			const applyUndoTrap = useUndoTrapDispatch();

			useEffect( () => {
				if ( skipRemoveOnEmpty ) {
					return;
				}

				if ( previousBlockCount.current > 0 && blockCount === 0 ) {
					applyUndoTrap( () =>
						callback( hooks, { clientId, dataHelper } )
					);
				}
				previousBlockCount.current = blockCount;
			}, [ blockCount, skipRemoveOnEmpty ] );

			return <WrappedComponent { ...ownProps } />;
		},
		'withCallbackOnEmptyInnerBlocks'
	);
};

export { withRemoveOnEmptyInnerBlocks, withCallbackOnEmptyInnerBlocks };
