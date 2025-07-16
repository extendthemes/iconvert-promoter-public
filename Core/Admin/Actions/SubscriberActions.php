<?php

namespace CSPromo\Core\Admin\Actions;

use CSPromo\Core\Traits\HasAction;
use CSPromo\Core\Services\SubscribersService;
use CSPromo\Core\Traits\HasTemplate;

class SubscriberActions {

	use HasAction;
	use HasTemplate;

	public function __construct() {
		add_action( 'admin_post_iconvertpr_delete_subscriber', array( $this, 'destroy' ) );
		add_action( 'wp_ajax_iconvertpr_subscribers_delete', array( $this, 'ajaxDestroy' ) );
		add_action( 'wp_ajax_iconvertpr_subscribers_edit', array( $this, 'ajaxEdit' ) );
		add_action( 'wp_ajax_iconvertpr_subscribers_update', array( $this, 'ajaxUpdate' ) );
	}

	/**
	 * AJAX Delete an email
	 *
	 * @return void
	 */
	public function ajaxDestroy() {
		if ( $this->checkNonce( 'iconvertpr_list_management' ) ) {
			$service = new SubscribersService();
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$list_id = isset( $_POST['list_id'] ) ? intval( $_POST['list_id'] ) : 0;
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;

			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$where = isset( $_POST['where'] ) ? $_POST['where'] : 'list';

			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$include_marketing_providers = isset( $_POST['include_marketing_providers'] ) ? intval( $_POST['include_marketing_providers'] ) : 0;

			if ( $where === 'all_lists' ) {
				$destroy = $service->deleteFromAllLists( $post_id, $include_marketing_providers );
			} else {
				$destroy = $service->deleteFromList( $post_id, $list_id, $include_marketing_providers );
			}

			if ( $destroy ) {
				iconvertpr_flash_message_add( __( 'The subscriber was deleted!', 'iconvert-promoter' ) );
				wp_send_json_success(
					array(
						'body' => 1,
					),
					200
				);
			} else {
				wp_send_json_error(
					array(
						'body' => 0,
					)
				);
			}
		} else {
			wp_send_json_error( __( 'There was a problem. Nonce seems invalid.', 'iconvert-promoter' ) );
		}

		wp_die();
	}

	/**
	 * AJAX Get the edit details of a subscriber
	 *
	 * @return void
	 */
	public function ajaxEdit() {
		if ( $this->checkNonce( 'iconvertpr_list_management', true ) ) {
			$service = new SubscribersService();

			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.NonceVerification.Recommended
			$post_id = isset( $_REQUEST['post_id'] ) ? intval( $_REQUEST['post_id'] ) : 0;

			$subscriber = $service->find( array( 'id' => $post_id ) );

			if ( $subscriber ) {
				iconvertpr_flash_message_add( __( 'The subscriber was updated!', 'iconvert-promoter' ) );
				wp_send_json_success(
					array(
						'body' => self::template( 'pages/email-lists/edit-subscriber', array( 'subscriber' => $subscriber ), false ),
					),
					200
				);
			} else {
				wp_send_json_error(
					array(
						'body' => 0,
					)
				);
			}
		} else {
			wp_send_json_error( __( 'There was a problem. Nonce seems invalid.', 'iconvert-promoter' ) );
		}

		wp_die();
	}

	/**
	 * AJAX GUpdate a subscriber's details
	 *
	 * @return void
	 */
	public function ajaxUpdate() {
		if ( $this->checkNonce( 'iconvertpr_list_management' ) ) {
			$service = new SubscribersService();
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.NonceVerification.Recommended
			$post_id = isset( $_REQUEST['post_id'] ) ? intval( $_REQUEST['post_id'] ) : 0;

			$subscriber = $service->find( array( 'id' => $post_id ) );

			if ( $subscriber ) {
				// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
				$email = isset( $_POST['email'] ) ? sanitize_email( $_POST['email'] ) : '';
				// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
				$name = isset( $_POST['name'] ) ? sanitize_text_field( $_POST['name'] ) : '';

				if ( empty( $email ) ) {
					wp_send_json_error(
						array(
							'body' => 0,
						)
					);
				}

				$data = array(
					'name'  => $name,
					'email' => $email,
				);

				$update = $service->update( $data, array( 'id' => $post_id ) );

				if ( $update ) {
					iconvertpr_flash_message_add( __( 'The subscriber was updated!', 'iconvert-promoter' ) );
					wp_send_json_success(
						array(
							'body' => $data,
						),
						200
					);
				} else {
					wp_send_json_error(
						array(
							'body' => 0,
						)
					);
				}
			} else {
				wp_send_json_error(
					array(
						'body' => 0,
					)
				);
			}
		} else {
			wp_send_json_error( __( 'There was a problem. Nonce seems invalid.', 'iconvert-promoter' ) );
		}

		wp_die();
	}

