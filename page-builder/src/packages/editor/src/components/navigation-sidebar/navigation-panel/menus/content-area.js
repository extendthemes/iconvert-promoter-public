/**
 * WordPress dependencies
 */
import {
	STORE_KEY,
	templateGroupPriorities,
	templateGroups,
} from '@kubio/constants';
import { useDeepMemo } from '@kubio/core';
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
import _, { find, isEmpty } from 'lodash';
import { MENU_ROOT } from '../constants';
import { NavigationSidebarComponents } from '@kubio/editor';
const { ContentNavigationItem, SearchResults, useDebouncedSearch } =
	NavigationSidebarComponents;

const ContentArea = ( {
	kind = 'postType',
	entity,
	title,
	hasSearch = true,
	parentMenu = MENU_ROOT,
} ) => {
	const { search, searchQuery, onSearch, isDebouncing } =
		useDebouncedSearch();

	const { setPage, setIsNavigationPanelOpened } = useDispatch( STORE_KEY );
	const {
		items,
		showOnFront,
		pageForPosts,
		pageOnFront,
		isResolved,
		siteURL,
	} = useSelect(
		( select ) => {
			const {
				getEntityRecords,
				getEditedEntityRecord,
				hasFinishedResolution,
			} = select( 'core' );
			const getEntityRecodsArgs = [
				kind,
				entity,
				{
					search: searchQuery,
				},
			];
			const hasResolved = hasFinishedResolution(
				'getEntityRecords',
				getEntityRecodsArgs
			);

			// eslint-disable-next-line camelcase
			const { page_for_posts, page_on_front } = select(
				'core'
			).getEditedEntityRecord( 'root', 'site' );

			return {
				items: getEntityRecords( ...getEntityRecodsArgs ),
				isResolved: hasResolved,
				showOnFront: getEditedEntityRecord( 'root', 'site' )
					.show_on_front,
				siteURL:
					select( 'core/block-editor' ).getSettings().siteUrl || '/',
				pageForPosts: page_for_posts,
				pageOnFront: page_on_front,
			};
		},
		[ searchQuery, entity, kind ]
	);

	const shouldShowLoadingForDebouncing = search && isDebouncing;
	const showLoading = ! isResolved || shouldShowLoadingForDebouncing;

	const itemsSorted = _.sortBy( items, ( item ) => {
		return showOnFront === 'page' &&
			( pageForPosts === item.id || pageOnFront === item.id )
			? 0
			: 1;
	} );

	return (
		<NavigationMenu
			menu={ `kubio-content-area-${ kind }-${ entity }` }
			title={ title }
			parentMenu={ parentMenu }
			hasSearch={ hasSearch }
			onSearch={ onSearch }
			search={ search }
			isSearchDebouncing={ isDebouncing || ! isResolved }
			className={ 'kubio-nav-menu-heading' }
		>
			{ search && ! isDebouncing && (
				<SearchResults
					items={ itemsSorted }
					search={ search }
					disableFilter
				/>
			) }

			{ ! search && (
				<>
					{ itemsSorted?.map( ( item ) => (
						<ContentNavigationItem
							item={ item }
							key={ `${ item.type || item.taxonomy }-${
								item.id
							}` }
						/>
					) ) }
				</>
			) }

			{ showLoading && (
				<NavigationItem
					title={ __( 'Loading…', 'iconvert-promoter' ) }
					isText
				/>
			) }
		</NavigationMenu>
	);
};

export { ContentArea };
