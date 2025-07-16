/**
 * WordPress dependencies
 */
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../../store';

/**
 * Retrieves the block types inserter state.
 *
 * @param {string=}  rootClientId Insertion's root client ID.
 * @param {Function} onInsert     function called when inserter a list of blocks.
 * @param            syncStatus
 * @return {Array} Returns the block types state. (block types, categories, collections, onSelect handler)
 */
const useBlockTypesState = ( rootClientId, onInsert, syncStatus ) => {
	const { categories, collections, items } = useSelect(
		( select ) => {
			const { getInserterItems } = select( blockEditorStore );
			const { getCategories, getCollections } = select( blocksStore );

			const _categories = getCategories().sort(
				(
					{ isKubio: isFirstCatFromKubio },
					{ isKubio: isSecondCatFromKubio }
				) => {
					// put kubio cat first
					if ( isFirstCatFromKubio && ! isSecondCatFromKubio ) {
						return -1;
					}

					// put another cat second
					if ( ! isFirstCatFromKubio && isSecondCatFromKubio ) {
						return 1;
					}

					// don't care
					return 0;
				},
				[]
			);

			return {
				categories: _categories,
				collections: getCollections(),
				items: getInserterItems( rootClientId, syncStatus ),
			};
		},
		[ rootClientId, syncStatus ]
	);

	const onSelectItem = useCallback(
		( { name, initialAttributes, innerBlocks }, shouldFocusBlock ) => {
			const insertedBlock = createBlock(
				name,
				initialAttributes,
				createBlocksFromInnerBlocksTemplate( innerBlocks )
			);

			onInsert( insertedBlock, undefined, shouldFocusBlock );
		},
		[ onInsert ]
	);

	return [ items, categories, collections, onSelectItem ];
};

export default useBlockTypesState;
