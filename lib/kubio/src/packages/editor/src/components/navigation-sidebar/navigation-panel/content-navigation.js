/**
 * WordPress dependencies
 */
import {
	__experimentalNavigation as Navigation,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigationBackButton as NavigationBackButton,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigationItem as NavigationItem,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigationMenu as NavigationMenu,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { STORE_KEY } from '../../../store/constants';
import MainDashboardButton from '../../main-dashboard-button';
import { MENU_ROOT } from './constants';
import { ContentArea } from './menus/content-area';

export default function ContentNavigation({ onActivateMenu, activeMenu }) {
	const { page } = useSelect(
		(select) => ({
			page: select(STORE_KEY).getPage(),
		}),
		[]
	);

	const handleActivateMenu = (menu) => {
		onActivateMenu(menu);
	};

	const contentItems = useMemo(
		() => [
			{
				kind: 'postType',
				entity: 'page',
				title: __('Pages', 'kubio'),
			},
			{
				kind: 'postType',
				entity: 'post',
				title: __('Posts', 'kubio'),
			},
			{
				kind: 'taxonomy',
				entity: 'category',
				title: __('Categories', 'kubio'),
			},
			...(window?.kubioEditSiteSettings?.postTypes.filter(
				(postType) => postType.entity !== 'kubio_section'
			) || []),
		],
		[window?.kubioEditSiteSettings?.postTypes]
	);

	return (
		<Navigation
			activeItem={page && `content-${page.path}`}
			activeMenu={activeMenu}
			onActivateMenu={handleActivateMenu}
		>
			{activeMenu === MENU_ROOT && (
				<MainDashboardButton.Slot>
					<NavigationBackButton
						backButtonLabel={__('Dashboard', 'kubio')}
						className="edit-site-navigation-panel__back-to-dashboard"
						href="index.php"
					/>
				</MainDashboardButton.Slot>
			)}

			<NavigationMenu title={__('Site Content', 'kubio')}>
				{contentItems?.map(({ kind, entity, title }) => (
					<NavigationItem
						title={title}
						navigateToMenu={`kubio-content-area-${kind}-${entity}`}
						key={`${kind}-${entity}`}
					/>
				))}
			</NavigationMenu>

			{contentItems?.map((itemData) => (
				<ContentArea
					{...itemData}
					key={`${itemData.kind}-${itemData.entity}`}
				/>
			))}
		</Navigation>
	);
}
