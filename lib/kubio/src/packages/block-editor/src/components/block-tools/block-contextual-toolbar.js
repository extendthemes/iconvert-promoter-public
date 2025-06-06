/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useLayoutEffect,
	useEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import {
	ToolbarItem,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { next, previous } from '@wordpress/icons';
import { STORE_KEY } from '@kubio/constants';
import { useViewportMatch } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import NavigableToolbar from '../navigable-toolbar';
import BlockToolbar from '../block-toolbar';
import { store as blockEditorStore } from '../../store';
import { useHasAnyBlockControls } from '../block-controls/use-has-block-controls';

function BlockContextualToolbar( { focusOnMount, isFixed, ...props } ) {
	// When the toolbar is fixed it can be collapsed
	const [ isCollapsed, setIsCollapsed ] = useState( false );
	const toolbarButtonRef = useRef();

	const isLargeViewport = useViewportMatch( 'medium' );
	const {
		blockType,
		blockEditingMode,
		hasParents,
		showParentSelector,
		selectedBlockClientId,
		isSimpleMode,
	} = useSelect( ( select ) => {
		const {
			getBlockName,
			getBlockParents,
			getSelectedBlockClientIds,
			getBlockEditingMode,
		} = select( blockEditorStore );
		const { getBlockType } = select( blocksStore );
		const selectedBlockClientIds = getSelectedBlockClientIds();
		const _selectedBlockClientId = selectedBlockClientIds[ 0 ];
		const parents = getBlockParents( _selectedBlockClientId );
		const firstParentClientId = parents[ parents.length - 1 ];
		const parentBlockName = getBlockName( firstParentClientId );
		const parentBlockType = getBlockType( parentBlockName );

		const editorIsSimpleMode =
			select( STORE_KEY )?.getKubioEditorModeIsSimple?.() || false;

		return {
			selectedBlockClientId: _selectedBlockClientId,
			blockType:
				_selectedBlockClientId &&
				getBlockType( getBlockName( _selectedBlockClientId ) ),
			blockEditingMode: getBlockEditingMode( _selectedBlockClientId ),
			hasParents: parents.length,
			showParentSelector:
				! editorIsSimpleMode &&
				parentBlockType &&
				getBlockEditingMode( firstParentClientId ) === 'default' &&
				hasBlockSupport(
					parentBlockType,
					'__experimentalParentSelector',
					true
				) &&
				selectedBlockClientIds.length <= 1 &&
				getBlockEditingMode( _selectedBlockClientId ) === 'default',
			isSimpleMode: editorIsSimpleMode,
		};
	}, [] );

	useEffect( () => {
		setIsCollapsed( false );
	}, [ selectedBlockClientId ] );

	const isLargerThanTabletViewport = useViewportMatch( 'large', '>=' );
	const isFullscreen =
		document.body.classList.contains( 'is-fullscreen-mode' );

	/**
	 * The following code is a workaround to fix the width of the toolbar
	 * it should be removed when the toolbar will be rendered inline
	 * FIXME: remove this layout effect when the toolbar is no longer
	 * 				absolutely positioned
	 */
	useLayoutEffect( () => {
		// don't do anything if not fixed toolbar
		if ( ! isFixed ) {
			return;
		}

		const blockToolbar = document.querySelector(
			'.block-editor-block-contextual-toolbar'
		);

		if ( ! blockToolbar ) {
			return;
		}

		if ( ! blockType ) {
			blockToolbar.style.width = 'initial';
			return;
		}

		if ( ! isLargerThanTabletViewport ) {
			// set the width of the toolbar to auto
			blockToolbar.style = {};
			return;
		}

		if ( isCollapsed ) {
			// set the width of the toolbar to auto
			blockToolbar.style.width = 'auto';
			return;
		}

		// get the width of the pinned items in the post editor or widget editor
		const pinnedItems = document.querySelector(
			'.edit-post-header__settings, .edit-widgets-header__actions'
		);
		// get the width of the left header in the site editor
		const leftHeader = document.querySelector(
			'.edit-site-header-edit-mode__end'
		);

		const computedToolbarStyle = window.getComputedStyle( blockToolbar );
		const computedPinnedItemsStyle = pinnedItems
			? window.getComputedStyle( pinnedItems )
			: false;
		const computedLeftHeaderStyle = leftHeader
			? window.getComputedStyle( leftHeader )
			: false;

		const marginLeft = parseFloat( computedToolbarStyle.marginLeft );
		const pinnedItemsWidth = computedPinnedItemsStyle
			? parseFloat( computedPinnedItemsStyle.width )
			: 0;
		const leftHeaderWidth = computedLeftHeaderStyle
			? parseFloat( computedLeftHeaderStyle.width )
			: 0;

		// set the new witdth of the toolbar
		blockToolbar.style.width = `calc(100% - ${
			leftHeaderWidth +
			pinnedItemsWidth +
			marginLeft +
			( pinnedItems || leftHeader ? 2 : 0 ) + // Prevents button focus border from being cut off
			( isFullscreen ? 0 : 160 ) // the width of the admin sidebar expanded
		}px)`;
	}, [
		isFixed,
		isLargerThanTabletViewport,
		isCollapsed,
		isFullscreen,
		blockType,
	] );

	const isToolbarEnabled =
		! blockType ||
		hasBlockSupport( blockType, '__experimentalToolbar', true );
	const hasAnyBlockControls = useHasAnyBlockControls();
	if (
		! isToolbarEnabled ||
		( blockEditingMode !== 'default' && ! hasAnyBlockControls )
	) {
		return null;
	}

	// Shifts the toolbar to make room for the parent block selector.
	const classes = classnames( 'block-editor-block-contextual-toolbar', {
		'has-parent': hasParents && showParentSelector,
		'is-fixed': isFixed,
		'is-collapsed': isCollapsed,
	} );

	return (
		<NavigableToolbar
			focusOnMount={ focusOnMount }
			className={ classes }
			/* translators: accessibility text for the block toolbar */
			aria-label={ __( 'Block tools', 'kubio' ) }
			{ ...props }
		>
			{ ! isCollapsed && (
				<BlockToolbar
					hideDragHandle={ isFixed }
					isSimpleMode={ isSimpleMode }
				/>
			) }
			{ isFixed && isLargeViewport && blockType && (
				<ToolbarGroup
					className={
						isCollapsed
							? 'block-editor-block-toolbar__group-expand-fixed-toolbar'
							: 'block-editor-block-toolbar__group-collapse-fixed-toolbar'
					}
				>
					<ToolbarItem
						as={ ToolbarButton }
						ref={ toolbarButtonRef }
						icon={ isCollapsed ? next : previous }
						onClick={ () => {
							setIsCollapsed( ( collapsed ) => ! collapsed );
							toolbarButtonRef.current.focus();
						} }
						label={
							isCollapsed
								? __( 'Show block tools', 'kubio' )
								: __( 'Hide block tools', 'kubio' )
						}
					/>
				</ToolbarGroup>
			) }
		</NavigableToolbar>
	);
}

export default BlockContextualToolbar;
