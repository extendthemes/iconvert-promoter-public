<?php

namespace CSPromo\Core\Frontend\Actions\Ajax;

use CSPromo\Core\Traits\HasAction;
use CSPromo\Core\Services\StatsService;
use CSPromo\Core\Traits\HasRateLimit;
use IlluminateAgnostic\Arr\Support\Arr;

class AnalyticsAjaxActions {
	use HasAction;
	use HasRateLimit;

	private $blocks_identifiers_paths = array(
		'cspromo/buttonextended' => array( 'innerHTML' ),
	);

	public function __construct() {
		add_action( 'wp_ajax_iconvertpr_promo_analytics', array( $this, 'promo_analytics' ) );
		add_action( 'wp_ajax_nopriv_iconvertpr_promo_analytics', array( $this, 'promo_analytics' ) );
	}

	/**
	 * Promo analytics
	 *
	 * @return void
	 */
	public function promo_analytics() {

		// we use the visitor_id to validate the nonce for logged out users
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$visitor_id = isset( $_REQUEST['visitor_id'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['visitor_id'] ) ) : '';
		add_filter(
			'nonce_user_logged_out',
			function ( $uid ) use ( $visitor_id ) {
				if ( ! $uid ) {
					$uid = $visitor_id;
				}

				return $uid;
			}
		);

		if ( $this->checkNonce( 'iconvertpr_promo_analytics' ) ) {

			if ( $this->is_rate_limit_exceeded() ) {
				wp_send_json_error(
					array(
						'body' => 0,
					),
					429
				);
			}

			$statsService = new StatsService();
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$event = isset( $_POST['event'] ) ? sanitize_text_field( $_POST['event'] ) : '';
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$popup = isset( $_POST['popup'] ) ? intval( $_POST['popup'] ) : 0;
			
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$identifier = isset( $_POST['identifier'] ) ? sanitize_text_field( wp_unslash( $_POST['identifier'] ) ) : '';

			$ids = get_posts(
				array(
					'post_type' => 'cs-promo-popups',
					'fields'    => 'ids',
					'post__in'  => array( $popup ),
				)
			);

			if ( ! empty( $ids ) ) {
				$allowed_events = StatsService::EVENTS;

				if ( in_array( $event, $allowed_events, true ) && $popup > 0 ) {
					$popup_post       = get_post( $popup );
					$valid_identifier = $this->is_valid_identifier( $identifier, parse_blocks( $popup_post->post_content ) );
					if ( $valid_identifier ) {
						$statsService->updateStat( $popup, $event, $identifier );
					}
				}
			}

			wp_send_json_success(
				array(
					'body' => 1,
				),
				200
			);
		}

		wp_die();
	}



	private function is_valid_identifier( $identifier, $blocks ) {
		if ( empty( $identifier ) ) {
			return true;
		}

		if ( isset( $blocks['blockName'] ) ) {
			$blocks = array( $blocks );
		}

		foreach ( $blocks as $block ) {
			$name = $block['blockName'] ?? '';
			if ( isset( $this->blocks_identifiers_paths[ $name ] ) ) {
				$block_identifiers_paths = $this->blocks_identifiers_paths[ $name ];

				foreach ( $block_identifiers_paths as $path ) {
					$path_value = Arr::get( $block, $path );
					if ( sanitize_text_field( $path_value ) === $identifier ) {
						return true;
					}
				}
			}

			if ( isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$is_valid_inner_blocks = $this->is_valid_identifier( $identifier, $block['innerBlocks'] );
				if ( $is_valid_inner_blocks ) {
					return true;
				}
			}
		}

		return false;
	}
}
