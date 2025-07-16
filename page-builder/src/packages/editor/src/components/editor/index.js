import { initializeGutentagPatterns } from '@kubio/block-patterns';
/**
 * WordPress dependencies
 */
import { STORE_KEY } from '@kubio/constants';
import { useActiveMedia } from '@kubio/core';
import {
	ClassicThemeBlockEditor,
	EditorComponents,
	EntitiesSavedStates,
	FSEThemeBlockEditor,
	HoveredSectionProvider,
	InserterSidebar,
	KeyboardShortcuts,
	ListViewSidebar,
	URLQueryController,
	useBlockSelectionListener,
} from '@kubio/editor';
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
	EditorSnackbars,
	store as editorStore,
	UnsavedChangesWarning,
} from '@wordpress/editor';
import {
	createPortal,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	ComplementaryArea,
	FullscreenMode,
	InterfaceSkeleton,
} from '@wordpress/interface';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';
import { PluginArea } from '@wordpress/plugins';
import classNames from 'classnames';
import _ from 'lodash';

import Header from '../header';
import NavigationSidebar from '../navigation-sidebar';
import { SidebarComplementaryAreaFills } from '../sidebar';

const { optrixBlinkingLogoHtml } = window.kubioUtilsData;
const OptrixBlinkingLogo = (
	<div dangerouslySetInnerHTML={ { __html: optrixBlinkingLogoHtml } } />
);
const {
	KubioEditorStateProvider,
	GlobalStylesRenderer,
	useSidebarTabAutochange,
} = EditorComponents;

const interfaceLabels = {
	secondarySidebar: __( 'Block Library', 'iconvert-promoter' ),
	drawer: __( 'Navigation Sidebar', 'iconvert-promoter' ),
};

const WithEditorCurrentEntity = createHigherOrderComponent(
	( WrappedComponent ) => {
		return ( { initialSettings } ) => {
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
			} = useSelect( ( select ) => {
				const {
					isFeatureActive,
					getSettings,
					getEditedPostType,
					getEditedPostId,
					getPage,
					isNavigationOpened,
					isListViewOpened,
				} = select( STORE_KEY );

				const postType = getEditedPostType();
				const postId = getEditedPostId();

				// The currently selected entity to display. Typically template or template part.
				return {
					isFullscreenActive: isFeatureActive( 'fullscreenMode' ),
					sidebarIsOpened:
						select( STORE_KEY ).isEditorSidebarOpened(),
					settings: getSettings(),
					templateType: postType,
					page: getPage(),
					templateId: postId,
					isNavigationOpen: isNavigationOpened(),
					isInserterOpen: select( STORE_KEY ).getOpenedInserter(),
					isFSETemplate: true,
					isListViewOpen: isListViewOpened(),
				};
			}, [] );

			const { postId, post, currentTemplateId, isKubioTheme } = useSelect(
				( select ) => {
					// console.error('post 1 ->', page);

					const postId_ = _.get( page, [ 'context', 'postId' ] );
					const postType = _.get( page, [ 'context', 'postType' ] );
					const { getEditorSettings } = select( editorStore );
					const { getEntityRecord, getEntityRecords } =
						select( 'core' );
					const { getTemplateId = _.noop } =
						select( 'kubio/edit-site' );
					const isTemplate = [
						'wp_template',
						'wp_template_part',
					].includes( postType );

					// Ideally the initializeEditor function should be called using the ID of the REST endpoint.
					// to avoid the special case.
					let postObject;
					if ( isTemplate ) {
						const posts = getEntityRecords( 'postType', postType, {
							wp_id: postId_,
						} );
						postObject = posts?.[ 0 ];
					} else {
						postObject = getEntityRecord(
							'postType',
							postType,
							postId_
						);
					}
					const currentTemplateId_ = getTemplateId();

					const isKubioTheme_ =
						getEditorSettings().supportsTemplateMode;
					return {
						postId: postId_,
						currentTemplateId: currentTemplateId_,
						isKubioTheme: isKubioTheme_,
						post: postObject,
					};
				},
				[ page?.context?.postId, page?.context?.postType ]
			);

			// console.error('post ->', post);

			const { openSidebar } = useDispatch( STORE_KEY );

			useEffect( () => {
				openSidebar( 'document' );
			}, [] );
			const { editEntityRecord } = useDispatch( 'core' );
			const { updateEditorSettings, setupEditor } =
				useDispatch( 'core/editor' );

			// Keep the defaultTemplateTypes in the core/editor settings too,
			// so that they can be selected with core/editor selectors in any editor.
			// This is needed because edit-site doesn't initialize with EditorProvider,
			// which internally uses updateEditorSettings as well.
			const { defaultTemplateTypes } = settings;
			useEffect( () => {
				updateEditorSettings( initialSettings );
			}, [ defaultTemplateTypes ] );

			useEffect( () => {
				updateEditorSettings( {
					...initialSettings,
					defaultTemplateTypes,
				} );
			}, [ defaultTemplateTypes ] );

			const lastPostIdAdded = useRef();
			// setup editor with post data for page settings.
			useLayoutEffect( () => {
				if ( post && post?.id !== lastPostIdAdded.current ) {
					lastPostIdAdded.current = post?.id;
					setupEditor( post );
				}
			}, [ postId, post ] );

			//full width template is set from php. This logic is used to make a edit to the template so it updates
			//on save
			useLayoutEffect( () => {
				if ( post && typeof currentTemplateId === 'string' ) {
					//for third party themes the full width template is called kubio-full-width
					const fullWidthTemplateSlug = isKubioTheme
						? 'full-width'
						: 'kubio-full-width';
					const templateIsFullWidth = currentTemplateId.includes(
						fullWidthTemplateSlug
					);
					const postContent = _.get( post, [ 'content', 'raw' ] );
					const postSavedTemplate = _.get( post, 'template' );
					const postId_ = _.get( post, 'id' );
					const postType = _.get( post, 'type' );
					if (
						! postContent &&
						templateIsFullWidth &&
						postSavedTemplate === ''
					) {
						editEntityRecord( 'postType', postType, postId_, {
							template: fullWidthTemplateSlug,
						} );
					}
				}
			}, [ postId ] );

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
					<WrappedComponent { ...props } />
					<URLQueryController />
				</>
			);
		};
	},
	'WithEditorCurrentEntity'
);

