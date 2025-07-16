/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
	parse,
	store as blocksStore,
} from '@wordpress/blocks';
import { useMemo } from '@wordpress/element';
import { ProBadge, ProItem } from '@kubio/pro';

/**
 * Internal dependencies
 */
import { searchBlockItems } from '../components/inserter/search-items';
import useBlockTypesState from '../components/inserter/hooks/use-block-types-state';
import BlockIcon from '../components/block-icon';
import { store as blockEditorStore } from '../store';
import { orderBy } from '../utils/sorting';
import { orderInserterBlockItems } from '../utils/order-inserter-block-items';
import _ from 'lodash';

const noop = () => {};
const SHOWN_BLOCK_TYPES = 9;

/** @typedef {import('@wordpress/components').WPCompleter} WPCompleter */

/**
 * Creates a blocks repeater for replacing the current block with a selected block type.
 *
 * @return {WPCompleter} A blocks completer.
 */
function createBlockCompleter() {
	return {
		name: 'blocks',
		className: 'block-editor-autocompleters__block',
		triggerPrefix: '/',

		useItems( filterValue ) {
			const {
				rootClientId,
				selectedBlockName,
				prioritizedBlocks,
				blockTypes,
			} = useSelect( ( select ) => {
				const {
					getSelectedBlockClientId,
					getBlockName,
					getBlockListSettings,
					getBlockRootClientId,
				} = select( blockEditorStore );
				const { getBlockTypes } = select( blocksStore );

				const selectedBlockClientId = getSelectedBlockClientId();
				const _rootClientId = getBlockRootClientId(
					selectedBlockClientId
				);
				return {
					selectedBlockName: selectedBlockClientId
						? getBlockName( selectedBlockClientId )
						: null,
					rootClientId: _rootClientId,
					prioritizedBlocks:
						getBlockListSettings( _rootClientId )
							?.prioritizedInserterBlocks,
					blockTypes: getBlockTypes(),
				};
			}, [] );
			const [ items, categories, collections ] = useBlockTypesState(
				rootClientId,
				noop
			);

			const blockTypesByBlockName = useMemo( () => {
				return _.keyBy( blockTypes, 'name' );
			}, [ blockTypes ] );

			const filteredItems = useMemo( () => {
				const initialFilteredItems = !! filterValue.trim()
					? searchBlockItems(
							items,
							categories,
							collections,
							filterValue
					  )
					: orderInserterBlockItems(
							orderBy( items, 'frecency', 'desc' ),
							prioritizedBlocks
					  );

				return initialFilteredItems
					.filter( ( item ) => item.name !== selectedBlockName )
					.slice( 0, SHOWN_BLOCK_TYPES )
					.map( ( item ) => {
						let isProOnFree = false;

						isProOnFree = _.get(
							blockTypesByBlockName,
							[ item.name, 'isPro' ],
							false
						);


						return {
							...item,
							isProOnFree,
						};
					} );
			}, [
				filterValue,
				selectedBlockName,
				items,
				categories,
				collections,
				prioritizedBlocks,
				blockTypesByBlockName,
			] );

			const options = useMemo(
				() =>
					filteredItems.map( ( blockItem ) => {
						const { title, icon, isDisabled, isProOnFree } =
							blockItem;

						return {
							key: `block-${ blockItem.id }`,
							value: blockItem,
							label: (
								<ProItem
									className="kubio-autocomplete-item kubio-pro-item--small"
									item={ isProOnFree }
								>
									<BlockIcon
										key="icon"
										icon={ icon }
										showColors
									/>
									{ title }
								</ProItem>
							),
							isDisabled,
						};
					} ),
				[ filteredItems ]
			);

			return [ options ];
		},
		allowContext( before, after ) {
			return ! ( /\S/.test( before ) || /\S/.test( after ) );
		},
		getOptionCompletion( inserterItem ) {
			const {
				name,
				initialAttributes,
				innerBlocks,
				syncStatus,
				content,
			} = inserterItem;

			return {
				action: 'replace',
				value:
					syncStatus === 'unsynced'
						? parse( content, {
								__unstableSkipMigrationLogs: true,
						  } )
						: createBlock(
								name,
								initialAttributes,
								createBlocksFromInnerBlocksTemplate(
									innerBlocks
								)
						  ),
			};
		},
	};
}

/**
 * Creates a blocks repeater for replacing the current block with a selected block type.
 *
 * @return {WPCompleter} A blocks completer.
 */
export default createBlockCompleter();
