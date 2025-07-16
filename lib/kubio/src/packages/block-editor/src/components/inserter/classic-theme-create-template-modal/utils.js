import { useDispatch } from '@wordpress/data';
import _ from 'lodash';

function getUnlinkedBlocks( blocks ) {
	if ( ! blocks ) {
		return blocks;
	}
	const newBlocks = _.cloneDeep( blocks );
	return newBlocks.map( ( block ) => {
		const innerBlocks = getUnlinkedBlocks( block.innerBlocks );

		const newBlock = {
			...block,
			innerBlocks,
		};

		return newBlock;
	} );
}
function findBlockByName( blockList, blockName ) {
	let foundBlock = blockList.find( ( item ) => item?.name === blockName );

	if ( foundBlock ) {
		return foundBlock;
	}
	blockList.forEach( ( block ) => {
		if ( foundBlock ) {
			return;
		}
		if ( block?.name === blockName ) {
			foundBlock = block;
		}

		const innerBlocks = _.get( block, 'innerBlocks' );
		if ( Array.isArray( innerBlocks ) ) {
			const foundInnerBLock = findBlockByName( innerBlocks, blockName );
			if ( foundInnerBLock ) {
				foundBlock = foundInnerBLock;
			}
		}
	} );
	return foundBlock;
}
//When i try to import any function from kubio core i get a infinite loop error so as a quick fix I copied what I needed
//in this file
function useKubioNotices() {
	const { createErrorNotice, createSuccessNotice } =
		useDispatch( 'core/notices' );

	const createKubioSuccesNotice = ( content, options ) => {
		return createSuccessNotice( content, {
			type: 'snackbar',
			...options,
		} );
	};
	const createKubioErrorNotice = ( content, options ) => {
		return createErrorNotice( content, {
			type: 'snackbar',
			...options,
		} );
	};
	return {
		createSuccessNotice: createKubioSuccesNotice,
		createErrorNotice: createKubioErrorNotice,
	};
}

export { getUnlinkedBlocks, findBlockByName, useKubioNotices };
