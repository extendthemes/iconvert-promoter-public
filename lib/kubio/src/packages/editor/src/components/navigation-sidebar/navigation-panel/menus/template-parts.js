import {
	__experimentalNavigationItem as NavigationItem,
	__experimentalNavigationMenu as NavigationMenu,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { groupBy } from 'lodash';
import {
	MENU_ROOT,
	MENU_TEMPLATE_PARTS,
	TEMPLATE_PARTS_SUB_MENUS,
} from '../constants';
import SearchResults from '../search-results';
import TemplatePartsSubMenu from './template-parts-sub';

export default function TemplatePartsMenu() {
	const [search, setSearch] = useState('');
	const onSearch = useCallback((value) => {
		setSearch(value);
	});

	const { isLoading, templateParts, templatePartsByArea } = useSelect(
		(select) => {
			const templatePartRecords = select(coreStore).getEntityRecords(
				'postType',
				'wp_template_part'
			);

			const _templateParts = templatePartRecords || [];
			// const _templatePartsByArea = groupBy(_templateParts, 'area');

			const _templatePartsByArea = groupBy(
				_templateParts.map((item) => ({
					...item,
					area: item.area || 'uncategorized',
				})),
				'area'
			);
			return {
				isLoading: templatePartRecords === null,
				templateParts: _templateParts,
				templatePartsByArea: _templatePartsByArea,
			};
		},
		[]
	);

	return (
		<>
			<NavigationMenu
				menu={MENU_TEMPLATE_PARTS}
				title={__('Template Parts', 'kubio')}
				parentMenu={MENU_ROOT}
				hasSearch={true}
				onSearch={onSearch}
				search={search}
			>
				{search && (
					<SearchResults items={templateParts} search={search} />
				)}

				{!search &&
					TEMPLATE_PARTS_SUB_MENUS.map(({ title, menu }) => (
						<NavigationItem
							key={`template-parts-navigate-to-${menu}`}
							navigateToMenu={menu}
							title={title}
							hideIfTargetMenuEmpty
						/>
					))}

				{!search && isLoading && (
					<NavigationItem title={__('Loading…', 'kubio')} isText />
				)}
			</NavigationMenu>

			{TEMPLATE_PARTS_SUB_MENUS.map(({ area, menu, title }) => (
				<TemplatePartsSubMenu
					key={`template-parts-menu-${menu}`}
					menu={menu}
					title={title}
					templateParts={templatePartsByArea[area]}
				/>
			))}
		</>
	);
}
