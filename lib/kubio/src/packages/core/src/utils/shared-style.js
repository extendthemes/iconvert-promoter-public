import { select as globalSelect, useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import _ from 'lodash';
import shortid from 'shortid';
import { handleBlockStream } from '../common';

const walkBlockTree = ( tree, callback, index = 0, parent = null ) => {
	if ( _.isArray( tree ) ) {
		_.each( tree, ( child, i ) => {
			walkBlockTree( child, callback, i, tree );
		} );
	} else {
		callback( tree, index, parent );
	}

	if ( tree?.innerBlocks ) {
		walkBlockTree( tree?.innerBlocks, callback );
	}
};

const flattenBlockTree = (
	tree,
	{ byBlockId = true, attributesOnly = true } = {}
) => {
	const blocks = {};
	walkBlockTree( tree, ( currBlock ) => {
		blocks[ currBlock.clientId ] = attributesOnly
			? currBlock.attributes
			: currBlock;
	} );

	if ( ! byBlockId ) {
		return Object.values( blocks );
	}

	return blocks;
};

const EMPTY_ARRAY = [];

const getBlocksByStyleRefsAndIds = ( registry = null ) => {
	const blocksByStyleRefs = {};
	const blocksByIds = {};

	handleBlockStream(
		( item ) => {
			const styleRef = item?.attributes?.kubio?.styleRef;
			const id = item?.attributes?.kubio?.id;

			if ( styleRef ) {
				blocksByStyleRefs[ styleRef ] = (
					blocksByStyleRefs?.[ styleRef ] || []
				).concat( [ item ] );

				blocksByIds[ id ] = ( blocksByIds?.[ id ] || [] ).concat( [
					item,
				] );
			}
		},
		null,
		registry
	);

	return { blocksByStyleRefs, blocksByIds };
};

const useGetBlocksByStyleRefsAndIds = ( registry = null ) => {
	const {
		__experimentalGetLastBlockAttributeChanges:
			getLastBlockAttributeChanges,
	} = useSelect( ( select ) => select( 'core/block-editor' ), [] );

	let getChanges = getLastBlockAttributeChanges;

	if ( registry ) {
		getChanges =
			registry.select(
				'core/block-editor'
			).__experimentalGetLastBlockAttributeChanges;
	}

	const attributeChanges = getChanges() || EMPTY_ARRAY;

	const blocksByStyleRefsAndIds_ = useMemo(
		() => getBlocksByStyleRefsAndIds( registry ),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ attributeChanges ]
	);

	return blocksByStyleRefsAndIds_;
};

const useGetAllBlocksWithStyleRef = ( styleRef, registry = null ) => {
	const { blocksByStyleRefs } = useGetBlocksByStyleRefsAndIds( registry );

	if ( ! styleRef ) {
		return [];
	}

	return blocksByStyleRefs[ styleRef ];
};

const findAllBlocksWithStyleRef = (
	styleRef,
	{ exclude = [], registry = null }
) => {
	const select = registry?.select || globalSelect;
	const blocksIds =
		select( 'core/block-editor' ).getClientIdsWithDescendants();

	const { getBlock } = select( 'core/block-editor' );
	return blocksIds.map( getBlock ).filter( ( block ) => {
		if ( exclude.indexOf( block?.clientId ) !== -1 ) {
			return false;
		}

		return block?.attributes?.kubio?.styleRef === styleRef;
	} );
};

const regenerateStyleRef = ( attributes ) => {
	return {
		...attributes,
		kubio: {
			...attributes?.kubio,
			styleRef: shortid.generate(),
		},
	};
};

export {
	findAllBlocksWithStyleRef,
	flattenBlockTree,
	regenerateStyleRef,
	useGetAllBlocksWithStyleRef,
	walkBlockTree,
};
