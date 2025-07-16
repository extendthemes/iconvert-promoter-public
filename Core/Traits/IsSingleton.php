<?php
namespace CSPromo\Core\Traits;

trait IsSingleton {
	protected static $_instance = array();
	private static $className   = '';

	/**
	 * Get the instance of the class
	 *
	 * @return static
	 */
	public static function getInstance() {

		$called_class = get_called_class();

		if ( ! isset( static::$_instance[ $called_class ] ) ) {

			static::$_instance[ $called_class ] = new $called_class();

		}

		return static::$_instance[ $called_class ];
	}
}
