<?php

namespace CSPromo\Core\Admin\Actions\Ajax;

use CSPromo\Core\Admin\PopupService;
use CSPromo\Core\Services\StatsService;
use CSPromo\Core\Traits\HasAction;

class PromoAjaxActions {

	use HasAction;

	public function __construct() {
		add_action( 'wp_ajax_iconvertpr_create_popup', array( $this, 'createPopup' ) );
		add_action( 'wp_ajax_iconvertpr_update_popup', array( $this, 'updatePopup' ) );
		add_action( 'wp_ajax_iconvertpr_change_popup_template', array( $this, 'changePopupTemplate' ) );
		add_action( 'wp_ajax_iconvertpr_delete_campaign', array( $this, 'deleteCampaign' ) );
		add_action( 'wp_ajax_iconvertpr_duplicate_campaign', array( $this, 'duplicateCampaign' ) );
		add_action( 'wp_ajax_iconvertpr_reset_stats_campaign', array( $this, 'resetStatsCampaign' ) );

		add_action( 'wp_ajax_iconvertpr_promo_status', array( $this, 'updateStatus' ) );
	}


		/**
	 * AJAX change the status of a popup
	 *
	 * @return void
	 */
	public function updateStatus() {
		$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;

		if ( isset( $_POST['nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'iconvertpr_status_popup_' . $post_id ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$active = isset( $_POST['status'] ) && intval( $_POST['status'] ) === 1 ? false : true;

			update_post_meta( $post_id, 'active', ! $active );
			wp_send_json_success( __( 'Status changed', 'iconvert-promoter' ), 200 );
		} else {
			wp_send_json_error( __( 'There was a problem changing the status for this popup. Nonce seems invalid.', 'iconvert-promoter' ) );
		}

		wp_die();
	}

	/**
	 * Get provider settings field and logo
	 *
	 * @return void
	 */
	public function createPopup() {

		if ( ! $this->checkNonce( 'iconvertpr_create_popup' ) ) {
			wp_send_json_error( __( 'There was a problem. Nonce seems is invalid.', 'iconvert-promoter' ) );
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$payload_data = isset( $_POST['payload'] ) ? $_POST['payload'] : array();
		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$promo_settings = isset( $_POST['promoSettings'] ) ? $_POST['promoSettings'] : array();

		foreach ( $promo_settings as $key => $value ) {
			if ( is_array( $value ) ) {
				$promo_settings[ $key ] = array_map( 'sanitize_text_field', $value );
			} else {
				$promo_settings[ $key ] = sanitize_text_field( $value );
			}
		}

		$post_id = PopupService::create( $payload_data, $promo_settings );
		if ( $post_id ) {
			wp_send_json_success(
				array(
					'message'      => __( 'Created campaign success!', 'iconvert-promoter' ),
					'post_id'      => $post_id,
					'payload'      => $payload_data,
					'url_redirect' => iconvertpr_generate_page_url( 'promo.edit', array( 'post_id' => $post_id ) ),
				),
				200
			);
		} else {
			wp_send_json_error( __( 'Post not created.', 'iconvert-promoter' ) );
		}

		wp_die();
	}

	/**
	 * Get provider settings field and logo
	 *
	 * @return void
	 */
	public function updatePopup() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$payload_settings = isset( $_POST['payload'] ) ? $_POST['payload'] : array();
		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;

		if ( ! $post_id ) {
			wp_send_json_error( __( 'Post not found.', 'iconvert-promoter' ) );
		}

		$post_name = isset( $payload_settings['general']['name'] ) ? $payload_settings['general']['name'] : '';

		if ( $this->checkNonce( 'iconvertpr_update-popup' ) ) {
			try {
				$post = PopupService::edit( $post_id, $post_name, $payload_settings['display_conditions'], $payload_settings['triggers'], $payload_settings['settings'] );

				// phpcs:ignore WordPress.Security.NonceVerification.Missing
				if ( isset( $_POST['activate'] ) && intval( $_POST['activate'] ) === 1 ) {
					update_post_meta( $post_id, 'active', true );
				}

				wp_send_json_success(
					array(
						'message' => __( 'The campaign was saved.', 'iconvert-promoter' ),
						'post'    => $post,
						'payload' => $payload_settings,
					),
					200
				);
			} catch ( \Throwable $error ) {
				wp_send_json_error( $error->getMessage() );
			}
		} else {
			wp_send_json_error( __( 'There was a problem. Nonce seems is invalid.', 'iconvert-promoter' ) );
		}

		wp_die();
	}

	public function changePopupTemplate() {

		if ( ! $this->checkNonce( 'iconvertpr_change_popup_template' ) ) {
			wp_send_json_error( __( 'There was a problem. Nonce seems is invalid.', 'iconvert-promoter' ) );
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;

		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$template_id = isset( $_POST['template_id'] ) ? intval( $_POST['template_id'] ) : 0;

		if ( ! $post_id ) {
			wp_send_json_error( __( 'Post not found.', 'iconvert-promoter' ) );
		}

		if ( ! $template_id ) {
			wp_send_json_error( __( 'Template not found.', 'iconvert-promoter' ) );
		}

			$updated = PopupService::changeTemplate( $post_id, $template_id );

		if ( $updated ) {
			wp_send_json_success(
				array(
					'message'     => __( 'Template changed!', 'iconvert-promoter' ),
					'post_id'     => $post_id,
					'template_id' => $template_id,
				),
				200
			);
		} else {
			wp_send_json_error( __( 'Template not changed.', 'iconvert-promoter' ) );
		}
	}

	/**
	 * Delete campaign
	 *
	 * @return void
	 */
	public function deleteCampaign() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;

		if ( $this->checkNonce( 'iconvertpr_delete_campaign' ) ) {
			try {
				wp_delete_post( $post_id );

				$stats = new StatsService();
				$stats->destroy( $post_id );

				wp_send_json_success(
					array(
						'message'      => __( 'The campaign was deleted.', 'iconvert-promoter' ),
						'url_redirect' => iconvertpr_generate_page_url( 'promos.list' ),
					),
					200
				);
			} catch ( \Throwable $error ) {
				wp_send_json_error( $error->getMessage() );
			}
		} else {
			wp_send_json_error( __( 'There was a problem. Nonce seems is invalid.', 'iconvert-promoter' ) );
		}

		wp_die();
	}

	/**
	 * Duplicate campaign
	 *
	 * @return void
	 */
	public function duplicateCampaign() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;

		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$campaign_name = isset( $_POST['campaign_name'] ) ? sanitize_text_field( $_POST['campaign_name'] ) : '';

		if ( $this->checkNonce( 'iconvertpr_duplicate_campaign' ) ) {
			try {
				// phpcs:ignore WordPress.Security.NonceVerification.Missing
				$duplicate_as = isset( $_POST['duplicate_as'] ) ? sanitize_text_field( wp_unslash( $_POST['duplicate_as'] ) ) : null;
				$new_post_id  = PopupService::duplicate( $post_id, $campaign_name, $duplicate_as );

				wp_send_json_success(
					array(
						'message'      => __( 'The campaign was duplicated.', 'iconvert-promoter' ),
						'url_redirect' => iconvertpr_generate_page_url( 'promo.edit', array( 'post_id' => $new_post_id ) ),
					),
					200
				);
			} catch ( \Throwable $error ) {
				wp_send_json_error( $error->getMessage() );
			}
		} else {
			wp_send_json_error( __( 'There was a problem. Nonce seems is invalid.', 'iconvert-promoter' ) );
		}

		wp_die();
	}

	/**
	 * Resets stats campaign
	 *
	 * @return void
	 */
	public function resetStatsCampaign() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;

		if ( $this->checkNonce( 'iconvertpr_reset_stats_campaign' ) ) {
			try {
				$stats_service = new StatsService();
				$stats_service->resetAllStats( $post_id );

				wp_send_json_success(
					array(
						'message'      => __( 'The campaign statistics was reset.', 'iconvert-promoter' ),
						'url_redirect' => iconvertpr_generate_page_url( 'promos.list' ),
					),
					200
				);
			} catch ( \Throwable $error ) {
				wp_send_json_error( $error->getMessage() );
			}
		} else {
			wp_send_json_error( __( 'There was a problem. Nonce seems is invalid.', 'iconvert-promoter' ) );
		}

		wp_die();
	}
}
