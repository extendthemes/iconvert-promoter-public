<?php

/**
 * Helper functions for the Registry::class
 *
 */

if ( ! function_exists( 'iconvertpr_registry_get' ) ) {
	/**
	 * cs_registry_get Helper function to get a variable from the registry
	 *
	 * @param  string $name
	 * @param  mixed $default
	 * @return mixed value
	 */

	function iconvertpr_registry_get( $name, $default = null ) {
		$registry = \CSPromo\Core\Admin\Registry::getInstance();
		return $registry->get( $name, $default );
	}
}

if ( ! function_exists( 'iconvertpr_registry_set' ) ) {
	/**
	 * cs_registry_set Helper function to set a variable into the registry
	 *
	 * @param  string $name
	 * @param  mixed $default
	 * @return void
	 */

	function iconvertpr_registry_set( $name, $value ) {
		$registry = \CSPromo\Core\Admin\Registry::getInstance();
		$registry->set( $name, $value );
	}
}

if ( ! function_exists( 'iconvertpr_registry_delete' ) ) {
	/**
	 * cs_registry_delete Helper function to delete a variable fromt the registry
	 *
	 * @param  string $name
	 * @return void
	 */

	function iconvertpr_registry_delete( $name ) {
		$registry = \CSPromo\Core\Admin\Registry::getInstance();
		$registry->delete( $name );
	}
}
