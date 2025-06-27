<?php

namespace CsPromoKubio;

class KubioLoader {



	private static $instance;
	public $kubioEmbedFolderPath = null;
	public $kubioEmbedEntryPoint = null;
	public $kubioEmbedFolderName = null;

	protected function __construct() {
		add_action(
			'pre_update_option_active_plugins',
			array( $this, 'setPluginOrder' ),
			100,
			3
		);
	}


	//this will guaranty that the kubio plugin will be loaded before the child plugins so we can clean clea up some hooks
	public function setPluginOrder( $activePlugins, $oldValue, $optionName ) {
		$pluginBaseName   = Utils::getPluginBaseName();
		$newActivePlugins = array();

		//reset the array to start from 0; KPromo at update formats the normal array to associative array and it were cases when
		//the first element started from 1 not 0. This messed up the code below that expects the array to start from 0
		foreach ( $activePlugins as $pluginName ) {
			$newActivePlugins[] = $pluginName;
		}
		$activePlugins = $newActivePlugins;

		$pluginIndex = \array_search( $pluginBaseName, $activePlugins );
		if ( $pluginIndex === false ) {
			return $activePlugins;
		}
		$lastIndex = \count( $activePlugins ) - 1;
		if ( $pluginIndex !== $lastIndex ) {
			\array_splice( $activePlugins, $pluginIndex, 1 );
			\array_splice( $activePlugins, $lastIndex, 0, $pluginBaseName );
		}

		//sometimes there were the same plugin two times. Could not isolate the issue so added this as a fail safe
		$found = false;
		foreach ( $activePlugins as $key => $value ) {
			if ( $value === $pluginBaseName ) {
				if ( $found ) {
					unset( $activePlugins[ $key ] );
				} else {
					$found = true;
				}
			}
		}
		return $activePlugins;
	}

	public function loadKubio() {
		$this->loadEmbedKubio();
	}

	public function loadCoreOnly() {
		if ( ! defined( Constants::$kubioRootNamespace . '\\KUBIO_CORE_ONLY' ) ) {
			define( Constants::$kubioRootNamespace . '\\KUBIO_CORE_ONLY', true );
		}
	}

	public function loadEmbedKubio() {
		$this->loadCoreOnly();
		$kubioEntryPoint = $this->getKubioEmbedPluginEntryPoint();

		if ( $kubioEntryPoint ) {
			require_once $kubioEntryPoint;
		} else {
			throw new \Exception( 'Promo plugin could not find kubio embed' );
		}
	}

	public function getKubioEmbedPluginEntryPoint() {
		return ICONVERTPR_KUBIO_ROOT_DIR . '/plugin.php';
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