	/**
	 * Store a contact list
	 *
	 * @return void
	 */
	public function store() {
		if ( $this->checkNonce( 'iconvertpr_create_contact' ) ) {
			$service = new SubscribersService();

			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$email = isset( $_POST['email'] ) ? sanitize_email( $_POST['email'] ) : '';

			if ( $service->find( array( 'email' => $email ) ) ) {
				iconvertpr_flash_message_add( __( 'This email address already exists in the database.', 'iconvert-promoter' ), 'error' );
			} else {
				if ( is_email( $email ) ) {
					if ( $service->store( $email ) ) {
						iconvertpr_flash_message_add( __( 'The contact was created.', 'iconvert-promoter' ) );
					} else {
						iconvertpr_flash_message_add( __( 'There was a problem creating your contact. The record was not saved', 'iconvert-promoter' ), 'error' );
					}
				} else {
					iconvertpr_flash_message_add( __( 'The email address is not valid. The record was not saved', 'iconvert-promoter' ), 'error' );
				}
			}
		} else {
			$this->nonceInvalidMessage();
		}

		$this->redirectToSettingsPage( 'contacts.create' );
	}

	/**
	 * Update a contact list
	 *
	 * @return void
	 */
	public function update() {
		if ( $this->checkNonce( 'iwpa_update_contact' ) ) {
			$service = new SubscribersService();
			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$email = isset( $_POST['email'] ) ? sanitize_email( $_POST['email'] ) : '';

			// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$contact_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;

			$current = $service->find( array( 'id' => $contact_id ) );

			if ( $current ) {
				//if the email address is other than the one used for the current record
				if ( intval( $current->id ) !== $contact_id ) {
					iconvertpr_flash_message_add( __( 'This email address already exists in the database.', 'iconvert-promoter' ), 'error' );
				} else {
					if ( is_email( $email ) ) {
						if ( $service->edit( $email, '', $contact_id ) ) {
							iconvertpr_flash_message_add( __( 'The contact was updated.', 'iconvert-promoter' ) );
						} else {
							iconvertpr_flash_message_add( __( 'There was a problem updating your contact. The record was not saved', 'iconvert-promoter' ), 'error' );
						}
					} else {
						iconvertpr_flash_message_add( __( 'The email address is not valid. The record was not saved', 'iconvert-promoter' ), 'error' );
					}
				}
			} else {
				iconvertpr_flash_message_add( __( 'There was a problem updating your contact. The record was not saved', 'iconvert-promoter' ), 'error' );
			}
		} else {
			$this->nonceInvalidMessage();
		}

		$this->redirectToSettingsPage( 'contacts.update', array( 'post_id' => $contact_id ) );
	}



	/**
	 * Delete a contact list
	 *
	 * @return void
	 */
	public function destroy() {
		if ( $this->checkNonce( 'iconvertpr_delete_subscriber', true ) ) {
			$service = new SubscribersService();
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.NonceVerification.Recommended
			$list_id = isset( $_GET['list_id'] ) ? intval( $_GET['list_id'] ) : 0;

			if ( $service->destroy() ) {
				iconvertpr_flash_message_add( __( 'The subscriber was deleted from the database.', 'iconvert-promoter' ) );
			} else {
				iconvertpr_flash_message_add( __( 'There was a problem deleting your subscriber.', 'iconvert-promoter' ), 'error' );
			}
		} else {
			$this->nonceInvalidMessage();
		}

		// do we need to redirect to a list page or to the contacts list page
		if ( $list_id ) {
			$this->redirectToSettingsPage( 'subscribers.lists.emails', array( 'post_id' => $list_id ), ICONVERTPR_PAGE_SUBSCRIBERS );
		} else {
			$this->redirectToSettingsPage( 'subscribers.lists' );
		}
	}
}
