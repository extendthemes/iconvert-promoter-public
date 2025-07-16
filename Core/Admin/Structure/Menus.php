<?php

namespace CSPromo\Core\Admin\Structure;

use CSPromo\Core\Router;

class Menus {

	public function init() {
		add_action( 'admin_menu', array( $this, 'add_plugin_pages' ) );
	}

	public function add_plugin_pages() {
		$router = new Router( ICONVERTPR_PAGE_ID );

		$hook = \add_menu_page(
			__( 'iConvert Promoter', 'iconvert-promoter' ),
			__( 'iConvert Promoter', 'iconvert-promoter' ),
			'manage_options',
			ICONVERTPR_PAGE_ID,
			$router->display(),
			ICONVERTPR_URL . '/admin/assets/images/main-menu-icon.png',
			20
		);

		iconvertpr_registry_set( 'settings_page_hook', $hook );

		$hook = \add_submenu_page(
			ICONVERTPR_PAGE_ID,
			__( 'Campaigns', 'iconvert-promoter' ),
			__( 'Campaigns', 'iconvert-promoter' ),
			'manage_options',
			ICONVERTPR_PAGE_ID,
			$router->display()
		);

		$router = new Router( ICONVERTPR_PAGE_SUBSCRIBERS );

		$hookSubpage = \add_submenu_page(
			ICONVERTPR_PAGE_ID,
			__( 'Email lists', 'iconvert-promoter' ),
			__( 'Email lists', 'iconvert-promoter' ),
			'manage_options',
			ICONVERTPR_PAGE_SUBSCRIBERS,
			$router->display()
		);

		iconvertpr_registry_set( 'popup_page_edit_hook', $hookSubpage );

		$router = new Router( ICONVERTPR_PAGE_INTEGRATIONS );

		$integrations_page = \add_submenu_page(
			ICONVERTPR_PAGE_ID,
			__( 'Integrations', 'iconvert-promoter' ),
			__( 'Integrations', 'iconvert-promoter' ),
			'manage_options',
			ICONVERTPR_PAGE_INTEGRATIONS,
			$router->display()
		);

		iconvertpr_registry_set( 'popup_page_integrations_hook', $integrations_page );

		if ( apply_filters( 'iconvertpr_feature_available_only_in_pro', true ) ) {
			$router = new Router( ICONVERTPR_PAGE_UPGRADE );

			$license_page = \add_submenu_page(
				ICONVERTPR_PAGE_ID,
				__( 'Upgrade to PRO', 'iconvert-promoter' ),
				sprintf(
					'<span class="iconvertpr-upgrade-menu-item"><span>%s</span>%s</span>',
					'<span class="dashicons dashicons-superhero-alt"></span>',
					__( 'Upgrade to PRO', 'iconvert-promoter' )
				),
				'manage_options',
				ICONVERTPR_PAGE_UPGRADE,
				$router->display()
			);

			wp_add_inline_style(
				'admin-menu',
				'.iconvertpr-upgrade-menu-item { display: flex; align-items: center; gap: 5px }' .
				'.iconvertpr-upgrade-menu-item .dashicons { color: #f7b731; font-size: 24px; vertical-align: middle; margin: -0.15em .15em 0 0; }' .
				'*:not(.current) > .iconvertpr-upgrade-menu-item .dashicons {opacity: 0.7; }'
			);

			iconvertpr_registry_set( 'popup_page_upgrade_hook', $license_page );
		}
	}
}
