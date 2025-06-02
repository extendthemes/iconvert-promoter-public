<?php
namespace CSPromo\Core\Traits;

use CSPromo\Core\Frontend\API\APIBase;

trait GeolocationTrait {
	use CookieTrait;

	// private $geoAPI = 'http://geolocation.test/ip/';
	private $geoAPI        = 'https://geo.dev.convertsquad.com/ip/';
	private $cookieSection = 'geolocation';

	public function getOwnIP() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['__promo_ip'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			return sanitize_text_field( $_GET['__promo_ip'] );
		}

		return $this->getIP();
	}

	public function getIP() {

		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$x_fwd_for = array_key_exists( 'HTTP_X_FORWARDED_FOR', $_SERVER ) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : '';

		if ( $x_fwd_for ) {
			if ( strpos( $x_fwd_for, ',' ) > 0 ) {
				$ips = explode( ',', $x_fwd_for );
				return trim( $ips[0] );
			} else {
				return $x_fwd_for;
			}
		} else {
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			return isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '';
		}
	}

	public function getCountry() {
		$ip     = $this->getOwnIP();
		$ipInfo = $this->getIPInfo( $ip );

		return isset( $ipInfo['cc'] ) ? $ipInfo['cc'] : '';
	}

	public function getRegion() {
		$ip     = $this->getOwnIP();
		$ipInfo = $this->getIPInfo( $ip );
		return isset( $ipInfo['r'] ) ? $ipInfo['r'] : '';
	}

	public function getIPInfo( $ip ) {
		$ipInfo = $this->getCookie( $this->cookieSection );
		if ( ! empty( $ipInfo ) && $ipInfo['ip'] === $ip ) {
			return $ipInfo;
		}

		$api  = new APIBase( $this->geoAPI . $ip );
		$info = $api->get( array() );

		$store = array(
			'cc' => '',
			'r'  => '',
			'ip' => $ip,
		);

		if ( $info['valid'] == 1 ) {
			if ( isset( $info['country_code'] ) ) {
				$store = array(
					'cc' => $info['country_code'],
					'r'  => $info['region'],
					'ip' => $ip,
				);
			}
		}

		$this->storeInCookie( $store, $this->cookieSection );
		return $store;
	}
}
