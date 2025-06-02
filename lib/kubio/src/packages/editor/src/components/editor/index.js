import { initializeGutentagPatterns } from '@kubio/block-patterns';
/**
 * WordPress dependencies
 */
import { STORE_KEY } from '@kubio/constants';
import { markLastChangeAsPersistent, useActiveMedia } from '@kubio/core';
import { useUIVersion } from '@kubio/core-hooks';
import { useGetGlobalSessionProp } from '@kubio/editor-data';
import { KubioGlobalDataContextProvider } from '@kubio/global-data';
import { GlobalStylesProvider } from '@kubio/wp-global-styles';
import { BlockBreadcrumb, BlockContextProvider } from '@wordpress/block-editor';
import { Popover, SlotFillProvider } from '@wordpress/components';
import { compose, createHigherOrderComponent, pure } from '@wordpress/compose';
import { EntityProvider } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	EditorNotices,
	store as editorStore,
	UnsavedChangesWarning,
} from '@wordpress/editor';
import {
	createPortal,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import {
	ComplementaryArea,
	FullscreenMode,
	InterfaceSkeleton,
} from '@wordpress/interface';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';
import { PluginArea } from '@wordpress/plugins';
import classNames from 'classnames';
import _, { isString } from 'lodash';
import { useBlockSelectionListener } from '../../hooks/editor-hooks';
import { ClassicThemeBlockEditor, FSEThemeBlockEditor } from '../block-editor';
import { KubioCustomSection } from '../custom-sections';
import EntitiesSavedStates from '../entities-saved-states';
import Header from '../header';
import KeyboardShortcuts from '../keyboard-shortcuts';
import { KubioBlogTemplate } from '../kubio-blog-template';
import NavigationSidebar from '../navigation-sidebar';
import { EditorSnackbars } from '../notices';
import { HoveredSectionProvider } from '../providers';
import { InserterSidebar } from '../secondary-sidebar/inserter-sidebar';
import ListViewSidebar from '../secondary-sidebar/list-view-sidebar';
import { SidebarComplementaryAreaFills } from '../sidebar';
import URLQueryController from '../url-query-controller';
import { KubioEditorStateProvider } from './editor-state-provider';
import { GlobalStylesRenderer } from './global-styles-renderer';
import { useSidebarTabAutochange } from './use-sidebar-tab-autochange';

const interfaceLabels = {
	secondarySidebar: __('Block Library', 'kubio'),
	drawer: __('Navigation Sidebar', 'kubio'),
};

const WithEditorCurrentEntity = createHigherOrderComponent(
	(WrappedComponent) => {
		return ({ initialSettings }) => {
			const {
				isFullscreenActive,
				sidebarIsOpened,
				settings,
				templateId,
				templateType,
				page,
				isNavigationOpen,
				isInserterOpen,
				isListViewOpen,
				isFSETemplate,
			} = useSelect((select) => {
				const {
					isFeatureActive,
					getSettings,
					getEditedPostType,
					getEditedPostId,
					getPage,
					isNavigationOpened,
					isListViewOpened,
				} = select(STORE_KEY);

				const postType = getEditedPostType();
				const postId = getEditedPostId();

				// The currently selected entity to display. Typically template or template part.
				return {
					isFullscreenActive: isFeatureActive('fullscreenMode'),
					sidebarIsOpened: select(STORE_KEY).isEditorSidebarOpened(),
					settings: getSettings(),
					templateType: postType,
					page: getPage(),
					templateId: postId,
					isNavigationOpen: isNavigationOpened(),
					isInserterOpen: select(STORE_KEY).getOpenedInserter(),
					isFSETemplate: !!postId && !!postType,
					isListViewOpen: isListViewOpened(),
				};
			}, []);

			const { postId, post, currentTemplateId, isKubioTheme } = useSelect(
				(select) => {
					const postId_ = _.get(page, ['context', 'postId']);
					const postType = _.get(page, ['context', 'postType']);
					const { getEntityRecords, getEntityRecord } = select(
						'core'
					);

					const { getTemplateId = _.noop } = select(
						'kubio/edit-site'
					);

					if (!postId_ || !postType) {
						return {
							postId: null,
							currentTemplateId: null,
							isKubioTheme: null,
							post: {},
						};
					}

					const isTemplate = [
						'wp_template',
						'wp_template_part',
					].includes(postType);

					// Ideally the initializeEditor function should be called using the ID of the REST endpoint.
					// to avoid the special case.
					let postObject;
					if (isTemplate) {
						const posts = getEntityRecords('postType', postType, {
							wp_id: postId_,
						});
						postObject = posts?.[0];
					} else {
						postObject = getEntityRecord(
							'postType',
							postType,
							parseInt(postId_)
						);
					}
					const currentTemplateId_ = getTemplateId();

					const { getEditorSettings } = select(editorStore);
					const isKubioTheme_ = getEditorSettings()
						.supportsTemplateMode;
					return {
						postId: postId_,
						currentTemplateId: currentTemplateId_,
						isKubioTheme: isKubioTheme_,
						post: postObject,
					};
				},
				[page?.context?.postId, page?.context?.postType]
			);

			const { openSidebar } = useDispatch(STORE_KEY);
			const { createInfoNotice } = useDispatch('core/notices');

			useEffect(() => {
				openSidebar('document');
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			const { editEntityRecord } = useDispatch('core');
			const { updateEditorSettings, setupEditorState } = useDispatch(
				'core/editor'
			);

			// Keep the defaultTemplateTypes in the core/editor settings too,
			// so that they can be selected with core/editor selectors in any editor.
			// This is needed because edit-site doesn't initialize with EditorProvider,
			// which internally uses updateEditorSettings as well.
			const { defaultTemplateTypes } = settings;
			useEffect(() => {
				updateEditorSettings({
					...initialSettings,
					defaultTemplateTypes,
				});
			}, [defaultTemplateTypes, initialSettings, updateEditorSettings]);

			// setup editor with post data for page settings.
			useLayoutEffect(() => {
				const id = _.get(page, ['context', 'postId']);
				const type = _.get(page, ['context', 'postType']);
				if (id && type) {
					setupEditorState({
						id,
						type,
					});
				}
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [page?.context?.postId, page?.context?.postType]);

			//full width template is set from php. This logic is used to make an edit to the template so it updates
			//on save
			useLayoutEffect(() => {
				if (
					post &&
					post.type === 'page' &&
					// if post was marked as saved in kubio we should not change the template on the next open
					!post.meta?.saved_in_kubio &&
					isString(currentTemplateId)
				) {
					//for third party themes the full width template is called kubio-full-width
					const fullWidthTemplateSlug = isKubioTheme
						? 'full-width'
						: 'kubio-full-width';
					const templateIsFullWidth = currentTemplateId.includes(
						fullWidthTemplateSlug
					);
					const postContent = _.get(post, ['content', 'raw']);
					const postSavedTemplate = _.get(post, 'template');
					const postId_ = _.get(post, 'id');
					const postType = _.get(post, 'type');
					if (
						!postContent &&
						templateIsFullWidth &&
						postSavedTemplate === ''
					) {
						markLastChangeAsPersistent();
						editEntityRecord('postType', postType, postId_, {
							template: fullWidthTemplateSlug,
						});
						createInfoNotice(
							__(
								'New empty page detected. Page template was set to "Full Width"',
								'kubio'
							),
							{
								type: 'snackbar',
							}
						);
					}
				}
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [
				currentTemplateId,
				editEntityRecord,
				isKubioTheme,
				post,
				postId,
			]);

			const props = {
				isListViewOpen,
				isFullscreenActive,
				sidebarIsOpened,
				templateId,
				templateType,
				page,
				isNavigationOpen,
				isInserterOpen,
				isFSETemplate,
				__experimentalGlobalStylesBaseStyles:
					settings.__experimentalGlobalStylesBaseStyles,
				__experimentalGlobalStylesUserEntityId:
					settings.__experimentalGlobalStylesUserEntityId,
			};

			return (
				<>
					<WrappedComponent {...props} />
					<URLQueryController />
				</>
			);
		};
	},
	'WithEditorCurrentEntity'
);

function Editor(props) {
	const {
		__experimentalGlobalStylesUserEntityId,
		sidebarIsOpened,
		templateId,
		templateType,
		page,
		isNavigationOpen,
		isInserterOpen,
		isListViewOpen,
		isFSETemplate,
	} = props;

	const { setPage } = useDispatch('core/editor');

	const activeMedia = useActiveMedia();
	const [isEntitiesSavedStatesOpen, setIsEntitiesSavedStatesOpen] = useState(
		false
	);
	const openEntitiesSavedStates = useCallback(
		() => setIsEntitiesSavedStatesOpen(true),
		[]
	);
	const closeEntitiesSavedStates = useCallback(() => {
		setIsEntitiesSavedStatesOpen(false);
	}, []);

	useBlockSelectionListener();
	useSidebarTabAutochange();
	const isReady = useGetGlobalSessionProp('ready', false);

	const blockContext = useMemo(() => {
		return {
			...page?.context,
			queryContext: [
				page?.context.queryContext || { page: 1 },
				(newQueryContext) =>
					setPage({
						...page,
						context: {
							...page?.context,
							queryContext: {
								...page?.context.queryContext,
								...newQueryContext,
							},
						},
					}),
			],
		};
	}, [JSON.stringify(page?.context)]);

	useEffect(() => {
		if (isNavigationOpen) {
			document.body.classList.add('is-navigation-sidebar-open');
		} else {
			document.body.classList.remove('is-navigation-sidebar-open');
		}
	}, [isNavigationOpen]);

	useEffect(() => initializeGutentagPatterns(), []);

	const { uiVersion: KUBIO_UI_VERSION } = useUIVersion();

	const mainSidebarClassName = classNames('kubio-sidebar', {
		'kubio-sidebar-hidden':
			(!sidebarIsOpened || isInserterOpen || isListViewOpen) &&
			KUBIO_UI_VERSION === 1,
	});

	const secondarySidebarClassName = classNames('kubio-secondary-sidebar', {
		'kubio-secondary-sidebar-hidden':
			!(isInserterOpen || isListViewOpen) && KUBIO_UI_VERSION === 1,
	});

	const { createErrorNotice } = useDispatch('core/notices');

	function onPluginAreaError(name) {
		createErrorNotice(
			sprintf(
				/* translators: %s: plugin name */
				__(
					'The "%s" plugin has encountered an error and cannot be rendered.',
					'kubio'
				),
				name
			)
		);
	}

	let sidebar = <></>;
	let secondarySidebar = <></>;

	if (isReady) {
		switch (KUBIO_UI_VERSION) {
			case 2:
				secondarySidebar = (
					<div className={'kubio-sidebar-v2-wrapper'}>
						{isListViewOpen && (
							<div className={'kubio-sidebar-list-view'}>
								<ListViewSidebar />
							</div>
						)}
						<div className={mainSidebarClassName}>
							<ComplementaryArea.Slot
								scope={`${STORE_KEY}/sidebars`}
							/>
						</div>

						<div className={secondarySidebarClassName}>
							{isInserterOpen && <InserterSidebar />}
						</div>
					</div>
				);

				break;
			default:
				sidebar = (
					<div className={mainSidebarClassName}>
						<ComplementaryArea.Slot
							scope={`${STORE_KEY}/sidebars`}
						/>
					</div>
				);

				secondarySidebar = (
					<div className={secondarySidebarClassName}>
						{isInserterOpen && <InserterSidebar />}
						{isListViewOpen && <ListViewSidebar />}
					</div>
				);
				break;
		}
	}

	const blockContextContent = (
		<KubioEditorStateProvider
			blockContext={blockContext}
			templateId={templateId}
			templateType={templateType}
			page={page}
		>
			<KubioGlobalDataContextProvider>
				<HoveredSectionProvider>
					<GlobalStylesProvider>
						<BlockContextProvider value={blockContext}>
							<GlobalStylesRenderer />
							<KeyboardShortcuts.Register />
							<SidebarComplementaryAreaFills />
							<InterfaceSkeleton
								labels={interfaceLabels}
								drawer={<NavigationSidebar />}
								sidebar={sidebar}
								secondarySidebar={secondarySidebar}
								header={
									<Header
										openEntitiesSavedStates={
											openEntitiesSavedStates
										}
									/>
								}
								notices={<EditorSnackbars />}
								content={
									<>
										<EditorNotices />
										{isFSETemplate && (
											<FSEThemeBlockEditor />
										)}
										{!isFSETemplate && (
											<ClassicThemeBlockEditor />
										)}
										<KeyboardShortcuts
											openEntitiesSavedStates={
												openEntitiesSavedStates
											}
										/>
										<div id={'kubio-toolbar-boundary'} />
									</>
								}
								actions={
									<>
										<EntitiesSavedStates
											isOpen={isEntitiesSavedStatesOpen}
											close={closeEntitiesSavedStates}
										/>
									</>
								}
								footer={<BlockBreadcrumb />}
							/>
							
							{createPortal(
								<div className="kubio-popover-slot-container">
										<Popover.Slot />
									<Popover.Slot name="kubio-popover-slot" />
								</div>,
								document.body
							)}
							<PluginArea onError={onPluginAreaError} />
						</BlockContextProvider>
					</GlobalStylesProvider>
				</HoveredSectionProvider>
			</KubioGlobalDataContextProvider>
		</KubioEditorStateProvider>
	);

	return (
		<div
			className={classNames(
				'kubio-editor-wrapper',
				`kubio-editor-wrapper--media-${activeMedia}`
			)}
		>
			<FullscreenMode isActive />
			<UnsavedChangesWarning />
			<ShortcutProvider>
				<SlotFillProvider>
					<EntityProvider kind="root" type="site">
						{isFSETemplate && (
							<EntityProvider
								kind="postType"
								type={templateType}
								id={templateId}
							>
								<EntityProvider
									kind="postType"
									type="wp_global_styles"
									id={__experimentalGlobalStylesUserEntityId}
								>
									{blockContextContent}
								</EntityProvider>
							</EntityProvider>
						)}
						{!isFSETemplate && blockContextContent}
					</EntityProvider>
				</SlotFillProvider>
			</ShortcutProvider>
			<div id={'vue-main-instance'} />

			{isReady && (
				<>
					<KubioCustomSection />
					<KubioBlogTemplate
						blockContext={blockContext}
						templateId={templateId}
						templateType={templateType}
						page={page}
					/>
				</>
			)}
		</div>
	);
}

export default compose(WithEditorCurrentEntity, pure)(Editor);
