<?php

namespace CSPromo\Core\Frontend\API;

use CSPromo\Core\PostTypes\PromoPopups;

class CampaignsAPI {

	public function __construct() {
		add_action(
			'rest_api_init',
			function () {
				register_rest_route(
					'promo/v1',
					'/campaigns',
					array(
						'methods'             => 'GET',
						'callback'            => array( $this, 'campaigns' ),
						'permission_callback' => function () {
							return current_user_can( 'manage_options' );
						},
					)
				);

				register_rest_route(
					'promo/v1',
					'/campaign/status/(?P<id>[a-z0-9 .\-]+)',
					array(
						'methods'             => 'GET',
						'callback'            => array( $this, 'campaignStatus' ),
						'args'                => array(
							'id' => array( $this, 'validateNumeric' ),
						),
						'permission_callback' => function () {
							return current_user_can( 'manage_options' );
						},
					)
				);
			}
		);
	}

	/**
	 * API - Geta a campaign status
	 *
	 * @return array
	 */

	public function campaignStatus( $request ) {
		$id       = intval( $request->get_param( 'id' ) );
		$campaign = PromoPopups::apiGetStatusCampaign( $id );

		return $campaign;
	}

	/**
	 * API - Get a list of campaigns
	 *
	 * @return array
	 */

	public function campaigns() {

		$campaigns = PromoPopups::apiGet();

		return $campaigns;
	}

	public function validateNumeric( $param, $request, $key ) {
		return is_numeric( $param );
	}
}
