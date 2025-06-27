<?php

namespace CsPromoKubio;



class Constants {

	private static $instance;

	static $builderDir;
	static $builderEntryFile;

	//the entry file for the plugin that includes the page builder. The file that will include the  page builder
	static $pluginEntryFile;
	static $adminPageName;
	static $kubioRootNamespace;

	protected function __construct() {
		static::$builderDir = plugin_dir_path( static::$builderEntryFile );
		//there is a circular dependency between this class and config we must load it here for the app to work
		Config::load();
		static::$adminPageName      = 'iconvertpr-editor';
		static::$kubioRootNamespace = static::getKubioRootNamespace();
	}

	public static function addPluginEntryFile( $pluginEntryPointRelativePath ) {
		static::$pluginEntryFile = realpath( plugin_dir_path( static::$builderEntryFile ) . $pluginEntryPointRelativePath );
	}

	public static function getKubioRootNamespace() {
		$currentNamespace = __NAMESPACE__;
		$parts            = explode( '\\', $currentNamespace );
		$kubioNameSpace   = 'KPromo';
		if ( count( $parts ) > 1 ) {
			$prefixNameSpace = $parts[0];
			$kubioNameSpace  = $prefixNameSpace . '\\' . $kubioNameSpace;
		}
		return $kubioNameSpace;
	}

	public static function load( $builderEntryFile ) {
		static::$builderEntryFile = $builderEntryFile;
		return self::getInstance();
	}

	public static function getInstance() {
		if ( ! self::$instance ) {

			self::$instance = new self();
		}

		return self::$instance;
	}
}
