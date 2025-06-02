<?php

namespace CSPromo\Core\Frontend\Actions;

use CSPromo\Core\PostTypes\PromoPopups;
use CSPromo\Core\Traits\HasTemplate;

class Activator {

	use HasTemplate;

	public static $active_popups = array();
	public static $popups_html   = '';

	public function __construct() {

		add_action( 'wp', array( $this, 'shouldLoadKubioAssets' ) );
		add_action( 'wp_footer', array( $this, 'loadPromoSkeletonPage' ) );
		add_filter( 'request', array( $this, 'previewQueryVars' ) );

		add_action( 'wp_footer', array( $this, 'popupHtml' ) );
	}

	public function shouldLoadKubioAssets() {
		// if ( cs_preview_page() ) {
			call_user_func( CSPromoBuilder . '\\FrontendAssets::loadKubioAssets' );
		// }
	}

	public function loadPromoSkeletonPage() {
		if ( $this->isTheSinglePopupTemplate() ) {
			self::template( 'css-skeleton', array(), true, 'frontend' );
		}
	}

	/**
	 * Echo the popup html
	 *
	 * @return void
	 */
	public function popupHtml() {
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo self::$popups_html;
	}

	public function previewQueryVars( $vars ) {

		if ( cs_preview_page() ) {
			$vars = array(
				'p'         => cs_preview_page_id(),
				'post_type' => PromoPopups::getSlug(),
			);
		}

		return $vars;
	}

	public function isTheSinglePopupTemplate() {
		global $wp_query;
		$current_post = $wp_query->query;

		if ( isset( $current_post['post_type'] ) && $current_post['post_type'] === 'cs-promo-popups' ) {
			return true;
		}

		return false;
	}
}
