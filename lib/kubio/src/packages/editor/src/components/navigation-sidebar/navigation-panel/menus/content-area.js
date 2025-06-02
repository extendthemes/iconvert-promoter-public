/**
 * WordPress dependencies
 */
import {
	STORE_KEY,
	templateGroupPriorities,
	templateGroups,
} from '@kubio/constants';
import { useDeepMemo } from '@kubio/core';
import { useSetGlobalSessionProp } from '@kubio/editor-data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	Icon,
	Modal,
	SelectControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalInputControl as InputControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigationItem as NavigationItem,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigationMenu as NavigationMenu,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
import {
	dispatch as storeDispatch,
	useDispatch,
	useRegistry,
	useSelect,
} from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { home, plus } from '@wordpress/icons';
import { getPathAndQueryString } from '@wordpress/url';
import _, { find, isArray, uniqBy } from 'lodash';
import { MENU_ROOT } from '../constants';
import ContentNavigationItem from '../content-navigation-item';
import { ChangeEntityModal } from '../modals/change-entity-modal';
import SearchResults from '../search-results';
import useDebouncedSearch from '../use-debounced-search';

const ContentArea = ({
	kind = 'postType',
	entity,
	title,
	hasSearch = true,
	parentMenu = MENU_ROOT,
}) => {
	const {
		search,
		searchQuery,
		onSearch,
		isDebouncing,
	} = useDebouncedSearch();

	const registry = useRegistry();
	const { resetSelection } = registry.dispatch(blockEditorStore);
	const { setPage, setIsNavigationPanelOpened } = useDispatch(STORE_KEY);
	const { saveEntityRecord } = storeDispatch('core');
	const {
		items,
		showOnFront,
		pageForPosts,
		pageOnFront,
		isResolved,
		siteURL,
	} = useSelect(
		(select) => {
			const {
				getEntityRecords,
				getEditedEntityRecord,
				hasFinishedResolution,
				getEntityRecord,
			} = select('core');
			const getEntityRecodsArgs = [
				kind,
				entity,
				{
					search: searchQuery,
					status: 'publish,private',
					per_page: 50,
				},
			];
			const hasResolved = hasFinishedResolution(
				'getEntityRecords',
				getEntityRecodsArgs
			);

			// eslint-disable-next-line camelcase
			const { page_for_posts, page_on_front } = select(
				'core'
			).getEditedEntityRecord('root', 'site');

			let queryItems = getEntityRecords(...getEntityRecodsArgs);

			if (
				kind === 'postType' &&
				entity === 'page' &&
				isArray(queryItems)
			) {
				const frontPage = getEntityRecord(
					'postType',
					'page',
					page_on_front
				);

				const postsPage = getEntityRecord(
					'postType',
					'page',
					page_for_posts
				);

				queryItems = [frontPage, postsPage, ...queryItems].filter(
					Boolean
				);

				queryItems = uniqBy(queryItems, (item) => parseInt(item?.id));
			}

			return {
				items: queryItems,
				isResolved: hasResolved,
				showOnFront: getEditedEntityRecord('root', 'site')
					.show_on_front,
				siteURL:
					select('core/block-editor').getSettings().siteUrl || '/',
				// eslint-disable-next-line camelcase
				pageForPosts: page_for_posts,
				// eslint-disable-next-line camelcase
				pageOnFront: page_on_front,
				getEntityRecord,
			};
		},
		[searchQuery, entity, kind]
	);
	const [addNewTitle, setAddNewTitle] = useState('');
	const [displayModal, setDisplayModal] = useState(false);
	const [displayEntityModal, setDisplayEntityModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [newRecord, setNewRecord] = useState({});

	const onClickAdd = useCallback(() => {
		setDisplayModal(false);
		setDisplayEntityModal(true);
	}, [setDisplayEntityModal]);

	// eslint-disable-next-line no-shadow
	const onNewRecord = async (kind, entity) => {
		setIsSubmitting(true);
		const newRecordData = {
			title: addNewTitle,
			status: 'publish',
			template: newPageTemplate,
			meta: {
				saved_in_kubio: true,
			},
		};

		const newRecordObject = await saveEntityRecord(
			kind,
			entity,
			newRecordData
		);
		if (newRecordObject) {
			setNewRecord(newRecordObject);
			onClickAdd();
			setIsSubmitting(false);
			setAddNewTitle('');
		}
	};

	const { availableTemplates, isKubioTheme } = useSelect((select) => {
		const selectStore = select(STORE_KEY);
		const { getSettings } = select(blockEditorStore);

		return {
			availableTemplates: selectStore.getAvailablePageTemplates(),
			isKubioTheme: getSettings().isKubioTheme,
		};
	}, []);

	const { templates, defaultTemplate } = useDeepMemo(() => {
		let defaultTemplate_;
		const pageDefaultTemplate = '';
		let blockTemplates = availableTemplates;

		if (isKubioTheme) {
			defaultTemplate_ = !!_.find(blockTemplates, {
				value: 'kubio-full-width',
			})
				? 'kubio-full-width'
				: 'full-width';
			blockTemplates = availableTemplates; /* .filter(
				(template) => template.value !== pageDefaultTemplate
			) */
		} else {
			defaultTemplate_ = pageDefaultTemplate;
			// if the page template is not found use the kubio full width template as default
			if (!find(blockTemplates, { value: defaultTemplate_ })) {
				defaultTemplate_ = !!_.find(blockTemplates, {
					value: 'kubio-full-width',
				})
					? 'kubio-full-width'
					: 'full-width';
			}
		}

		return {
			defaultTemplate: defaultTemplate_,
			templates: blockTemplates,
		};
	}, [availableTemplates, isKubioTheme]);

	const [newPageTemplate, setNewPageTemplate] = useState(defaultTemplate);

	const templateOptions = useDeepMemo(() => {
		const groupedTemplates = templates.reduce((acc, item) => {
			const key = item.source || 'custom';
			return {
				...acc,
				[key]: [...(acc[key] || []), item],
			};
		}, {});

		const returnTemplates = [];
		_.forEach(templateGroupPriorities, function (key) {
			if (groupedTemplates[key]?.length) {
				returnTemplates.push({
					value: 'template-group-' + key,
					label: templateGroups[key],
					disabled: true,
				});
				_.forEach(groupedTemplates[key], function (template) {
					returnTemplates.push(template);
				});
			}
		});

		return returnTemplates;
	}, [templates]);

	const [
		isOnActivationFrontChangingEntity,
		setOnActivationFrontChangingEntity,
	] = useState(false);

	const onActivateFrontItem = useCallback(() => {
		setOnActivationFrontChangingEntity(false);
		setPage({
			type: 'page',
			path: siteURL,
			context: {
				queryContext: { page: 1 },
			},
		});
		setIsNavigationPanelOpened(false);
	}, [setPage]);

	const setEditorReady = useSetGlobalSessionProp('ready');
	const onSwitchToPage = useCallback(() => {
		if (newRecord) {
			setPage({
				type: newRecord.type,
				slug: newRecord.slug,
				path: getPathAndQueryString(newRecord.link),
				context: {
					postType: newRecord.type,
					postId: newRecord.id,
				},
			});
			setIsSubmitting(false);
			setIsNavigationPanelOpened(false);
			setTimeout(() => setEditorReady(true), 5000);
		}
	}, [setPage, newRecord]);

	const shouldShowLoadingForDebouncing = search && isDebouncing;
	const showLoading = !isResolved || shouldShowLoadingForDebouncing;

	let addNewEntity = <></>;
	if (kind === 'postType' && entity === 'page') {
		addNewEntity = (
			<>
				<Button
					isPrimary
					icon={plus}
					iconPosition={'right'}
					onClick={() => {
						setDisplayModal(true);
					}}
					className={'kubio-new-page-btn'}
					label={__('New', 'kubio')}
				>
					{__('New', 'kubio')}
				</Button>
				{displayModal && (
					<>
						<Modal
							title={__('Add page', 'kubio')}
							onRequestClose={() => {
								setDisplayModal(false);
							}}
							className="block-editor-block-new-entity-modal"
							shouldCloseOnEsc={!isSubmitting}
							shouldCloseOnClickOutside={!isSubmitting}
							isDismissible={!isSubmitting}
						>
							<div className={'popover__content'}>
								<InputControl
									value={addNewTitle}
									onChange={(value) => setAddNewTitle(value)}
									label={__('Title', 'kubio')}
									// eslint-disable-next-line jsx-a11y/no-autofocus
									autoFocus={true}
									onKeyPress={(event) => {
										if (event.key === 'Enter') {
											onNewRecord(kind, entity);
										}
									}}
								/>
								<Spacer margin={3} />
								<SelectControl
									value={newPageTemplate}
									onChange={(value) =>
										setNewPageTemplate(value)
									}
									label={__('Template', 'kubio')}
									options={templateOptions}
								/>
								<Spacer margin={6} />
								<Button
									isPrimary
									isBusy={isSubmitting}
									disabled={
										isSubmitting ||
										addNewTitle.trim() === ''
									}
									onClick={() => {
										resetSelection(0, 0, null);
										onNewRecord(kind, entity);
									}}
									className={'add-button'}
								>
									{__('Add page', 'kubio')}
								</Button>
							</div>
						</Modal>
					</>
				)}
				{displayEntityModal && (
					<ChangeEntityModal
						onComplete={onSwitchToPage}
						closeModal={() => setDisplayEntityModal(false)}
						entityName={addNewTitle}
					/>
				)}
			</>
		);
	}

	const itemsSorted = _.sortBy(items, (item) => {
		return showOnFront === 'page' &&
			(pageForPosts === item.id || pageOnFront === item.id)
			? 0
			: 1;
	});

	return (
		<NavigationMenu
			menu={`kubio-content-area-${kind}-${entity}`}
			title={title}
			parentMenu={parentMenu}
			hasSearch={hasSearch}
			onSearch={onSearch}
			search={search}
			isSearchDebouncing={isDebouncing || !isResolved}
			titleAction={addNewEntity}
			className={'kubio-nav-menu-heading'}
		>
			{search && !isDebouncing && (
				<SearchResults
					items={itemsSorted}
					search={search}
					disableFilter
				/>
			)}

			{!search && (
				<>
					{showOnFront === 'posts' && (
						<NavigationItem
							item={'post-/'}
							title={__('All Posts', 'kubio')}
							onClick={() =>
								setOnActivationFrontChangingEntity(true)
							}
						>
							<Button className="components-button css-1g713f0 ejwewyf3">
								<Flex align={'center'}>
									<FlexItem>
										<Icon icon={home} size={18} />
									</FlexItem>
									<FlexBlock>
										<span>{__('All Posts', 'kubio')}</span>
									</FlexBlock>
									{isOnActivationFrontChangingEntity && (
										<ChangeEntityModal
											onComplete={onActivateFrontItem}
											closeModal={() =>
												setDisplayEntityModal(false)
											}
											entityName={addNewTitle}
										/>
									)}
								</Flex>
							</Button>
						</NavigationItem>
					)}

					{itemsSorted?.map((item) => (
						<ContentNavigationItem
							item={item}
							key={`${item.type || item.taxonomy}-${item.id}`}
						/>
					))}
				</>
			)}

			{showLoading && (
				<NavigationItem title={__('Loading…', 'kubio')} isText />
			)}
		</NavigationMenu>
	);
};

export { ContentArea };
