<?php
namespace CSPromo\Core\Admin\Api;

class BaseSyncApi {
	const API_URL = 'https://promo-templates.iconvert.pro/';

	/**
	 * getApiUrl
	 *
	 * @param  mixed $slug
	 * @return string
	 */
	public function getApiUrl( $slug = '' ) {
		return $this->getBaseUrl() . 'wp-json/promo/v1/' . $slug;
	}

	/**
	 * getBaseUrl
	 *
	 * @return void
	 */
	private function getBaseUrl() {
		return apply_filters( 'iconvertpr_get_base_url', self::API_URL );
	}
}
