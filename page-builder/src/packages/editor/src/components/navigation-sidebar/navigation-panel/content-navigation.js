/**
 * WordPress dependencies
 */
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigation as Navigation,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigationBackButton as NavigationBackButton,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigationItem as NavigationItem,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNavigationMenu as NavigationMenu,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { STORE_KEY, MainDashboardButton } from '@kubio/editor';
import { MENU_ROOT } from './constants';
import { ContentArea } from './menus/content-area';

export default function ContentNavigation( { onActivateMenu } ) {
	const [ activeMenu, setActiveMenu ] = useState( 'root' );

	const { page } = useSelect(
		( select ) => ( {
			page: select( STORE_KEY ).getPage(),
		} ),
		[]
	);

	const handleActivateMenu = ( menu ) => {
		setActiveMenu( menu );
		onActivateMenu( menu );
	};

	return (
		<Navigation
			activeItem={ page && `content-${ page.path }` }
			activeMenu={ activeMenu }
			onActivateMenu={ handleActivateMenu }
		>
			{ activeMenu === MENU_ROOT && (
				<>
					<MainDashboardButton.Slot>
						<NavigationBackButton
							backButtonLabel={ __(
								'Dashboard',
								'iconvert-promoter'
							) }
							className="edit-site-navigation-panel__back-to-dashboard"
							href="index.php"
						/>
					</MainDashboardButton.Slot>

					<NavigationMenu
						title={ __( 'Promoter', 'iconvert-promoter' ) }
					>
						<NavigationItem
							title={ __( 'My Pop-ups', 'iconvert-promoter' ) }
							href="admin.php?page=iconvertpr-promoter"
						/>
						<NavigationItem
							title={ __( 'Email lists', 'iconvert-promoter' ) }
							href="admin.php?page=iconvertpr-promoter-integrations"
						/>
					</NavigationMenu>
				</>
			) }
		</Navigation>
	);
}
