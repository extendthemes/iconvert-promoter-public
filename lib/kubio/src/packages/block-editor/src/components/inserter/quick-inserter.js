/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import InserterSearchForm from './search-form';
import InserterSearchResults from './search-results';
import useInsertionPoint from './hooks/use-insertion-point';
import useBlockTypesState from './hooks/use-block-types-state';
import { store as blockEditorStore } from '../../store';

const SEARCH_THRESHOLD = 6;
const SHOWN_BLOCK_TYPES = 6;

export default function QuickInserter( {
	onSelect,
	rootClientId,
	clientId,
	isAppender,
	ownerDocument,
	kubioInsertPosition,
} ) {
	const [ filterValue, setFilterValue ] = useState( '' );
	const [ destinationRootClientId, onInsertBlocks ] = useInsertionPoint( {
		onSelect,
		rootClientId,
		clientId,
		isAppender,
		ownerDocument,
		kubioInsertPosition,
	} );
	const [ blockTypes ] = useBlockTypesState(
		destinationRootClientId,
		onInsertBlocks
	);

	const showSearch = blockTypes.length > SEARCH_THRESHOLD;

	const { setInserterIsOpened, insertionIndex, totalInnerBlocks } = useSelect(
		( select ) => {
			const { getSettings, getBlockIndex, getBlockCount, getBlockOrder } =
				select( blockEditorStore );
			const index = getBlockIndex( clientId, rootClientId );
			return {
				setInserterIsOpened:
					getSettings().__experimentalSetIsInserterOpened,
				insertionIndex: index === -1 ? getBlockCount() : index,
				totalInnerBlocks: getBlockOrder( rootClientId ).length,
			};
		},
		[ clientId, rootClientId ]
	);

	useEffect( () => {
		if ( setInserterIsOpened ) {
			setInserterIsOpened( false );
		}
	}, [ setInserterIsOpened ] );

	// When clicking Browse All select the appropriate block so as
	// the insertion point can work as expected
	const onBrowseAll = ( e ) => {
		e.target.blur(); //Hide quick inserter popup

		let index = insertionIndex;

		if ( kubioInsertPosition === 'begin' ) {
			index = 0;
		}

		if ( kubioInsertPosition === 'end' ) {
			index = totalInnerBlocks;
		}

		setInserterIsOpened( {
			rootClientId,
			insertionIndex: index,
			isAppender: true,
		} );
	};

	return (
		<div
			className={ classnames( 'block-editor-inserter__quick-inserter', {
				'has-search': showSearch,
				'has-expand': setInserterIsOpened,
			} ) }
		>
			{ showSearch && (
				<InserterSearchForm
					value={ filterValue }
					onChange={ ( value ) => {
						setFilterValue( value );
					} }
					label={ __( 'Search for blocks and patterns', 'kubio' ) }
					placeholder={ __( 'Search', 'kubio' ) }
				/>
			) }

			<div className="block-editor-inserter__quick-inserter-results">
				<InserterSearchResults
					filterValue={ filterValue }
					onSelect={ onSelect }
					rootClientId={ rootClientId }
					clientId={ clientId }
					isAppender={ isAppender }
					maxBlockTypes={ SHOWN_BLOCK_TYPES }
					isDraggable={ false }
					isQuick={ true }
					kubioInsertPosition={ kubioInsertPosition }
				/>
			</div>

			{ setInserterIsOpened && (
				<Button
					className="block-editor-inserter__quick-inserter-expand"
					onClick={ onBrowseAll }
					aria-label={ __(
						'Browse all. This will open the main inserter panel in the editor toolbar.',
						'kubio'
					) }
				>
					{ __( 'Browse all', 'kubio' ) }
				</Button>
			) }
		</div>
	);
}
