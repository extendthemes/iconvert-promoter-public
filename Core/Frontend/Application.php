<?php

namespace CSPromo\Core\Frontend;

use CSPromo\Core\Frontend\Actions\Assets;
use CSPromo\Core\Frontend\Actions\ShortcodeGenerator;
use CSPromo\Core\Frontend\Actions\Triggers;
use CSPromo\Core\Frontend\Actions\Activator;
use CSPromo\Core\Frontend\Pages\PromoPreviewPage;
use CsPromoKubio\Core\Template;

/**
 * Application
 */
class Application {

	public static function boot() {
		//load the assets
		new Assets();

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! isset( $_GET['__iconvert-promoter-preview-remote-template'] ) ) {
			//activate popups by checking display conditions
			new Activator();
			new ShortcodeGenerator();
		}

		new PromoPreviewPage();

		add_filter(
			'pre_handle_404',
			function ( $handle ) {
				$referer = wp_get_referer();

				// phpcs:ignore WordPress.Security.NonceVerification.Recommended
				if ( isset( $_REQUEST['_wp-find-template'] ) && str_contains( $referer, 'page=iconvertpr-editor' ) ) {

					return true;
				}

				return $handle;
			}
		);

		add_filter(
			'wp',
			function () {
				$referer = wp_get_referer();
				// phpcs:ignore WordPress.Security.NonceVerification.Recommended
				if ( isset( $_REQUEST['_wp-find-template'] ) && str_contains( $referer, 'page=iconvertpr-editor' ) ) {
					$template_slug  = get_stylesheet() . '//single-cs-promo-popups';
					$block_template = get_block_template( $template_slug );

					if ( ! $block_template ) {
						Template::load()->importTemplates();
						wp_cache_flush();
						$block_template = get_block_template( $template_slug );
					}

					wp_send_json_success( $block_template );
				}
			},
			0
		);
	}
}
