<?php

namespace CsPromoKubio;


//This class is used to add filter/actions that needs to run before kubio. Because we need to give parameters to kubio that can run at any time
//Because of this restrictions you can't run any KPromo code here
class BeforeKubioFilters {

	private static $instance;


	protected function __construct() {
		add_filter( Utils::getStringWithNamespacePrefix( 'kubio/getKubioPluginName' ), array( $this, 'getKubioPluginName' ) );
		add_filter( Utils::getStringWithNamespacePrefix( 'kubio/getKubioBlockPrefix' ), array( $this, 'getKubioBlockPrefix' ) );
		add_filter( Utils::getStringWithNamespacePrefix( 'kubio/get_plugin_label' ), array( $this, 'getPluginLabel' ) );
		add_filter( Utils::getStringWithNamespacePrefix( 'kubio/NotificationsManager/remote_data_url_base' ), array( $this, 'getRemoteDataUrlBase' ) );
	}


	//When we will add notifications we need to change this url
	public static function getRemoteDataUrlBase() {
		//'https://kubiobuilder.com/wp-json/wp/v2/notificfation';
		return 'https://kubiobuilder.com/wp-json/wp/v2/notificfation/disalbed';
	}

	public static function getPluginLabel() {
		return Config::$pluginLabel;
	}

	public static function getKubioBlockPrefix() {
		return Config::$prefix;
	}

	public static function getKubioPluginName() {
		return Utils::getPluginBaseName();
	}

	public function addFrontendFilters() {  }


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
