/**
 * WordPress dependencies
 */
import {
	store as blocksStore,
	getBlockType,
	getUnregisteredTypeHandlerName,
	hasBlockSupport,
} from '@wordpress/blocks';
import { PanelBody, __unstableMotion as motion } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useBorderPanelLabel } from '../../hooks/border';
import { store as blockEditorStore } from '../../store';
import BlockCard from '../block-card';
import BlockInfo from '../block-info-slot-fill';
import BlockQuickNavigation from '../block-quick-navigation';
import BlockStyles from '../block-styles';
import BlockVariationTransforms from '../block-variation-transforms';
import DefaultStylePicker from '../default-style-picker';
import { default as InspectorControls } from '../inspector-controls';
import { default as InspectorControlsTabs } from '../inspector-controls-tabs';
import AdvancedControls from '../inspector-controls-tabs/advanced-controls-panel';
import PositionControls from '../inspector-controls-tabs/position-controls-panel';
import useInspectorControlsTabs from '../inspector-controls-tabs/use-inspector-controls-tabs';
import MultiSelectionInspector from '../multi-selection-inspector';
import SkipToSelectedBlock from '../skip-to-selected-block';
import useBlockDisplayInformation from '../use-block-display-information';
import useBlockInspectorAnimationSettings from './useBlockInspectorAnimationSettings';
import { unlock } from '../../lock-unlock';

function BlockStylesPanel( { clientId } ) {
	return (
		<PanelBody title={ __( 'Styles' ) }>
			<BlockStyles clientId={ clientId } />
		</PanelBody>
	);
}

function BlockInspectorLockedBlocks( { topLevelLockedBlock } ) {
	const contentClientIds = useSelect(
		( select ) => {
			const {
				getClientIdsOfDescendants,
				getBlockName,
				getBlockEditingMode,
			} = select( blockEditorStore );
			return getClientIdsOfDescendants( topLevelLockedBlock ).filter(
				( clientId ) =>
					getBlockName( clientId ) !== 'core/list-item' &&
					getBlockEditingMode( clientId ) === 'contentOnly'
			);
		},
		[ topLevelLockedBlock ]
	);
	const hasBlockStyles = useSelect(
		( select ) => {
			const { getBlockName } = select( blockEditorStore );
			const { getBlockStyles } = select( blocksStore );
			return !! getBlockStyles( getBlockName( topLevelLockedBlock ) )
				?.length;
		},
		[ topLevelLockedBlock ]
	);
	const blockInformation = useBlockDisplayInformation( topLevelLockedBlock );
	return (
		<div className="block-editor-block-inspector">
			<BlockCard
				{ ...blockInformation }
				className={ blockInformation.isSynced && 'is-synced' }
			/>
			<BlockInfo.Slot />
			{ hasBlockStyles && (
				<BlockStylesPanel clientId={ topLevelLockedBlock } />
			) }
			{ contentClientIds.length > 0 && (
				<PanelBody title={ __( 'Content', 'kubio' ) }>
					<BlockQuickNavigation clientIds={ contentClientIds } />
				</PanelBody>
			) }
		</div>
	);
}

const BlockInspector = ( { showNoBlockSelectedMessage = true } ) => {
	const {
		count,
		selectedBlockName,
		selectedBlockClientId,
		blockType,
		topLevelLockedBlock,
	} = useSelect( ( select ) => {
		const {
			getSelectedBlockClientId,
			getSelectedBlockCount,
			getBlockName,
			__unstableGetContentLockingParent,
			getContentLockingParent,
			getTemplateLock,
		} = unlock( select( blockEditorStore ) );

		const _selectedBlockClientId = getSelectedBlockClientId();
		const _selectedBlockName =
			_selectedBlockClientId && getBlockName( _selectedBlockClientId );
		const _blockType =
			_selectedBlockName && getBlockType( _selectedBlockName );

		const realGetContentLockingParent = getContentLockingParent
			? getContentLockingParent
			: __unstableGetContentLockingParent;

		return {
			count: getSelectedBlockCount(),
			selectedBlockClientId: _selectedBlockClientId,
			selectedBlockName: _selectedBlockName,
			blockType: _blockType,
			topLevelLockedBlock:
				realGetContentLockingParent( _selectedBlockClientId ) ||
				( getTemplateLock( _selectedBlockClientId ) === 'contentOnly' ||
				_selectedBlockName === 'core/block'
					? _selectedBlockClientId
					: undefined ),
		};
	}, [] );

	const availableTabs = useInspectorControlsTabs( blockType?.name );
	const showTabs = availableTabs?.length > 1;

	// The block inspector animation settings will be completely
	// removed in the future to create an API which allows the block
	// inspector to transition between what it
	// displays based on the relationship between the selected block
	// and its parent, and only enable it if the parent is controlling
	// its children blocks.
	const blockInspectorAnimationSettings = useBlockInspectorAnimationSettings(
		blockType,
		selectedBlockClientId
	);

	const borderPanelLabel = useBorderPanelLabel( {
		blockName: selectedBlockName,
	} );

	if ( count > 1 ) {
		return (
			<div className="block-editor-block-inspector">
				<MultiSelectionInspector />
				{ showTabs ? (
					<InspectorControlsTabs tabs={ availableTabs } />
				) : (
					<div className="block-editor-block-inspector__tabs kubio-core-blocks-tabs">
						<InspectorControls.Slot />
						<InspectorControls.Slot
							__experimentalGroup="color"
							group="color"
							label={ __( 'Color', 'kubio' ) }
							className="color-block-support-panel__inner-wrapper"
						/>
            				<InspectorControls.Slot
							group="background"
							label={ __( 'Background image' ) }
						/>
						<InspectorControls.Slot
							__experimentalGroup="typography"
							group="typography"
							label={ __( 'Typography', 'kubio' ) }
						/>
						<InspectorControls.Slot
							__experimentalGroup="dimensions"
							group="dimensions"
							label={ __( 'Dimensions', 'kubio' ) }
						/>
						<InspectorControls.Slot
							group="border"
							__experimentalGroup="border"
							label={ borderPanelLabel }
						/>
						<InspectorControls.Slot group="styles" />
					</div>
				) }
			</div>
		);
	}

	const isSelectedBlockUnregistered =
		selectedBlockName === getUnregisteredTypeHandlerName();

	/*
	 * If the selected block is of an unregistered type, avoid showing it as an actual selection
	 * because we want the user to focus on the unregistered block warning, not block settings.
	 */
	if (
		! blockType ||
		! selectedBlockClientId ||
		isSelectedBlockUnregistered
	) {
		if ( showNoBlockSelectedMessage ) {
			return (
				<span className="block-editor-block-inspector__no-blocks">
					{ __( 'No block selected.', 'kubio' ) }
				</span>
			);
		}
		return null;
	}
	if ( topLevelLockedBlock ) {
		return (
			<BlockInspectorLockedBlocks
				topLevelLockedBlock={ topLevelLockedBlock }
			/>
		);
	}

	return (
		<BlockInspectorSingleBlockWrapper
			animate={ blockInspectorAnimationSettings }
			wrapper={ ( children ) => (
				<AnimatedContainer
					blockInspectorAnimationSettings={
						blockInspectorAnimationSettings
					}
					selectedBlockClientId={ selectedBlockClientId }
				>
					{ children }
				</AnimatedContainer>
			) }
		>
			<BlockInspectorSingleBlock
				clientId={ selectedBlockClientId }
				blockName={ blockType.name }
			/>
		</BlockInspectorSingleBlockWrapper>
	);
};

