// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
/**
 * WordPress dependencies
 */
import {
	Button,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigationItem as NavigationItem,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	Icon,
	DropdownMenu,
	MenuGroup,
	MenuItem,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getPathAndQueryString } from '@wordpress/url';
import { home, postList, moreVertical, trash } from '@wordpress/icons';
import { STORE_NAME } from '../../../store/constants';
import { WooCommerceSmallLogo, DuplicateItemIcon } from '@kubio/icons';

import classNames from 'classnames';
import { DuplicatePageModal } from './modals/duplicate-page-modal';
import { DeletePageModal } from './modals/delete-page-modal';
import { ChangeEntityModal } from './modals/change-entity-modal';

const getTitle = (entity) => {
	const title = entity.taxonomy ? entity.name : entity?.title?.rendered;

	// Make sure encoded characters are displayed as the characters they represent.
	const titleElement = document.createElement('div');
	titleElement.innerHTML = title;

	return titleElement.textContent || titleElement.innerText || '';
};

export default function ContentNavigationItem({ item }) {
	const { setPage, setIsNavigationPanelOpened } = useDispatch(STORE_NAME);

	const {
		page_for_posts: pageForPosts,
		page_on_front: pageOnFront,
		show_on_front: showOnFront,
		wooCommercePagesIds,
		isActive,
	} = useSelect((select) => {
		const { page_for_posts, page_on_front, show_on_front } = select(
			'core'
		).getEditedEntityRecord('root', 'site');

		const wcPages = select('core/block-editor').getSettings()
			?.kubioBasicWooCommerce?.pagesIds;

		const { getPage, getTemplateId, getTemplatePartId } = select(
			STORE_NAME
		);

		const currentEntities = [
			getPage()?.context?.postId?.toString(),
			getTemplateId(),
			getTemplatePartId(),
		].filter(Boolean);

		return {
			page_for_posts,
			page_on_front,
			show_on_front,
			wooCommercePagesIds: Object.values(wcPages || {}),
			isActive: currentEntities.includes(item.id.toString()),
		};
	}, []);

	const { duplicateContainerRef, delContainerRef } = useRef();
	const [displayDuplicateModal, setDisplayDuplicateModal] = useState(false);
	const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
	const [displayEntityModal, setDisplayEntityModal] = useState(false);
	const [newRecord, setNewRecord] = useState({});

	const onActivateItem = useCallback(() => {
		const { type, slug, link, id } = newRecord?.id ? newRecord : item;
		setPage({
			type,
			slug,
			path: getPathAndQueryString(link),
			context: {
				postType: type,
				postId: id,
			},
		});

		setIsNavigationPanelOpened(false);
	}, [setPage, item, newRecord]);

	const onNavigationItemClick = useCallback(() => {
		if (isActive) {
			return;
		}

		setDisplayEntityModal(true);
	}, [setDisplayEntityModal]);

	const onClickDuplicateIcon = useCallback(() => {
		setDisplayDuplicateModal(true);
	});

	const onClickDeleteIcon = useCallback(() => {
		setDisplayDeleteModal(true);
	});

	if (!item) {
		return null;
	}

	const titleText = getTitle(item) || __('(no title)', 'kubio');
	const title = titleText;
	let badge;

	if (showOnFront === 'page' && pageOnFront === item.id) {
		badge = <Icon title={__('Homepage', 'kubio')} icon={home} size={18} />;
	}

	if (showOnFront === 'page' && pageForPosts === item.id) {
		badge = (
			<Icon title={__('Posts page', 'kubio')} icon={postList} size={18} />
		);
	}

	if (wooCommercePagesIds.indexOf(item.id) !== -1) {
		badge = (
			<Icon
				title={__('Posts page', 'kubio')}
				icon={WooCommerceSmallLogo}
				size={18}
			/>
		);
	}

	let dropdownMenu;

	const POPOVER_PROPS = {
		className:
			'edit-site-kubio-more-menu__content edit-site-more-menu__content',
		position: 'bottom left',
		isAlternate: true,
	};
	const TOGGLE_PROPS = {
		tooltipPosition: 'bottom',
	};

	const deleteIsEnabled = pageOnFront !== item.id && !isActive;

	if (
		showOnFront === 'page' &&
		item.type === 'page' &&
		pageForPosts !== item.id
	) {
		dropdownMenu = (
			<>
				<DropdownMenu
					className="kubio-more-menu"
					icon={moreVertical}
					label={__('More tools & options', 'kubio')}
					popoverProps={POPOVER_PROPS}
					toggleProps={TOGGLE_PROPS}
				>
					{({ onClose }) => (
						<>
							<MenuGroup>
								<MenuItem
									icon={DuplicateItemIcon}
									ref={duplicateContainerRef}
									onClick={(event) => {
										event.preventDefault();
										onClickDuplicateIcon(event);
										onClose();
									}}
									role="menuitemcheckbox"
								>
									{__('Duplicate', 'kubio')}
								</MenuItem>
								{deleteIsEnabled && (
									<MenuItem
										icon={trash}
										ref={delContainerRef}
										onClick={(event) => {
											event.preventDefault();
											onClickDeleteIcon(event);
											onClose();
										}}
										role="menuitemcheckbox"
									>
										{__('Delete', 'kubio')}
									</MenuItem>
								)}
							</MenuGroup>
						</>
					)}
				</DropdownMenu>
				{displayDuplicateModal && (
					<DuplicatePageModal
						post={item}
						onCloseModal={() => {
							setDisplayDuplicateModal(false);
						}}
						onClickDuplicate={(newRecordObject) => {
							setNewRecord(newRecordObject);
							setDisplayDuplicateModal(false);
							setDisplayEntityModal(true);
						}}
					/>
				)}
				{displayDeleteModal && (
					<DeletePageModal
						post={item}
						onCloseModal={() => {
							setDisplayDeleteModal(false);
						}}
					/>
				)}
			</>
		);
	}

	const className = classNames('edit-site-navigation-panel__content-item', {
		'kubio-navigation-item-active': isActive,
	});

	return (
		<>
			<NavigationItem
				className={className}
				item={`${item.taxonomy || item.type}-${item.id}`}
				title={title}
			>
				<Button onClick={onNavigationItemClick}>
					{badge && (
						<span className="components-navigation__item-badge">
							{badge}
						</span>
					)}
					<span className="components-truncate components-text components-navigation__item-title">
						{title}
					</span>
				</Button>
				{dropdownMenu}
			</NavigationItem>
			{displayEntityModal && (
				<ChangeEntityModal
					onComplete={onActivateItem}
					closeModal={() => setDisplayEntityModal(false)}
					entityName={title}
				/>
			)}
		</>
	);
}
