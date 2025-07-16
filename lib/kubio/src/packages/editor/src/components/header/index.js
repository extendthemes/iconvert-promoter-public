import { fromHtmlEntities } from '@kubio/utils';
import { BlockToolbar, ToolSelector } from '@wordpress/block-editor';
import { Button, Flex, FlexItem, Icon } from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cog, listView, pages } from '@wordpress/icons';
import { PinnedItems } from '@wordpress/interface';
import { usePageTitle } from '../../hooks/use-page-title';
import { STORE_KEY } from '../../store/constants';
import { MENU_ROOT } from '../navigation-sidebar/navigation-panel/constants';
import SaveButton from '../save-button';
import { AddBlockButton } from '../secondary-sidebar/inserter-sidebar';
import MoreMenu from './more-menu';
import { PreviewOptions } from './preview-options';
import RedoButton from './undo-redo/redo';
import UndoButton from './undo-redo/undo';
import { MediaControls } from './media-controls';

export default function Header({ openEntitiesSavedStates }) {
	const {
		deviceType,
		isEditorSidebarOpened,
		shortcut,
		getBlockSelectionStart,
		isListViewOpen,
		listViewShortcut,
	} = useSelect((select) => {
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
		} = select(STORE_KEY);
		const { getEntityRecord } = select('core');
		const { __experimentalGetTemplateInfo: getTemplateInfo } = select(
			'core/editor'
		);

		const _templateId = getTemplateId();
		const _templatePartId = getTemplatePartId();

		const postType = getEditedPostType();
		const postId = getEditedPostId();
		const record = getEntityRecord('postType', postType, postId);

		let _entityTitle;

		if (postType === 'wp_template') {
			_entityTitle = record?.title
				? record?.title?.raw
				: getTemplateInfo(record).title;
		} else {
			_entityTitle = record?.slug;
		}

		const { getShortcutRepresentation } = select('core/keyboard-shortcuts');

		return {
			isListViewOpen: isListViewOpened(),
			deviceType: __experimentalGetPreviewDeviceType(),
			entityTitle: _entityTitle,
			hasFixedToolbar: isFeatureActive('fixedToolbar'),
			template: record,
			templateType: postType,
			isInserterOpen: isInserterOpened(),

			templateId: _templateId,
			templatePartId: _templatePartId,
			entity: getEntity(),
			page: getPage(),
			showOnFront: getShowOnFront(),
			isEditorSidebarOpened: select(STORE_KEY).isEditorSidebarOpened(),
			shortcut: getShortcutRepresentation(
				'core/edit-post/toggle-sidebar'
			),
			getBlockSelectionStart: select('core/block-editor')
				.getBlockSelectionStart,
			listViewShortcut: getShortcutRepresentation(
				'kubio/edit-site/toggle-list-view'
			),
		};
	}, []);

	const {
		__experimentalSetPreviewDeviceType: setPreviewDeviceType,
		openSidebar,
		closeSidebar,
	} = useDispatch(STORE_KEY);

	const isLargeViewport = useViewportMatch('medium');
	const displayBlockToolbar = false;
	// const displayBlockToolbar =
	// 	!isLargeViewport || deviceType !== 'Desktop' || hasFixedToolbar;
	const toggleGeneralSidebar = isEditorSidebarOpened
		? () => {
				closeSidebar();
				setIsListViewOpened(false);
		  }
		: () => {
				openSidebar(
					getBlockSelectionStart() ? `block-inspector` : `document`
				);
				setIsListViewOpened(false);
		  };

	const pageTitle = usePageTitle();

	const { isNavigationOpened } = useSelect(STORE_KEY);
	const {
		setIsNavigationPanelOpened,
		openNavigationPanelToMenu,
		setIsListViewOpened,
	} = useDispatch(STORE_KEY);

	const showTemplateInSidebar = () => {
		if (isNavigationOpened()) {
			setIsNavigationPanelOpened(false);
		} else {
			openNavigationPanelToMenu(MENU_ROOT);
		}
	};

	const toggleListView = useCallback(() => {
		setIsListViewOpened(!isListViewOpen);
	}, [setIsListViewOpened, isListViewOpen]);

	return (
		<div className="edit-site-header">
			<div className="edit-site-header_start">
				<div className="edit-site-header__toolbar">
					{isLargeViewport && (
						<>
							<AddBlockButton />
							<ToolSelector />
							<UndoButton />
							<RedoButton />
							{/* <BlockNavigationDropdown /> */}

							<Button
								className="edit-site-header-toolbar__list-view-toggle"
								icon={listView}
								isPressed={isListViewOpen}
								/* translators: button label text should, if possible, be under 16 characters. */
								label={__('List View', 'kubio')}
								onClick={toggleListView}
								shortcut={listViewShortcut}
							/>
						</>
					)}
					{displayBlockToolbar && (
						<div className="edit-site-header-toolbar__block-toolbar">
							<BlockToolbar hideDragHandle />
						</div>
					)}
				</div>
			</div>

			<div className="edit-site-header_center">
				<div className="edit-site-document-actions">
					<div className="edit-site-document-actions__title-wrapper">
						<Button
							className="edit-site-document-actions__title"
							onClick={showTemplateInSidebar}
							isPressed={isNavigationOpened()}
							iconPosition={'right'}
							showTooltip={true}
							label={
								isNavigationOpened()
									? __(
											'Close the site content panel',
											'kubio'
									  )
									: __('Open the site content panel', 'kubio')
							}
						>
							<Flex align="center">
								<FlexItem
									className={
										'edit-site-document-entity-title'
									}
								>
									<span>
										{fromHtmlEntities(
											pageTitle ?? __('Page', 'kubio')
										)}
									</span>
								</FlexItem>
								<FlexItem>
									<Icon icon={pages} size={20} />
								</FlexItem>
							</Flex>
						</Button>
					</div>
				</div>
			</div>

			<div className="edit-site-header_end">
				<div className="edit-site-header__actions">
					<MediaControls
						deviceType={deviceType}
						setDeviceType={setPreviewDeviceType}
					/>
					<PreviewOptions />
					<SaveButton
						openEntitiesSavedStates={openEntitiesSavedStates}
					/>
					<Button
						icon={cog}
						label={__('Settings', 'kubio')}
						onClick={toggleGeneralSidebar}
						isPressed={isEditorSidebarOpened}
						aria-expanded={isEditorSidebarOpened}
						className={'kubio-secondary-panel-toggler'}
						shortcut={shortcut}
					/>
					<PinnedItems.Slot scope="kubio/edit-site" />
					<MoreMenu />
				</div>
			</div>
		</div>
	);
}
