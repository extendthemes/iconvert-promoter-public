<?php

namespace CsPromoKubio;

use KPromo\Core\Utils as KubioUtils;


class GlobalData {
	private static $instance;

	protected function __construct() {
		add_action( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_register_global_style/prefixSelectorsByType' ), array( $this, 'getPrefixSelectorsByType' ) );
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/global-data/default_content' ), array( $this, 'getGlobalDataDefaultContent' ) );
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_global_data_post_type' ), array( $this, 'getKubioGlobalGataPostType' ) );
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_register_global_data_post_type/rest_base' ), array( $this, 'getKubioGlobalRestBase' ) );
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_render_global_colors/global_colors_selector' ), array( $this, 'getRootSelector' ) );
		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_get_shapes_css/shapes_prefix_selector' ), array( $this, 'getRootSelector' ) );
	}

	public static function loadKubioGlobalData() {
		add_action( 'wp_enqueue_scripts', 'KPromo\\kubio_enqueue_google_fonts' );
		add_action( 'wp_head', 'KPromo\\kubio_register_global_style', 0 );
	}



	public function getKubioGlobalRestBase() {
		return Utils::getKubioChildPrefix() . '/global-data';
	}
	public function getRootSelector() {
		return Config::$popupsRootSelector;
	}
	public static function getKubioGlobalGataPostType() {
		return Utils::getKubioChildPrefix() . '-globals';
	}

	public function getPrefixSelectorsByType() {
		return Utils::getStyleRendererPrefixSelectorsByType();
	}



	public function getGlobalDataDefaultContent( $defaultGlobalData ) {
		$globalDataFile = Constants::$builderDir . '/defaults/global-data.json';

		if ( file_exists( $globalDataFile ) ) {
			$globalData = file_get_contents( $globalDataFile );
			return $globalData;
		}
		return $defaultGlobalData;
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
