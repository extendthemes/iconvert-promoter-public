<?php
namespace CSPromo\Core\Traits;

trait CookieTrait {
	private $cookieName = 'icp_s';

	public function storeInCookie( $what, $cookieSection ) {
		$cookie                   = $this->getCookie( $cookieSection );
		$cookie[ $cookieSection ] = $what;
		$this->store( $cookie );
	}

	public function store( $value ) {
		setcookie( $this->cookieName, json_encode( $value ), time() + MONTH_IN_SECONDS );
	}

	public function getCookie( $name ) {
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		return isset( $_COOKIE[ $this->cookieName ][ $name ] ) ? json_decode( stripslashes( $_COOKIE[ $this->cookieName ][ $name ] ) ) : array();
	}
}
