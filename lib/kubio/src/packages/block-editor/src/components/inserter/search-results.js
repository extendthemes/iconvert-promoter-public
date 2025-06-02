import { isGutentagPrefixed } from '@kubio/utils';
import { speak } from '@wordpress/a11y';
import { store as blocksStore } from '@wordpress/blocks';
import { VisuallyHidden } from '@wordpress/components';
import { useDebounce } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { sprintf, _n, __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';
import { find, isEmpty } from 'lodash';
import BlockTypesList from '../block-types-list';
import __experimentalInserterMenuExtension from '../inserter-menu-extension';
import useBlockTypesState from './hooks/use-block-types-state';
import useInsertionPoint from './hooks/use-insertion-point';
import InserterNoResults from './no-results';
import InserterPanel from './panel';
import { searchBlockItems } from './search-items';

const FilteredBlockTypes = ( { filteredBlockTypes, ...props } ) => {
	const gutentagFilteredBlocks = useMemo(
		() =>
			filteredBlockTypes.filter( ( { name } ) =>
				isGutentagPrefixed( name )
			),
		[ filteredBlockTypes ]
	);

	const generalBlocks = useMemo(
		() =>
			filteredBlockTypes.filter(
				( { name } ) => ! find( gutentagFilteredBlocks, { name } )
			),
		[ filteredBlockTypes ]
	);

	const panels = [
		{
			label: __( 'Kubio blocks', 'kubio' ),
			icon: null,
			blockTypes: gutentagFilteredBlocks,
		},
		{
			label: __( 'General blocks', 'kubio' ),
			icon: null,
			blockTypes: generalBlocks,
		},
	].filter( ( { blockTypes } ) => blockTypes && blockTypes.length );

	// skip panel header if there is a single panel
	// if ( panels.length === 1 ) {
	// 	return <BlockTypesList items={ panels[ 0 ].blockTypes } { ...props } />;
	// }

	return panels.map( ( { icon, label, blockTypes } ) => (
		<div key={ `inserter-${ label }-container` }>
			<div
				key={ `inserter-${ label }-label` }
				className="block-editor-inserter__panel-header"
			>
				<h2 className="block-editor-inserter__panel-title">
					{ label }
				</h2>
				{ icon && <Icon icon={ icon } /> }
			</div>

			<div
				key={ `inserter-${ label }-cotent` }
				className="block-editor-inserter__panel-content"
			>
				<BlockTypesList items={ blockTypes } { ...props } />
			</div>
		</div>
	) );
};

function InserterSearchResults( {
	filterValue,
	onSelect,
	onHover,
	rootClientId,
	clientId,
	isAppender,
	maxBlockTypes,
	isDraggable = true,
	shouldFocusBlock = true,
	shouldSelectBlock = true,
	isQuick = false,
	ownerDocument,
	kubioInsertPosition,
} ) {
	const debouncedSpeak = useDebounce( speak, 500 );
	const getBlockType = useSelect(
		( select ) => select( blocksStore ).getBlockType
	);

	const [ destinationRootClientId, onInsertBlocks ] = useInsertionPoint( {
		onSelect,
		rootClientId,
		clientId,
		isAppender,
		shouldFocusBlock,
		shouldSelectBlock,
		ownerDocument,
		kubioInsertPosition,
	} );
	const [
		blockTypes,
		blockTypeCategories,
		blockTypeCollections,
		onSelectBlockType,
	] = useBlockTypesState( destinationRootClientId, onInsertBlocks );

	// display gutentag blocks if filter is empty
	const filteredBlockTypes = useMemo( () => {
		let results = [];

		if ( isEmpty( filterValue ) && isQuick ) {
			results = blockTypes.filter(
				( { name } ) =>
					getBlockType( name )?.supports?.kubio
						?.isGutentagQuickInsertDefault
			);
		}

		if ( isEmpty( results ) ) {
			const sortedBlocks = blockTypes.sort(
				( firstBlockType, secondBlockType ) => {
					const firstValue = isGutentagPrefixed( firstBlockType.name )
						? 0
						: 1;
					const secondValue = isGutentagPrefixed(
						secondBlockType.name
					)
						? 0
						: 1;

					// boolean diference => 1 / 0 / -1
					return firstValue - secondValue;
				}
			);

			results = searchBlockItems(
				sortedBlocks,
				blockTypeCategories,
				blockTypeCollections,
				filterValue
			);
		}

		return maxBlockTypes !== undefined
			? results.slice( 0, maxBlockTypes )
			: results;
	}, [
		filterValue,
		blockTypes,
		blockTypeCategories,
		blockTypeCollections,
		maxBlockTypes,
	] );

	// Announce search results on change
	useEffect( () => {
		if ( ! filterValue ) {
			return;
		}
		const count = filteredBlockTypes.length;
		const resultsFoundMessage = sprintf(
			/* translators: %d: number of results. */
			_n( '%d result found.', '%d results found.', count, 'kubio' ),
			count
		);
		debouncedSpeak( resultsFoundMessage );
	}, [ filterValue, debouncedSpeak ] );

	const hasItems = ! isEmpty( filteredBlockTypes );

	return (
		<>
			{ ! hasItems && <InserterNoResults /> }

			{ !! filteredBlockTypes.length && (
				<InserterPanel
					title={
						<VisuallyHidden>
							{ __( 'Blocks', 'kubio' ) }
						</VisuallyHidden>
					}
				>
					{ filterValue && (
						<FilteredBlockTypes
							filteredBlockTypes={ filteredBlockTypes }
							onSelect={ onSelectBlockType }
							onHover={ onHover }
							label={ __( 'Blocks', 'kubio' ) }
							isDraggable={ isDraggable }
						/>
					) }
					{ ! filterValue && (
						<BlockTypesList
							items={ filteredBlockTypes }
							onSelect={ onSelectBlockType }
							onHover={ onHover }
							label={ __( 'Blocks', 'kubio' ) }
							isDraggable={ isDraggable }
						/>
					) }
				</InserterPanel>
			) }
		</>
	);
}

export default InserterSearchResults;
