<?php
namespace CSPromo\Core\Admin\Api;

use CSPromo\Core\Admin\Api\BaseSyncApi;
use WP_Error;

class TemplatesApi extends BaseSyncApi {

	/**
	 * getTemplates
	 *
	 * @param  mixed $promoType
	 * @return array
	 */
	public function getTemplates( $promoType = false ) {
		$apiPath = apply_filters( 'iconvert/api/templates/list', 'templates/list/' . $promoType, $promoType );

		$apiUrl = $this->getApiUrl( $apiPath );

		$options = array(
			'method'  => 'GET',
			'timeout' => 20,
		);

		$raw_response = wp_remote_request( $apiUrl, $options );
		if ( $raw_response instanceof WP_Error ) {
			esc_html_e( 'No internet connection.', 'iconvert-promoter' );
			return array();
		}

		$response = wp_unslash( json_decode( $raw_response['body'], true ) );
		if ( ! empty( $response['data'] ) ) {
			$data = $this->sortBlankPromoAsLastItem( $response['data'] );
			return $data;
		}

		return array();
	}

	/**
	 * sortBlankPromoAsLastItem
	 *
	 * @param  array $dataArr
	 * @return array
	 */
	private function sortBlankPromoAsLastItem( $dataArr ) {
		foreach ( $dataArr as $dkey => $promo ) {
			if ( $promo['is_blank'] == 1 ) {
				$isBlankPromo = $promo;
				unset( $dataArr[ $dkey ] );
			}
		}

		$dataArr = array_values( $dataArr );
		if ( $isBlankPromo ) {
			$dataArr[] = $isBlankPromo;
		}

		return $dataArr;
	}

	/**
	 * getTemplate
	 *
	 * @param  mixed $templateId
	 * @return void
	 */
	public function getTemplate( $templateId ) {

		$transient_key = 'iconvertpr_template_cache_' . $templateId;

		$cached_template = get_transient( $transient_key );

		if ( $cached_template ) {
			return $cached_template;
		}

		$apiPath = apply_filters( 'iconvertpr/api/templates/get', 'templates/get/' . $templateId, $templateId );
		$apiUrl  = $this->getApiUrl( $apiPath );

		$options = array(
			'method'  => 'GET',
			'timeout' => 20,
		);

		$raw_response = wp_remote_request( $apiUrl, $options );

		$response = json_decode( $raw_response['body'] );

		if ( ! empty( $response->data ) && isset( $response->data[0] ) ) {
			$response = $this->convertKubioBlocksToCsPromo( $response->data[0] );

			set_transient( $transient_key, $response, 60 * 60 * 24 );

			return $response;
		}

		return false;
	}

	public function convertKubioBlocksToCsPromo( $template ) {
		$template->content = str_replace( 'wp:kubio', 'wp:cspromo', $template->content );
		return $template;
	}
}