function Editor( props ) {
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

	const { setPage } = useDispatch( 'core/editor' );

	const activeMedia = useActiveMedia();
	const [ isEntitiesSavedStatesOpen, setIsEntitiesSavedStatesOpen ] =
		useState( false );
	const openEntitiesSavedStates = useCallback(
		() => setIsEntitiesSavedStatesOpen( true ),
		[]
	);
	const closeEntitiesSavedStates = useCallback( () => {
		setIsEntitiesSavedStatesOpen( false );
	}, [] );

	useBlockSelectionListener();
	useSidebarTabAutochange();
	const isReady = useGetGlobalSessionProp( 'ready', false );

	const blockContext = useMemo( () => {
		return {
			...page?.context,
			queryContext: [
				page?.context.queryContext || { page: 1 },
				( newQueryContext ) =>
					setPage( {
						...page,
						context: {
							...page?.context,
							queryContext: {
								...page?.context.queryContext,
								...newQueryContext,
							},
						},
					} ),
			],
		};
	}, [ JSON.stringify( page?.context ) ] );

	useEffect( () => {
		if ( isNavigationOpen ) {
			document.body.classList.add( 'is-navigation-sidebar-open' );
		} else {
			document.body.classList.remove( 'is-navigation-sidebar-open' );
		}
	}, [ isNavigationOpen ] );

	useEffect( () => initializeGutentagPatterns(), [] );

	const mainSidebarClassName = classNames( 'kubio-sidebar', {
		'kubio-sidebar-hidden':
			! sidebarIsOpened || isInserterOpen || isListViewOpen,
	} );

	const secondarySidebarClassName = classNames( 'kubio-secondary-sidebar', {
		'kubio-secondary-sidebar-hidden': ! (
			isInserterOpen || isListViewOpen
		),
	} );

	const blockContextContent = (
		<KubioEditorStateProvider
			blockContext={ blockContext }
			templateId={ templateId }
			templateType={ templateType }
			page={ page }
		>
			<KubioGlobalDataContextProvider>
				<HoveredSectionProvider>
					<GlobalStylesProvider>
						<BlockContextProvider value={ blockContext }>
							<GlobalStylesRenderer />
							<KeyboardShortcuts.Register />
							<SidebarComplementaryAreaFills />
							<InterfaceSkeleton
								labels={ interfaceLabels }
								drawer={ <NavigationSidebar /> }
								secondarySidebar={
									<div
										className={ secondarySidebarClassName }
									>
										{ isInserterOpen && (
											<InserterSidebar />
										) }
										{ isListViewOpen && (
											<ListViewSidebar />
										) }
									</div>
								}
								sidebar={
									<div className={ mainSidebarClassName }>
										<ComplementaryArea.Slot
											scope={ `${ STORE_KEY }/sidebars` }
										/>
									</div>
								}
								header={
									<Header
										openEntitiesSavedStates={
											openEntitiesSavedStates
										}
									/>
								}
								notices={ <EditorSnackbars /> }
								content={
									<>
										<EditorNotices />
										{ isFSETemplate && (
											<FSEThemeBlockEditor
												KubioBlinkingLogoIframeHtml={
													OptrixBlinkingLogo
												}
											/>
										) }
										{ ! isFSETemplate && (
											<ClassicThemeBlockEditor
												KubioBlinkingLogoIframeHtml={
													OptrixBlinkingLogo
												}
											/>
										) }
										<KeyboardShortcuts
											openEntitiesSavedStates={
												openEntitiesSavedStates
											}
										/>
										<div id={ 'kubio-toolbar-boundary' } />
									</>
								}
								actions={
									<>
										<EntitiesSavedStates
											isOpen={ isEntitiesSavedStatesOpen }
											close={ closeEntitiesSavedStates }
										/>
									</>
								}
								footer={ <BlockBreadcrumb /> }
							/>
							<Popover.Slot />
							{ createPortal(
								<div className="kubio-popover-slot-container">
									<Popover.Slot name="kubio-popover-slot" />
								</div>,
								document.body
							) }
							<PluginArea />
						</BlockContextProvider>
					</GlobalStylesProvider>
				</HoveredSectionProvider>
			</KubioGlobalDataContextProvider>
		</KubioEditorStateProvider>
	);

	return (
		<div
			className={ classNames(
				'kubio-editor-wrapper',
				`kubio-editor-wrapper--media-${ activeMedia }`
			) }
		>
			<FullscreenMode isActive />
			<UnsavedChangesWarning />
			<ShortcutProvider>
				<SlotFillProvider>
					<EntityProvider kind="root" type="site">
						{ isFSETemplate && (
							<EntityProvider
								kind="postType"
								type={ templateType }
								id={ templateId }
							>
								<EntityProvider
									kind="postType"
									type="wp_global_styles"
									id={
										__experimentalGlobalStylesUserEntityId
									}
								>
									{ blockContextContent }
								</EntityProvider>
							</EntityProvider>
						) }
						{ ! isFSETemplate && blockContextContent }
					</EntityProvider>
				</SlotFillProvider>
			</ShortcutProvider>
		</div>
	);
}

export default compose( WithEditorCurrentEntity, pure )( Editor );
