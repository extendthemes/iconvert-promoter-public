/**
 * External dependencies
 */
import { map, flow, groupBy, orderBy } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useMemo, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockTypesList from '../block-types-list';
import InserterPanel from './panel';
import useBlockTypesState from './hooks/use-block-types-state';
import InserterListbox from '../inserter-listbox';

const getBlockNamespace = ( item ) => item.name.split( '/' )[ 0 ];

const MAX_SUGGESTED_ITEMS = 6;

function reorderBlocks( blocksList ) {
	const blocksOrder = {
		'kubio-template-parts': [
			'kubio/header',
			'core/post-content',
			'kubio/footer',
			'kubio/sidebar',
		],
		'kubio-components': [
			'kubio/tab',
			'kubio/accordion',
			'kubio/image-gallery',
			'kubio/social-icons',
			'kubio/iconlist',
			'kubio/contact',
			'kubio/map',
			'kubio/dropdown-menu',
			'kubio/accordion-menu',
			'kubio/shortcode',
			// PRO Blocks
			'kubio/counter',
			'kubio/flipbox',
			'kubio/multipleimages',
			'kubio/slider',
			'kubio/carousel',
			'kubio/subscribe-form',
			'kubio/pricing',
			'kubio/pricing-table',
			'kubio/breadcrumb',
		],
		'kubio-blog-components': [
			'kubio/query-loop',
			'kubio/post-title',
			'kubio/post-excerpt',
			'kubio/post-featured-image',
			'kubio/post-meta',
			'kubio/read-more-button',
			'kubio/post-tags',
			'kubio/post-categories',
			'kubio/post-comments',
			'kubio/post-comments-form',
			'kubio/query-pagination',
			'kubio/pagination-nav-button',
			'kubio/pagination-numbers',
			'kubio/widget-area',
			'kubio/query-layout',
		],
		'kubio-basic': [
			'kubio/row',
			'kubio/text',
			'kubio/heading',
			'kubio/image',
			'kubio/video',
			'kubio/buttongroup',
			'kubio/linkgroup',
			'kubio/icon',
			'kubio/spacer',
			'kubio/divider',
		],
		'kubio-site-data': [
			'kubio/home-button',
			'kubio/logo',
			'kubio/page-title',
			'kubio/search-form',
			'kubio/copyright',
		],
		'kubio-layout': [ 'kubio/section' ],
	};

	for ( const category in blocksList ) {
		if ( undefined !== blocksOrder[ category ] ) {
			blocksList[ category ].sort( ( a, b ) => {
				const aIndex = blocksOrder[ category ].indexOf( a.name );

				// if first item not in array move first item to end
				if ( aIndex < 0 ) {
					return 1;
				}

				// if last item not in array move last item to end
				const bIndex = blocksOrder[ category ].indexOf( b.name );

				if ( bIndex < 0 ) {
					return -1;
				}

				return aIndex - bIndex;
			} );
		}
	}

	return blocksList;
}

export function BlockTypesTab( {
	rootClientId,
	onInsert,
	onHover,
	showMostUsedBlocks,
} ) {
	const [ items, categories, collections, onSelectItem ] = useBlockTypesState(
		rootClientId,
		onInsert
	);

	const suggestedItems = useMemo( () => {
		return orderBy( items, [ 'frecency' ], [ 'desc' ] ).slice(
			0,
			MAX_SUGGESTED_ITEMS
		);
	}, [ items ] );

	const uncategorizedItems = useMemo( () => {
		return items.filter( ( item ) => ! item.category );
	}, [ items ] );

	const itemsPerCategory = useMemo( () => {
		let itemsReturn = flow(
			( itemList ) =>
				itemList.filter(
					( item ) => item.category && item.category !== 'reusable'
				),
			( itemList ) => groupBy( itemList, 'category' )
		)( items );

		itemsReturn = reorderBlocks( itemsReturn );
		return itemsReturn;
	}, [ items ] );

	const itemsPerCollection = useMemo( () => {
		// Create a new Object to avoid mutating collection.
		const result = { ...collections };
		Object.keys( collections ).forEach( ( namespace ) => {
			result[ namespace ] = items.filter(
				( item ) => getBlockNamespace( item ) === namespace
			);
			if ( result[ namespace ].length === 0 ) {
				delete result[ namespace ];
			}
		} );

		return result;
	}, [ items, collections ] );

	// Hide block preview on unmount.
	useEffect( () => () => onHover( null ), [] );

	const mostUsedBlocks = useMemo(
		() =>
			showMostUsedBlocks &&
			!! suggestedItems.length && (
				<InserterPanel title={ _x( 'Most used', 'blocks', 'kubio' ) }>
					<BlockTypesList
						items={ suggestedItems }
						onSelect={ onSelectItem }
						onHover={ onHover }
						label={ _x( 'Most used', 'blocks', 'kubio' ) }
					/>
				</InserterPanel>
			),
		[ suggestedItems, showMostUsedBlocks, onSelectItem, onHover ]
	);

	return (
		<InserterListbox>
			<div>
				{ mostUsedBlocks }
				{ map( categories, ( category ) => {
					const categoryItems = itemsPerCategory[ category.slug ];
					if ( ! categoryItems || ! categoryItems.length ) {
						return null;
					}
					return (
						<InserterPanel
							key={ category.slug }
							title={ category.title }
							icon={ category.icon }
						>
							<BlockTypesList
								items={ categoryItems }
								onSelect={ onSelectItem }
								onHover={ onHover }
								label={ category.title }
							/>
						</InserterPanel>
					);
				} ) }

				{ uncategorizedItems.length > 0 && (
					<InserterPanel
						className="block-editor-inserter__uncategorized-blocks-panel"
						title={ __( 'Uncategorized', 'kubio' ) }
					>
						<BlockTypesList
							items={ uncategorizedItems }
							onSelect={ onSelectItem }
							onHover={ onHover }
							label={ __( 'Uncategorized', 'kubio' ) }
						/>
					</InserterPanel>
				) }

				{ map( collections, ( collection, namespace ) => {
					const collectionItems = itemsPerCollection[ namespace ];
					if ( ! collectionItems || ! collectionItems.length ) {
						return null;
					}

					return (
						<InserterPanel
							key={ namespace }
							title={ collection.title }
							icon={ collection.icon }
						>
							<BlockTypesList
								items={ collectionItems }
								onSelect={ onSelectItem }
								onHover={ onHover }
								label={ collection.title }
							/>
						</InserterPanel>
					);
				} ) }
			</div>
		</InserterListbox>
	);
}

export default BlockTypesTab;
