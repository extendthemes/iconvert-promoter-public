<?php

namespace CSPromo\Core\Admin\Actions\Ajax;

use CSPromo\Core\Admin\PopupService;
use CSPromo\Core\Services\StatsService;
use CSPromo\Core\Traits\HasAction;

class PromoAjaxActions {

	use HasAction;

	public function __construct() {
		add_action( 'wp_ajax_cs_create_popup', array( $this, 'createPopup' ) );
		add_action( 'wp_ajax_cs_update_popup', array( $this, 'updatePopup' ) );
		add_action( 'wp_ajax_cs_change_popup_template', array( $this, 'changePopupTemplate' ) );
		add_action( 'wp_ajax_cs_delete_campaign', array( $this, 'deleteCampaign' ) );
		add_action( 'wp_ajax_cs_duplicate_campaign', array( $this, 'duplicateCampaign' ) );
		add_action( 'wp_ajax_cs_reset_stats_campaign', array( $this, 'resetStatsCampaign' ) );
	}

	/**
	 * Get provider settings field and logo
	 *
	 * @return void
	 */
	public function createPopup() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$payload_data = isset( $_POST['payload'] ) ? $_POST['payload'] : array();
		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$promo_settings = isset( $_POST['promoSettings'] ) ? $_POST['promoSettings'] : array();

		if ( $this->checkNonce( 'cs_create_popup' ) ) {
			$post_id = PopupService::create( $payload_data, $promo_settings );
			if ( $post_id ) {
				wp_send_json_success(
					array(
						'message'      => __( 'Created campaign success!', 'iconvert-promoter' ),
						'post_id'      => $post_id,
						'payload'      => $payload_data,
						'url_redirect' => cs_generate_page_url( 'promo.edit', array( 'post_id' => $post_id ) ),
					),
					200
				);
			} else {
				wp_send_json_error( __( 'Post not created.', 'iconvert-promoter' ) );
			}
		} else {
			wp_send_json_error( __( 'There was a problem. Nonce seems is invalid.', 'iconvert-promoter' ) );
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

		if ( $this->checkNonce( 'icp_update-popup' ) ) {
			try {
				$post = PopupService::edit( $post_id, $post_name, $payload_settings['display_conditions'], $payload_settings['triggers'], $payload_settings['settings'] );

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

		if ( $this->checkNonce( 'cs_change_popup_template' ) ) {
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

		wp_die();
	}

	/**
	 * Delete campaign
	 *
	 * @return void
	 */
	public function deleteCampaign() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;

		if ( $this->checkNonce( 'icp_delete_campaign' ) ) {
			try {
				wp_delete_post( $post_id );

				$stats = new StatsService();
				$stats->destroy( $post_id );

				wp_send_json_success(
					array(
						'message'      => __( 'The campaign was deleted.', 'iconvert-promoter' ),
						'url_redirect' => cs_generate_page_url( 'promos.list' ),
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

		if ( $this->checkNonce( 'icp_duplicate_campaign' ) ) {
			try {
				$new_post_id = PopupService::duplicate( $post_id, $campaign_name );

				wp_send_json_success(
					array(
						'message'      => __( 'The campaign was duplicated.', 'iconvert-promoter' ),
						'url_redirect' => cs_generate_page_url( 'promo.edit', array( 'post_id' => $new_post_id ) ),
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

		if ( $this->checkNonce( 'icp_reset_stats_campaign' ) ) {
			try {
				$stats_service = new StatsService();
				$stats_service->resetAllStats( $post_id );

				wp_send_json_success(
					array(
						'message'      => __( 'The campaign statistics was reset.', 'iconvert-promoter' ),
						'url_redirect' => cs_generate_page_url( 'promos.list' ),
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
