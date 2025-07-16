<?php

namespace CsPromoKubio;
use IlluminateAgnostic\Arr\Support\Arr;

class Utils {
	private static $root_namespace = null;
	private static $namespace_id   = null;

	public static function getPluginUrl( $path = '' ) {
		$url = plugins_url( $path, Constants::$builderEntryFile );
		return $url;
	}
	public static function getPrefixedScriptName( $name = '' ) {
		return sprintf( '%s%s', Config::$prefix . '-', $name );
	}

	public static function getPluginBaseName() {
		return plugin_basename( Constants::$pluginEntryFile );
	}

	public static function isAdminPage( $name ) {
		global $pagenow;

		if ( substr( $pagenow, 0, -4 ) === 'admin' ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$page = Arr::get( $_REQUEST, 'page', false );

			if ( $page === $name ) {
				return true;
			}
		}

		return false;
	}

	public static function isKubioChildEditorPage(): bool {
		return static::isAdminPage( Constants::$adminPageName );
	}

	public static function isPro() {
		return true;
	}

	public static function isFreeAndHasProActive() {
		$is_pro = Utils::isPro();
		if ( $is_pro ) {
			return false;
		}
		$pro_plugin_name = str_replace( '/', '-pro/', Constants::$pluginEntryFile );
		$active_plugins  = get_option( 'active_plugins', array() );
		return in_array( $pro_plugin_name, $active_plugins, true );
	}

	public static function getKubioChildPrefix() {
		return Config::$prefix;
	}

	public static function getKubioRootNamespace() {

		if ( ! static::$root_namespace ) {
			$current_namespace = __NAMESPACE__;
			$namespace_parts   = explode( '\\', $current_namespace );

			//When is prefixed at build there will be 2 namespace aprts
			if ( count( $namespace_parts ) === 2 ) {
				$root_namespace = $namespace_parts[0] . '\\Kubio';

			} else {
				$root_namespace = 'Kubio';
			}
			static::$root_namespace = $root_namespace;
		}
		return static::$root_namespace;
	}
	public static function getNamespaceIdentifier() {
		if ( ! static::$namespace_id ) {
			static::$namespace_id = str_replace( '\\', '', static::getKubioRootNamespace() );

		}
		return static::$namespace_id;
	}
	public static function getStringWithNamespacePrefix( $action ) {
		$prefix = static::getNamespaceIdentifier();

		return "$prefix\\$action";
	}



	public static function getStyleRendererPrefixSelectorsByType() {
		return array(
			'shared'  => '#kubio',
			'local'   => '#kubio',
			'dynamic' => 'html ' . Config::$popupsRootSelector,
			'global'  => 'html ' . Config::$popupsRootSelector,
		);
	}

	public static function getKubioBlockJsonPath( $block_folder ) {
		return ICONVERTPR_KUBIO_ROOT_DIR . "/build/block-library/blocks/$block_folder/block.json";
	}

	public static function removeKubioDependency( array $registered, array $deps_to_remove ): array {

		foreach ( $registered as $key => $style ) {
			$handle = $style[0];
			if ( in_array( $handle, $deps_to_remove, true ) ) {
				unset( $registered[ $key ] );
			}
		}

		return $registered;
	}
}
