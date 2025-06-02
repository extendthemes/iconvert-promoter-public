<?php

namespace CSPromo\Core\Admin\Structure;

use CSPromo\Core\Router;

class Menus {

	public function init() {
		add_action( 'admin_menu', array( $this, 'add_plugin_pages' ) );
	}

	public function add_plugin_pages() {
		$router = new Router( IC_PROMO_PAGE_ID );

		$hook = \add_menu_page(
			__( 'iConvert Promoter', 'iconvert-promoter' ),
			__( 'iConvert Promoter', 'iconvert-promoter' ),
			'manage_options',
			IC_PROMO_PAGE_ID,
			$router->display(),
			IC_PROMO_URL . '/admin/assets/images/main-menu-icon.png',
			20
		);

		cs_registry_set( 'settings_page_hook', $hook );

		$hook = \add_submenu_page(
			IC_PROMO_PAGE_ID,
			__( 'Campaigns', 'iconvert-promoter' ),
			__( 'Campaigns', 'iconvert-promoter' ),
			'manage_options',
			IC_PROMO_PAGE_ID,
			$router->display()
		);

		$router = new Router( IC_PROMO_PAGE_SUBSCRIBERS );

		$hookSubpage = \add_submenu_page(
			IC_PROMO_PAGE_ID,
			__( 'Email lists', 'iconvert-promoter' ),
			__( 'Email lists', 'iconvert-promoter' ),
			'manage_options',
			IC_PROMO_PAGE_ID . '-subscribers',
			$router->display()
		);

		cs_registry_set( 'popup_page_edit_hook', $hookSubpage );

		$router = new Router( IC_PROMO_PAGE_INTEGRATIONS );

		$integrations_page = \add_submenu_page(
			IC_PROMO_PAGE_ID,
			__( 'Integrations', 'iconvert-promoter' ),
			__( 'Integrations', 'iconvert-promoter' ),
			'manage_options',
			IC_PROMO_PAGE_ID . '-integrations',
			$router->display()
		);

		cs_registry_set( 'popup_page_integrations_hook', $integrations_page );

		if ( apply_filters( 'iconvert_promoter_feature_available_only_in_pro', true ) ) {
			$router = new Router( IC_PROMO_PAGE_UPGRADE );

			$license_page = \add_submenu_page(
				IC_PROMO_PAGE_ID,
				__( 'Upgrade to PRO', 'iconvert-promoter' ),
				__( 'Upgrade to PRO', 'iconvert-promoter' ),
				'manage_options',
				IC_PROMO_PAGE_ID . '-upgrade',
				$router->display()
			);

			cs_registry_set( 'popup_page_upgrade_hook', $license_page );
		}
	}
}
