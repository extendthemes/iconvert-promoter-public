<?php
namespace CSPromo\Core\Admin;

use CSPromo\Core\Admin\Actions\Assets;
use CSPromo\Core\Admin\Structure\Menus;
use CSPromo\Core\Admin\Actions\EmailListActions;
use CSPromo\Core\Admin\Actions\Plugin\Integrate;
use CSPromo\Core\Admin\Actions\SubscriberActions;
use CSPromo\Core\Admin\Actions\Ajax\PromoAjaxActions;
use CSPromo\Core\Admin\Actions\Ajax\TemplatesAjaxActions;
use CSPromo\Core\Admin\Actions\Ajax\PostsSearchAjaxActions;
use CSPromo\Core\Admin\Actions\Ajax\TriggersAjaxActions;
use CsPromoKubio\Core\Template;
use CSPromo\Core\PostTypes\PromoPopups;

/**
 * Application
 */
class Application {

	public static function boot() {
		iconvertpr_registry_set( 'settings_page_url', add_query_arg( array( 'page' => ICONVERTPR_PAGE_ID ), admin_url( 'admin.php' ) ) );
		iconvertpr_registry_set( 'popup_page_edit_url', add_query_arg( array( 'page' => ICONVERTPR_PAGE_ID . '-richtext' ), admin_url( 'admin.php' ) ) );

		add_filter( 'plugin_row_meta', __CLASS__ . '::plugin_row_meta', 10, 4 );

		//activate/deactivate hooks
		Integrate::run();

		//admin menus
		$adminMenu = new Menus();
		$adminMenu->init();
		// actions
		new EmailListActions();
		new SubscriberActions();
		//ajax actions
		new PromoAjaxActions();
		new TemplatesAjaxActions();
		new PostsSearchAjaxActions();
		new TriggersAjaxActions();

		Template::load();
		//load the assets
		new Assets();

		add_filter(
			'iconvertpr.kubioUtilsData',
			function ( $data ) {

				// phpcs:ignore WordPress.Security.NonceVerification.Recommended
				$post_id = isset( $_GET['postId'] ) ? intval( $_GET['postId'] ) : 0;
				if ( $post_id ) {
					$post               = get_post( $post_id );
					$popupType          = PromoPopups::getSetting( 'popup_type', $post_id );
					$data['previewUrl'] = PromoPopups::getPreviewURL( $post, $popupType );
				}
				return $data;
			}
		);
	}

	public static function plugin_row_meta( $plugin_meta, $plugin_file ) {
		$entry_file = plugin_basename( ICONVERTPR_PAGE_FILE );
		if ( $plugin_file === $entry_file ) {
			$plugin_meta[0] = "{$plugin_meta[0]} (build: " . ICONVERTPR_BUILD_NUMBER . ')';
		}

		return $plugin_meta;
	}
}
