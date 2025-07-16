<?php

namespace CsPromoKubio;

use KPromo\Core\Utils as KubioUtils;

class EditorAssets {

	private static $instance;

	protected function __construct() {
		$this->addFilters();
	}

	public function addFilters() {
		add_action( 'init', array( $this, 'registerPackagesScripts' ) );
		add_action( 'init', array( $this, 'registerPackagesStyles' ) );

		add_filter( KubioUtils::getStringWithNamespacePrefix( 'kubio/kubioUtilsData' ), array( $this, 'addKubioUtilsData' ) );
		add_action(
			KubioUtils::getStringWithNamespacePrefix( 'kubio/kubio_register_packages_scripts/before_register' ),
			array( $this, 'onUpdateKubioScripts' )
		);
	}

	public function onUpdateKubioScripts( $scripts ) {
		foreach ( $scripts as $key => $style ) {
			$handle     = $style[0];
			$dependency = $style[2];

			//add the filters package as a dependency for all the kubio packages. So you can use filters to replace data in kubio
			$kubioChildFilterScript = Utils::getPrefixedScriptName( 'filters' );
			$isKubioScript          = strpos( $handle, 'kubio' ) !== false;
			if ( $isKubioScript && is_array( $dependency ) && ! in_array( $kubioChildFilterScript, $dependency ) ) {
				$scripts[ $key ][2][] = $kubioChildFilterScript;
			}
		}

		return $scripts;
	}


	public function addKubioUtilsData( $dataArray ) {

		//this tells the block library to load the blocks using a hook that is runned after the editor is initialized
		//This gives time to the code from both block library packes from kubio and kubio child to load and to add its filters
		if ( Utils::isKubioChildEditorPage() ) {
			$dataArray                            = apply_filters( 'iconvertpr.kubioUtilsData', $dataArray );
			$dataArray['kubioLoadBlocksWithHook'] = true;
			$dataArray['optrixBlinkingLogoHtml']  = file_get_contents( ICONVERTPR_URL . 'page-builder/static/optrix-iframe-loader.html' );
			$dataArray['previewBlinkingLogoHtml'] = file_get_contents( ICONVERTPR_URL . 'page-builder/static/optrix-iframe-loader.html' );
			$dataArray['enable_try_online']       = false;
		}

		return $dataArray;
	}

	public function getPackagesOptions() {
		$options = array(
			'kubio_root_dir' => Constants::$builderDir,
			'handle_prefix'  => Config::$prefix . '-',
			'get_plugin_url' => __NAMESPACE__ . '\\Utils::getPluginUrl',
		);
		return $options;
	}

	public function registerPackagesScripts() {

		$options = $this->getPackagesOptions();
		\KPromo\kubio_register_packages_scripts( $options );
	}

	public function registerPackagesStyles() {
		$options = $this->getPackagesOptions();
		\KPromo\kubio_register_packages_styles( $options );
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
