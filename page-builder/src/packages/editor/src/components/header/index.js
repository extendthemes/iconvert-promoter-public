import { fromHtmlEntities } from '@kubio/utils';
import { BlockToolbar, ToolSelector } from '@wordpress/block-editor';
import { Button, Flex, FlexItem, Icon } from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cog, listView, pages } from '@wordpress/icons';
import { PinnedItems } from '@wordpress/interface';
import { decodeEntities } from '@wordpress/html-entities';
import { AddBlockButton } from './inserter-sidebar';
import {
	HeaderComponents,
	//AddBlockButton,
	SaveButton,
	usePageTitle,
	STORE_KEY,
	NavigationSidebarConstants,
} from '@kubio/editor';

const { MoreMenu, MediaControls, PreviewOptions, RedoButton, UndoButton } =
	HeaderComponents;
const { MENU_ROOT } = NavigationSidebarConstants;

export default function Header( { openEntitiesSavedStates } ) {
	const {
		deviceType,
		isEditorSidebarOpened,
		shortcut,
		getBlockSelectionStart,
		isListViewOpen,
		listViewShortcut,
	} = useSelect( ( select ) => {
		const {
			__experimentalGetPreviewDeviceType,
			isFeatureActive,
			getEditedPostType,
			getEditedPostId,
			isInserterOpened,
			getTemplateId,
			getTemplatePartId,
			getEntity,
			getPage,
			getShowOnFront,
			isListViewOpened,
		} = select( STORE_KEY );
		const { getEntityRecord } = select( 'core' );
		const { __experimentalGetTemplateInfo: getTemplateInfo } =
			select( 'core/editor' );

		const _templateId = getTemplateId();
		const _templatePartId = getTemplatePartId();

		const postType = getEditedPostType();
		const postId = getEditedPostId();
		const record = getEntityRecord( 'postType', postType, postId );

		let _entityTitle;

		if ( postType === 'wp_template' ) {
			_entityTitle = record?.title
				? record?.title?.raw
				: getTemplateInfo( record ).title;
		} else {
			_entityTitle = record?.slug;
		}

		const { getShortcutRepresentation } = select(
			'core/keyboard-shortcuts'
		);

		return {
			isListViewOpen: isListViewOpened(),
			deviceType: __experimentalGetPreviewDeviceType(),
			entityTitle: _entityTitle,
			hasFixedToolbar: isFeatureActive( 'fixedToolbar' ),
			template: record,
			templateType: postType,
			isInserterOpen: isInserterOpened(),

			templateId: _templateId,
			templatePartId: _templatePartId,
			entity: getEntity(),
			page: getPage(),
			showOnFront: getShowOnFront(),
			isEditorSidebarOpened: select( STORE_KEY ).isEditorSidebarOpened(),
			shortcut: getShortcutRepresentation(
				'core/edit-post/toggle-sidebar'
			),
			getBlockSelectionStart:
				select( 'core/block-editor' ).getBlockSelectionStart,
			listViewShortcut: getShortcutRepresentation(
				'kubio/edit-site/toggle-list-view'
			),
		};
	}, [] );

	const {
		__experimentalSetPreviewDeviceType: setPreviewDeviceType,
		openSidebar,
		closeSidebar,
	} = useDispatch( STORE_KEY );

	const isLargeViewport = useViewportMatch( 'medium' );
	const displayBlockToolbar = false;
	// const displayBlockToolbar =
	// 	!isLargeViewport || deviceType !== 'Desktop' || hasFixedToolbar;
	const toggleGeneralSidebar = isEditorSidebarOpened
		? () => {
				closeSidebar();
				setIsListViewOpened( false );
		  }
		: () => {
				openSidebar(
					getBlockSelectionStart() ? `block-inspector` : `document`
				);
				setIsListViewOpened( false );
		  };

	const pageTitle = usePageTitle();

	const { isNavigationOpened } = useSelect( STORE_KEY );
	const {
		setIsNavigationPanelOpened,
		openNavigationPanelToMenu,
		setIsListViewOpened,
	} = useDispatch( STORE_KEY );

	const showTemplateInSidebar = () => {
		if ( isNavigationOpened() ) {
			setIsNavigationPanelOpened( false );
		} else {
			openNavigationPanelToMenu( MENU_ROOT );
		}
	};

	const toggleListView = useCallback( () => {
		setIsListViewOpened( ! isListViewOpen );
	}, [ setIsListViewOpened, isListViewOpen ] );

	return (
		<div className="edit-site-header">
			<div className="edit-site-header_start">
				<div className="edit-site-header__toolbar">
					{ isLargeViewport && (
						<>
							<AddBlockButton />
							<UndoButton />
							<RedoButton />
							{ /* <BlockNavigationDropdown /> */ }

							<Button
								className="edit-site-header-toolbar__list-view-toggle"
								icon={ listView }
								isPressed={ isListViewOpen }
								/* translators: button label text should, if possible, be under 16 characters. */
								label={ __( 'List View', 'iconvert-promoter' ) }
								onClick={ toggleListView }
								shortcut={ listViewShortcut }
							/>
						</>
					) }
					{ displayBlockToolbar && (
						<div className="edit-site-header-toolbar__block-toolbar">
							<BlockToolbar hideDragHandle />
						</div>
					) }
				</div>
			</div>

			<div className="edit-site-header_center">
				<div className="edit-site-document-actions">
					<div className="edit-site-document-actions__title-wrapper">
						<Flex align="center">
							<FlexItem>
								<span>
									{ decodeEntities(
										pageTitle ??
											__( 'Page', 'iconvert-promoter' )
									) }
								</span>
							</FlexItem>
						</Flex>
					</div>
				</div>
			</div>

			<div className="edit-site-header_end">
				<div className="edit-site-header__actions">
					<MediaControls
						deviceType={ deviceType }
						setDeviceType={ setPreviewDeviceType }
					/>
					<PreviewOptions />
					<SaveButton
						openEntitiesSavedStates={ openEntitiesSavedStates }
					/>
					<Button
						icon={ cog }
						label={ __( 'Settings', 'iconvert-promoter' ) }
						onClick={ toggleGeneralSidebar }
						isPressed={ isEditorSidebarOpened }
						aria-expanded={ isEditorSidebarOpened }
						className={ 'kubio-secondary-panel-toggler' }
						shortcut={ shortcut }
					/>
					<PinnedItems.Slot scope="kubio/edit-site" />
					<MoreMenu />
				</div>
			</div>
		</div>
	);
}

export { MoreMenu, PreviewOptions, RedoButton, UndoButton };
