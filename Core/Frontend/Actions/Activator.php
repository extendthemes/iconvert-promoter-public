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
	}

	public function shouldLoadKubioAssets() {
			call_user_func( ICONVERTPR_BUILDER_NS . '\\FrontendAssets::loadKubioAssets' );
	}

	public function loadPromoSkeletonPage() {
		if ( $this->isTheSinglePopupTemplate() ) {
			self::template( 'css-skeleton', array(), true, 'frontend' );
		}
	}

	public function previewQueryVars( $vars ) {

		if ( iconvertpr_preview_page() ) {
			$vars = array(
				'p'         => iconvertpr_preview_page_id(),
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
