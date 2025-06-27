<?php
namespace CSPromo\Core\Traits;

trait HasAction {

	/**
	 * Check nonce
	 *
	 * @param  string $action
	 * @param  bool   $is_get_method
	 * @param  string $name
	 * @return bool
	 */
	public function checkNonce( $action, $is_get_method = false, $name = '_wpnonce' ) {
		if ( $is_get_method ) {
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			return isset( $_GET[ $name ] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET[ $name ] ) ), $action );
		} else {
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			return isset( $_POST[ $name ] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST[ $name ] ) ), $action );
		}
	}

	/**
	 * Nonce invalid standard message
	 *
	 * @param  string $message
	 * @param  string $status
	 * @return void
	 */
	public function nonceInvalidMessage( string $message = null, $status = 'error' ) {
		if ( $message != null ) {
			iconvertpr_flash_message_add( $message, $status );
		} else {
			iconvertpr_flash_message_add( __( 'There was a problem with your request. Nonce seems invalid.', 'iconvert-promoter' ), 'error' );
		}
	}

	/**
	 * Redirect to an admin page
	 *
	 * @param  string $url
	 * @return void
	 */
	public function redirectToSettingsPage( string $url = null, $args = array(), $ns = false ) {
		if ( $url !== null ) {
			wp_safe_redirect( iconvertpr_generate_page_url( $url, $args, $ns ) );
		} else {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotValidated, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			wp_safe_redirect( $_POST['_wp_http_referer'] );
		}
		exit;
	}
}
