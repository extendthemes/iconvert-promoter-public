/**
 * WordPress dependencies
 */
import {
	useState,
	useCallback,
	useMemo,
	useRef,
	useEffect,
} from '@wordpress/element';
import { VisuallyHidden } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { ClassicThemeCreateTemplateModal } from './classic-theme-create-template-modal';
/**
 * Internal dependencies
 */
import Tips from './tips';
import InserterSearchForm from './search-form';
import BlockTypesTab from './block-types-tab';
import BlockPatternsTabs from './block-patterns-tab';
import ReusableBlocksTab from './reusable-blocks-tab';
import InserterSearchResults from './search-results';
import useInsertionPoint from './hooks/use-insertion-point';
import InserterTabs from './tabs';
import { store as blockEditorStore } from '../../store';
import { first, isString } from 'lodash';
import BlockGutentagSectionsTabs from './block-gutentag-sections-tab';
import { applyFilters } from '@wordpress/hooks';
import { KubioSectionsTagsSlotFill } from '@kubio/utils';

function InserterMenu( {
	rootClientId,
	clientId,
	isAppender,
	__experimentalInsertionIndex,
	onSelect,
	showInserterHelpPanel,
	showMostUsedBlocks,
	shouldFocusBlock = true,
	shouldSelectBlock = true,
	ownerDocument,
} ) {
	const [ filterValue, setFilterValue ] = useState( '' );
	const [ selectedPatternCategory, setSelectedPatternCategory ] =
		useState( null );

	const [
		destinationRootClientId,
		onInsertBlocks,
		onToggleInsertionPoint,
		createTemplateParams,
	] = useInsertionPoint( {
		rootClientId,
		clientId,
		isAppender,
		insertionIndex: __experimentalInsertionIndex,
		shouldFocusBlock,
		shouldSelectBlock,
		ownerDocument,
	} );
	let {
		showPatterns,
		hasReusableBlocks,
		patternsInserterArea,
		showGutentagSectionsTab,
	} = useSelect(
		( select ) => {
			const { getSettings, __experimentalGetAllowedPatterns } =
				select( blockEditorStore );

			const openedInserter = select(
				// use literal store name to avoid circular dependencies
				'kubio/edit-site'
			).getOpenedInserter();

			let patternsInserterAreaValue = 'content';

			if ( isString( openedInserter ) ) {
				if ( openedInserter.indexOf( 'pattern-inserter/' ) !== -1 ) {
					patternsInserterAreaValue = openedInserter.replace(
						'pattern-inserter/',
						''
					);
				}

				if ( patternsInserterAreaValue.indexOf( '-blocks' ) !== -1 ) {
					patternsInserterAreaValue =
						patternsInserterAreaValue.replace( '-blocks', '' );
				}

				if (
					patternsInserterAreaValue.indexOf( 'post-content' ) !== -1
				) {
					patternsInserterAreaValue = 'content';
				}
			}

			const showGutentagSectionsTab_ =
				isString( openedInserter ) &&
				openedInserter !== 'block-inserter' &&
				openedInserter.indexOf( 'blocks' ) === -1;

			return {
				showPatterns:
					! destinationRootClientId ||
					!! __experimentalGetAllowedPatterns(
						destinationRootClientId
					).length,
				hasReusableBlocks:
					!! getSettings().__experimentalReusableBlocks?.length,
				patternsInserterArea: patternsInserterAreaValue,
				showGutentagSectionsTab: applyFilters(
					'kubio.block-editor.showGutentagSectionsTab',
					showGutentagSectionsTab_
				),
			};
		},
		[ destinationRootClientId ]
	);

	const onInsert = useCallback(
		( blocks, meta, shouldForceFocusBlock ) => {
			if ( 'undefined' === typeof shouldForceFocusBlock ) {
				shouldForceFocusBlock = true;
			}

			onInsertBlocks( blocks, meta, shouldForceFocusBlock );
			onSelect();
		},
		[ onInsertBlocks, onSelect ]
	);

	const onInsertPattern = useCallback(
		( blocks, pattern ) => {
			const area =
				first( pattern?.name?.split( '/' ) )?.replace( 'kubio-', '' ) ||
				'content';
			onInsertBlocks( blocks, {
				patternName: pattern?.name || pattern,
				pattern,
				area,
			} );
			onSelect();
		},
		[ onInsertBlocks, onSelect ]
	);

	const insertionPoint = useRef();

	const onHover = useCallback(
		( item ) => {
			if ( ! rootClientId || insertionPoint.current === item ) {
				return;
			}
			insertionPoint.current = item;
			onToggleInsertionPoint( !! item );
		},
		[ onToggleInsertionPoint, rootClientId ]
	);

	const onClickPatternCategory = useCallback(
		( patternCategory ) => {
			setSelectedPatternCategory( patternCategory );
		},
		[ setSelectedPatternCategory ]
	);

	const blocksTab = useMemo( () => {
		if ( filterValue ) {
			return (
				<InserterSearchResults
					filterValue={ filterValue }
					onSelect={ onSelect }
					onHover={ onHover }
					rootClientId={ rootClientId }
					clientId={ clientId }
					isAppender={ isAppender }
					shouldFocusBlock={ shouldFocusBlock }
					shouldSelectBlock={ shouldSelectBlock }
				/>
			);
		}

		return (
			<>
				<div className="block-editor-inserter__block-list">
					<BlockTypesTab
						rootClientId={ destinationRootClientId }
						onInsert={ onInsert }
						onHover={ onHover }
						showMostUsedBlocks={ showMostUsedBlocks }
					/>
				</div>
				{ showInserterHelpPanel && (
					<div className="block-editor-inserter__tips">
						<VisuallyHidden as="h2">
							{ __(
								'A tip for using the block editor',
								'kubio'
							) }
						</VisuallyHidden>
						<Tips />
					</div>
				) }
			</>
		);
	}, [
		filterValue,
		destinationRootClientId,
		onInsert,
		onHover,
		showMostUsedBlocks,
		showInserterHelpPanel,
		onSelect,
		rootClientId,
		clientId,
		isAppender,
		shouldFocusBlock,
		shouldSelectBlock,
	] );

	const patternsTab = useMemo(
		() => (
			<BlockPatternsTabs
				rootClientId={ destinationRootClientId }
				onInsert={ onInsertPattern }
				onClickCategory={ onClickPatternCategory }
				selectedCategory={ selectedPatternCategory }
			/>
		),
		[
			destinationRootClientId,
			onInsertPattern,
			onClickPatternCategory,
			selectedPatternCategory,
		]
	);

	const gutentagSectionsTab = useMemo(
		() => (
			<BlockGutentagSectionsTabs
				rootClientId={ destinationRootClientId }
				onInsert={ onInsertPattern }
				filterValue={ filterValue }
				area={ patternsInserterArea }
			/>
		),
		[
			destinationRootClientId,
			onInsertPattern,
			filterValue,
			patternsInserterArea,
		]
	);

	const mainAreaRef = useRef();
	const reusableBlocksTab = useMemo(
		() => (
			<ReusableBlocksTab
				rootClientId={ destinationRootClientId }
				onInsert={ onInsert }
				onHover={ onHover }
			/>
		),
		[ destinationRootClientId, onInsert, onHover ]
	);
	const [ currentTabName, setCurrentTabName ] = useState();

	const getCurrentTab = useCallback(
		( tab ) => {
			if ( currentTabName !== tab.name ) {
				setCurrentTabName( tab.name );
			}
			if ( tab.name === 'blocks' ) {
				return blocksTab;
			} else if ( tab.name === 'kubio-sections' ) {
				return gutentagSectionsTab;
			} else if ( tab.name === 'patterns' ) {
				return patternsTab;
			}
			return reusableBlocksTab;
		},
		[
			currentTabName,
			reusableBlocksTab,
			blocksTab,
			gutentagSectionsTab,
			patternsTab,
		]
	);

	const initialTabName = useMemo(
		() => ( showGutentagSectionsTab ? 'kubio-sections' : 'blocks' ),
		[ showGutentagSectionsTab ]
	);
	const [ activeTab, setActiveTab ] = useState( initialTabName );
	const {
		showCreateTemplateModal,
		onCloseTemplateModal,
		onCreateTemplate,
		newTemplateData,
		patternRootClientId,
		...restTemplatePartsParam
	} = createTemplateParams;

	//When changing the active tab scroll back to top
	useEffect( () => {
		if ( mainAreaRef?.current?.scrollTop ) {
			mainAreaRef.current.scrollTop = 0;
		}
	}, [ activeTab ] );

	showPatterns = applyFilters(
		'kubio.block-editor.showPatterns',
		showPatterns
	);

	return (
		<div className="block-editor-inserter__menu">
			<div
				className="block-editor-inserter__main-area"
				ref={ mainAreaRef }
			>
				{ /* the following div is necessary to fix the sticky position of the search form */ }
				<div className="block-editor-inserter__content">
					<InserterSearchForm
						onChange={ ( value ) => {
							setFilterValue( value );
						} }
						value={ filterValue }
						label={ __(
							'Search for blocks and patterns',
							'kubio'
						) }
						placeholder={ __( 'Search', 'kubio' ) }
					/>
					<KubioSectionsTagsSlotFill.Slot />
					<InserterTabs
						showPatterns={ showPatterns }
						showReusableBlocks={ hasReusableBlocks }
						initialTabName={ activeTab }
						onSelect={ setActiveTab }
						enableGutentagSectionsTab={ showGutentagSectionsTab }
					>
						{ getCurrentTab }
					</InserterTabs>
				</div>
			</div>
			{ showCreateTemplateModal && (
				<ClassicThemeCreateTemplateModal
					area={ patternRootClientId }
					innerBlocks={ newTemplateData }
					onClose={ onCloseTemplateModal }
					onSuccess={ onCreateTemplate }
					{ ...restTemplatePartsParam }
				/>
			) }
			{ /* Disabled preview panel - @Iulian */ }
		</div>
	);
}

export default InserterMenu;
