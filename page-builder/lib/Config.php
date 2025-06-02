<?php

namespace CsPromoKubio;


class Config {
	private static $instance;
	public static $textDomain;
	public static $prefix;
	public static $postType;
	public static $singleTemplateSlug;
	public static $popupsRootSelector;
	public static $builderLabel;
	public static $pluginLabel;
	//the entry point for the whole plugin not only the page builder. The page builder folder will be included from
	//the plugin entry point
	public static $pluginEntryPointRelativePath;

	protected function __construct() {
		$this->loadConfig();
		$this->updateConstants();
	}


	public function updateConstants() {
		Constants::addPluginEntryFile( static::$pluginEntryPointRelativePath );
		static::$singleTemplateSlug = strtr( 'single-:postType', array( ':postType' => static::$postType ) );
	}

	public function loadConfig() {
		$configFilePath = sprintf( '%s/plugin.config.json', Constants::$builderDir );
		if ( ! file_exists( $configFilePath ) ) {
			throw new \Exception( 'Could not find config file' );
		}
		$configContent = file_get_contents( $configFilePath );

		$config = json_decode( $configContent, true );
		$class  = new \ReflectionClass( get_class( $this ) );
		if ( is_array( $config ) ) {
			foreach ( $config as $key => $value ) {
				$class->setStaticPropertyValue( $key, $value );
			}
		}
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
