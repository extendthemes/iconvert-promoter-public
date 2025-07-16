import { withObserveOtherBlocks } from './with-observe-other-blocks';

const refreshOnTreeChange = () => {
	return refreshOnParentChange();
};

const refreshOnParentChange = () => {
	return withObserveOtherBlocks( ( select, { clientId } ) => {
		return select( 'core/block-editor' ).getBlockRootClientId( clientId );
	} );
};

const refreshOnParentIterationChange = ( number ) => {
	return withObserveOtherBlocks( ( select, { clientId } ) => {
		let parentId = clientId;
		for ( let i = 0; i < number; i++ ) {
			parentId =
				select( 'core/block-editor' ).getBlockRootClientId( parentId );
		}

		return parentId;
	} );
};

export {
	refreshOnTreeChange,
	refreshOnParentChange,
	refreshOnParentIterationChange,
};