const BlockInspectorSingleBlockWrapper = ( { animate, wrapper, children } ) => {
	return animate ? wrapper( children ) : children;
};

const AnimatedContainer = ( {
	blockInspectorAnimationSettings,
	selectedBlockClientId,
	children,
} ) => {
	const animationOrigin =
		blockInspectorAnimationSettings &&
		blockInspectorAnimationSettings.enterDirection === 'leftToRight'
			? -50
			: 50;

	return (
		<motion.div
			animate={ {
				x: 0,
				opacity: 1,
				transition: {
					ease: 'easeInOut',
					duration: 0.14,
				},
			} }
			initial={ {
				x: animationOrigin,
				opacity: 0,
			} }
			key={ selectedBlockClientId }
		>
			{ children }
		</motion.div>
	);
};

const BlockInspectorSingleBlock = ( { clientId, blockName } ) => {
	const availableTabs = useInspectorControlsTabs( blockName );

	const { hasBlockStyles, hasKubioSupport } = useSelect(
		( select ) => {
			const { getBlockStyles } = select( blocksStore );
			const blockStyles = getBlockStyles( blockName );
			return {
				hasBlockStyles: blockStyles && blockStyles.length > 0,
				hasKubioSupport: hasBlockSupport( blockName, 'kubio' ),
			};
		},
		[ blockName ]
	);

	const showTabs = hasKubioSupport ? false : availableTabs?.length > 1;

	const blockInformation = useBlockDisplayInformation( clientId );
	const borderPanelLabel = useBorderPanelLabel( { blockName } );

	return (
		<div className="block-editor-block-inspector">
			<BlockVariationTransforms blockClientId={ clientId } />
			<BlockInfo.Slot />
			{ showTabs && (
				<InspectorControlsTabs
					hasBlockStyles={ hasBlockStyles }
					clientId={ clientId }
					blockName={ blockName }
					tabs={ availableTabs }
				/>
			) }
			{ ! showTabs && (
				<>
					{ hasBlockStyles && (
						<div>
							<PanelBody title={ __( 'Styles', 'kubio' ) }>
								<BlockStylesPanel clientId={ clientId } />
								{ hasBlockSupport(
									blockName,
									'defaultStylePicker',
									true
								) && (
									<DefaultStylePicker
										blockName={ blockName }
									/>
								) }
							</PanelBody>
						</div>
					) }
					<InspectorControls.Slot />
					<InspectorControls.Slot group="list" />
					<InspectorControls.Slot
						group="color"
						label={ __( 'Color', 'kubio' ) }
						className="color-block-support-panel__inner-wrapper"
					/>
					<InspectorControls.Slot
						group="typography"
						label={ __( 'Typography', 'kubio' ) }
					/>
					<InspectorControls.Slot
						group="dimensions"
						label={ __( 'Dimensions', 'kubio' ) }
					/>
					<InspectorControls.Slot
						group="border"
						label={ borderPanelLabel }
					/>
					<InspectorControls.Slot group="styles" />

					<PositionControls />
          			<InspectorControls.Slot group="bindings" />
					{ ! blockName.startsWith( 'cspromo/' ) &&
						blockName !== 'core/post-content' && (
							<div>
								<AdvancedControls />
							</div>
						) }
				</>
			) }
			<SkipToSelectedBlock key="back" />
		</div>
	);
};

/**
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/block-inspector/README.md
 */
export default BlockInspector;
