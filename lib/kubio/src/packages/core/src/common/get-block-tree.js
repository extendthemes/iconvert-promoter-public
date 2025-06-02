import { select } from '@wordpress/data';

const getBlocksGlobal = ( parent ) =>
	select( 'core/block-editor' ).getBlocks( parent );

const handleBlockStream = ( handle, rootBlock = null, registry = null ) => {
	const getBlocks = registry
		? ( parent ) =>
				registry.select( 'core/block-editor' ).getBlocks( parent )
		: getBlocksGlobal;

	const blocks = getBlocks( rootBlock?.clientId || rootBlock );
	if ( blocks.length ) {
		blocks.forEach( ( block ) => {
			handle( block );
			handleBlockStream( handle, block, registry );
		} );
	}
};

export { handleBlockStream };
