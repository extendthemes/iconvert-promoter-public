<?php
namespace CSPromo\Core;

use CSPromo\Core\Traits\HasTemplate;

class Router {
	use HasTemplate;

	/**
	 * namespace
	 *
	 * @var string
	 */
	private $namespace;

	/**
	 * route
	 *
	 * @var mixed
	 */
	private $route = false;

	public function __construct( $ns ) {
		$this->namespace = $ns;

		$this->resolveRoute();
	}

	/**
	 * Return the display callback
	 *
	 * @return array
	 */
	public function display() {
		return $this->route;
	}

	/**
	 * Try to get the corresponding route
	 *
	 * @return void
	 */
	public function resolveRoute() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$page = isset( $_GET['page'] ) ? sanitize_text_field( $_GET['page'] ) : false;
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$route = isset( $_GET['route'] ) ? sanitize_text_field( $_GET['route'] ) : false;

		if ( $page && $page === $this->namespace ) {
			if ( $route ) {
				$this->route = $this->loadRoute( $route );
			} else {
				$this->route = $this->loadRoute( false );
			}
		} else {
			$this->route = array( $this, 'empty' );
		}
	}

	/**
	 * Empty controller function
	 *
	 * @return void
	 */
	public function empty() {}

	/**
	 * No route was found
	 *
	 * @return void
	 */
	public function notFound() {
		$this->template( '_not_found', array() );
	}

	/**
	 * Load the corresponding route
	 *
	 * @param  mixed $route
	 * @return array
	 */
	public function loadRoute( $route = false ) {
		$routes = iconvertpr_registry_get( 'admin.routes.web', array() );
		$found  = false;

		if ( array_key_exists( $this->namespace, $routes ) ) {
			if ( $route === false ) {
				// we show the first record from the routes array. this is the default route
				$default = array_key_first( $routes[ $this->namespace ] );
				iconvertpr_registry_set( 'admin.routes.current', $default );

				$found = array( new $routes[ $this->namespace ][ $default ][0](), $routes[ $this->namespace ][ $default ][1] );
			} elseif ( array_key_exists( $route, $routes[ $this->namespace ] ) ) {
				// we show the corresponding route
				$found = array( new $routes[ $this->namespace ][ $route ][0](), $routes[ $this->namespace ][ $route ][1] );
				iconvertpr_registry_set( 'admin.routes.current', $route );
			} else {
				// we found no corresponding route so we return a 404 template
				$found = array( $this, 'notFound' );
			}
		} else {
			// we found no corresponding route so we return a 404 template
			$found = array( $this, 'notFound' );
		}

		return $found;
	}
}
