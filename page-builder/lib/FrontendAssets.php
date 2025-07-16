<?php

namespace CsPromoKubio;

use KPromo\Core\Utils as KubioUtils;

class FrontendAssets {
	private static $instance;

	protected function __construct() {
		add_filter(
			KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_enqueue_frontend_assets/inline_script_name' ),
			array( $this, 'getFrontendInlineScriptName' )
		);
	}

	public function getFrontendInlineScriptName( $name ) {
		return Utils::getPrefixedScriptName( 'block-library' );
	}

	public static function loadKubioAssets() {
		if ( iconvertpr_preview_page() ) {
			add_action( 'wp_enqueue_scripts', 'KPromo\\kubio_enqueue_google_fonts' );
		}

		add_action( 'wp_head', 'KPromo\\kubio_register_global_style', 0 );

		$instance = static::getInstance();

		add_action( 'wp_enqueue_scripts', array( $instance, 'loadFrontendAssets' ) );
	}

	public function loadFrontendAssets() {
		\KPromo\kubio_enqueue_frontend_assets();
	}

	public static function getInstance() {
		if ( ! self::$instance ) {

			self::$instance = new self();
		}

		return self::$instance;
	}

	public static function load() {
		return self::getInstance();
	}
}
