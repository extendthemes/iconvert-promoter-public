import { getBlockDefaultVariation } from '@kubio/core';
import { createBlock } from '@wordpress/blocks';

const posterInsertBlockDefault =
	( blockName ) =>
	( options = {} ) => {
		const { attributes, innerBlocks } =
			getBlockDefaultVariation( blockName );
		return createBlock(
			blockName,
			{ ...attributes, ...options.attributes },
			innerBlocks
		);
	};

export { posterInsertBlockDefault };
