<?php

namespace CSPromo\Core\Frontend\API;

use CSPromo\Core\Services\StatsService;
use CSPromo\Core\Services\EmailListsService;
use CSPromo\Core\Traits\HasRateLimit;

class EmailListsAPI {
	use HasRateLimit;

	public function __construct() {
		add_action( 'wp_ajax_iconvertpr_get_email_lists', array( $this, 'index' ) );
		add_action( 'wp_ajax_iconvertpr_subscribe_email_to_list', array( $this, 'subscribe' ) );
		add_action( 'wp_ajax_nopriv_iconvertpr_subscribe_email_to_list', array( $this, 'subscribe' ) );

		add_action(
			'rest_api_init',
			function () {
				register_rest_route(
					'promo/v1',
					'/lists',
					array(
						'methods'             => 'GET',
						'callback'            => array( $this, 'lists' ),
						'permission_callback' => function () {
							return current_user_can( 'manage_options' );
						},
					)
				);
			}
		);
	}

	/**
	 * API - Get a list of email lists
	 *
	 * @return array
	 */

	public function lists() {
		$listService = new EmailListsService();
		$lists       = $listService->getRecords( 30 );

		return $lists;
	}

	/**
	 * AJAX - Get a list of email lists
	 *
	 * @return void
	 */
	public function index() {
		$listService = new EmailListsService();
		$lists       = $listService->getRecords( 30 );

		wp_send_json_success(
			array(
				'body' => $lists['records'],
			),
			200
		);

		wp_die();
	}

	/**
	 * AJAX - Subscribe an email to a list
	 *
	 * @return void
	 */
	public function subscribe() {

		if ( $this->is_rate_limit_exceeded( 'subscribe', ICONVERTPR_SUBSCRIBE_RATE_LIMIT_REQUEST ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Rate limit exceeded', 'iconvert-promoter' ),
					'code'    => 'RATE_LIMIT_EXCEEDED',
					'status'  => 'error',
				),
				200
			);
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		$listID = isset( $_POST['listID'] ) ? intval( $_POST['listID'] ) : 0;
		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$email = isset( $_POST['fields']['email'] ) ? sanitize_email( $_POST['fields']['email'] ) : '';
		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$name = isset( $_POST['fields']['name'] ) ? sanitize_text_field( $_POST['fields']['name'] ) : '';
		// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$popupID = isset( $_POST['fields']['popupID'] ) ? intval( $_POST['fields']['popupID'] ) : 0;

		$this->validateRequestSubscribe( $listID, $popupID );
		$listService = new EmailListsService();
		$list        = $listService->find( array( 'id' => $listID ) );

		if ( empty( $list ) ) {
			$listID = $listService->getDefaultListID();
			$list   = $listService->find( array( 'id' => $listID ) );
		}

		// email is not valid
		if ( ! is_email( $email ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Invalid email address', 'iconvert-promoter' ),
					'code'    => 'EMAIL_INVALID',
					'status'  => 'error',
				),
				200
			);
		}

		// the list doesn't exist
		if ( empty( $list ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'List not found', 'iconvert-promoter' ),
					'code'    => 'LIST_NOT_FOUND',
					'status'  => 'error',
				),
				200
			);
		}

		// the email is already subscribed to the list
		if ( $listService->isSubscribedToList( $email, $listID ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Email already subscribed to the list', 'iconvert-promoter' ),
					'code'    => 'EMAIL_ALREADY_SUBSCRIBED',
					'status'  => 'info',
				),
				200
			);
		}

		// subscribe the email to the list
		$subscribe = $listService->subscribe( $listID, $email, $name, $list->template_id );

		if ( $subscribe ) {
			// update the number of subscribers
			$statsService = new StatsService();
			$statsService->updateStat( $popupID, 'subscribe' );

			wp_send_json_success(
				array(
					'message' => __( 'Email subscribed to the list', 'iconvert-promoter' ),
					'code'    => 'EMAIL_SUBSCRIBED',
					'status'  => 'success',
				),
				200
			);
		} else {
			wp_send_json_error(
				array(
					'message' => __( 'Error subscribing email to the list', 'iconvert-promoter' ),
					'code'    => 'ERROR_SUBSCRIBING_EMAIL',
					'status'  => 'error',
				),
				200
			);
		}

		wp_die();
	}

	public static function nonceUserLoggedOut( $uid ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$visitor_id = isset( $_REQUEST['visitor_id'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['visitor_id'] ) ) : '';

		if ( ! $uid && $visitor_id ) {
			$uid = $visitor_id;
		}

			return $uid;
	}

	public static function createNonce( $popupID, $listID ) {
		add_filter(
			'nonce_user_logged_out',
			array( __CLASS__, 'nonceUserLoggedOut' )
		);
		$nonce = wp_create_nonce( 'submit_form_' . $popupID . '_' . $listID );

		remove_filter(
			'nonce_user_logged_out',
			array( __CLASS__, 'nonceUserLoggedOut' )
		);
		return $nonce;
	}


	public static function verifyNonce( $current_nonce, $popupID, $listID ) {
		add_filter(
			'nonce_user_logged_out',
			array( __CLASS__, 'nonceUserLoggedOut' )
		);

		$valid = false;
		if ( wp_verify_nonce( sanitize_text_field( wp_unslash( $current_nonce ) ), 'submit_form_' . $popupID . '_' . $listID ) ) {
			$valid = true;
		}

		remove_filter(
			'nonce_user_logged_out',
			array( __CLASS__, 'nonceUserLoggedOut' )
		);

		return $valid;
	}


	public function validateRequestSubscribe( $listID, $popupID ) {

		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		$current_nonce = isset( $_POST['cspromo_wpnonce'] ) ? sanitize_text_field( wp_unslash( $_POST['cspromo_wpnonce'] ) ) : '';
		if ( $this->verifyNonce( $current_nonce, $popupID, $listID ) ) {
			return;
		}

		// in this case first_name is used as honeypot to prevent spam bots
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		$first_name = isset( $_POST['fields']['first_name'] ) ? sanitize_text_field( wp_unslash( $_POST['fields']['first_name'] ) ) : '';

		if ( ! $first_name ) {
			return;
		}

		wp_send_json_error(
			array(
				'message' => __( 'Fail subscribing request', 'iconvert-promoter' ),
				'code'    => 'FAIL_SUBSCRIBING_EMAIL_REQUEST',
				'status'  => 'error',
			),
			200
		);

		wp_die();
	}
}
