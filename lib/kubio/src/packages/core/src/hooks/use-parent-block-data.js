import { useSelect, select as globalSelect } from '@wordpress/data';
import { getBlockType } from '@wordpress/blocks';
import { useMemo } from '@wordpress/element';

const useBlockDataDetails2 = ( block ) => {
	const blockData = useMemo( () => {
		return {
			block,
			blockType: getBlockType( block.name ),
			blockData: {
				attributes: block.attributes,
			},
		};
	}, [ block.name, block.attributes ] );
	return blockData;
};

const useBlockDataDetails = ( clientId ) => {
	const { block, blockType, attributes } = useSelect(
		( select ) => {
			const { getBlockAttributes, getBlock } =
				select( 'core/block-editor' );
			if ( ! clientId ) {
				return {};
			}
			let block_ = getBlock( clientId );

			if ( ! block_?.name ) {
				block_ =
					globalSelect( 'core/block-editor' ).getBlock( clientId );
			}

			if ( ! block_ ) {
				return {};
			}
			return {
				block: block_,
				blockType: getBlockType( block_.name ),
				attributes: getBlockAttributes( clientId ) ?? block_.attributes,
			};
		},
		[ clientId ]
	);

	const blockData = useMemo( () => {
		return {
			block,
			blockType,
			blockData: {
				attributes,
			},
		};
	}, [ attributes ] );
	return blockData;
};

export { useBlockDataDetails, useBlockDataDetails2 };
