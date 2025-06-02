import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigationItem as NavigationItem,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigationMenu as NavigationMenu,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { currentTemplateIsPage, currentTemplateIsPost } from '@kubio/core';
import { useSelect } from '@wordpress/data';
import { useCallback, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	MENU_ROOT,
	MENU_TEMPLATES,
	MENU_TEMPLATES_GENERAL,
	MENU_TEMPLATES_PAGES,
	MENU_TEMPLATES_POSTS,
} from '../constants';
import NewTemplateDropdown from '../new-template-dropdown';
import SearchResults from '../search-results';
import TemplateCategories from './templates-categories';

export default function TemplatesMenu() {
	const [search, setSearch] = useState('');
	const onSearch = useCallback((value) => {
		setSearch(value);
	});

	const { templates } = useSelect((select) => {
		const { getEntityRecords } = select(coreStore);
		return {
			templates: getEntityRecords('postType', 'wp_template', {
				per_page: -1,
			}),
		};
	}, []);

	const templatesBySlug = useMemo(() => {
		return (templates || []).reduce((acc, template) => {
			let category = 'general';
			const slug = template.slug;

			if (currentTemplateIsPage(slug)) {
				category = 'page';
			}

			if (currentTemplateIsPost(slug)) {
				category = 'post';
			}

			return {
				...acc,
				[category]: [...(acc[category] || []), template],
			};
		}, {});
	}, [templates]);

	return (
		<>
			<NavigationMenu
				menu={MENU_TEMPLATES}
				title={__('Templates', 'kubio')}
				titleAction={<NewTemplateDropdown />}
				parentMenu={MENU_ROOT}
				hasSearch={true}
				onSearch={onSearch}
				search={search}
			>
				{search && <SearchResults items={templates} search={search} />}

				{!search && (
					<>
						{!!templatesBySlug.page?.length && (
							<NavigationItem
								navigateToMenu={MENU_TEMPLATES_PAGES}
								title={__('Page templates', 'kubio')}
								hideIfTargetMenuEmpty
							/>
						)}
						{!!templatesBySlug.post?.length && (
							<NavigationItem
								navigateToMenu={MENU_TEMPLATES_POSTS}
								title={__('Post templates', 'kubio')}
								hideIfTargetMenuEmpty
							/>
						)}
						{!!templatesBySlug.general?.length && (
							<NavigationItem
								navigateToMenu={MENU_TEMPLATES_GENERAL}
								title={__('General templates', 'kubio')}
								hideIfTargetMenuEmpty
							/>
						)}
					</>
				)}

				{!search && templates === null && (
					<NavigationItem title={__('Loading…', 'kubio')} isText />
				)}
			</NavigationMenu>
			{!!templatesBySlug.page?.length && (
				<TemplateCategories
					menu={MENU_TEMPLATES_PAGES}
					title={__('Page templates', 'kubio')}
					templates={templatesBySlug.page}
					hasAdd={false}
					category={'page'}
				/>
			)}
			{!!templatesBySlug.post?.length && (
				<TemplateCategories
					menu={MENU_TEMPLATES_POSTS}
					title={__('Post templates', 'kubio')}
					templates={templatesBySlug.post}
					category={'post'}
					hasAdd={false}
				/>
			)}

			{!!templatesBySlug.general?.length && (
				<TemplateCategories
					menu={MENU_TEMPLATES_GENERAL}
					title={__('General templates', 'kubio')}
					templates={templatesBySlug.general}
					hasAdd={false}
					category={'general'}
				/>
			)}
		</>
	);
}
