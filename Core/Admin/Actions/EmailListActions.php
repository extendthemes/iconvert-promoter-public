<?php
namespace CSPromo\Core\Admin\Actions;

use CSPromo\Core\Traits\HasAction;
use CSPromo\Core\Services\EmailListsService;
use CSPromo\Core\Services\SubscribersService;

class EmailListActions {
	use HasAction;

	public function __construct() {
		add_action( 'admin_post_iconvertpr_create_email_list', array( $this, 'store' ) );
		add_action( 'admin_post_iconvertpr_update_email_list', array( $this, 'update' ) );
		add_action( 'admin_post_iconvertpr_delete_email_list', array( $this, 'destroy' ) );
		add_action( 'admin_post_iconvertpr_unsubscribe_contact', array( $this, 'unsubscribe' ) );
		add_action( 'admin_post_iconvertpr_download_email_list', array( $this, 'download' ) );

		add_action( 'wp_ajax_iconvertpr_email_lists_delete', array( $this, 'ajaxDestroy' ) );
		add_action( 'wp_ajax_iconvertpr_email_lists_create', array( $this, 'ajaxStore' ) );
		add_action( 'wp_ajax_iconvertpr_email_lists_sync', array( $this, 'ajaxSyncList' ) );
		add_action( 'wp_ajax_iconvertpr_email_lists_edit', array( $this, 'ajaxEdit' ) );
		add_action( 'wp_ajax_iconvertpr_email_lists_provider_lists', array( $this, 'getProviderLists' ) );
		add_action( 'wp_ajax_iconvertpr_email_lists_update', array( $this, 'ajaxUpdate' ) );
	}

	/**
	 * AJAX Get the edit details of a subscriber
	 *
	 * @return void
	 */
	public function ajaxEdit() {
		if ( $this->checkNonce( 'iconvertpr_list_management', true ) ) {
			$service = new EmailListsService();
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$post_id   = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;
			$emailList = $service->find( array( 'id' => $post_id ) );

			if ( $emailList ) {
				$body = array(
					'body' => array(
						'name'         => ( wp_unslash( $emailList->name ) ),
						'subject'      => ( wp_unslash( $emailList->subject ) ),
						'description'  => html_entity_decode( wp_unslash( $emailList->description ) ),
						'templateID'   => intval( $emailList->template_id ),
						'provider'     => ( wp_unslash( $emailList->provider ) ),
						'providerList' => ( wp_unslash( $emailList->provider_list ) ),
					),
				);
				iconvertpr_flash_message_add( __( 'The list was updated!', 'iconvert-promoter' ) );
				wp_send_json_success( $body, 200 );
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

	public function getProviderLists() {

		$lists = apply_filters( 'iconvertpr_get_provider_lists', array() );

		return $lists;
	}

	/**
	 * AJAX GUpdate a subscriber's details
	 *
	 * @return void
	 */
	public function ajaxUpdate() {
		if ( $this->checkNonce( 'iconvertpr_list_management' ) ) {
			$service = new EmailListsService();

			// phpcs:ignore WordPress.Security.NonceVerification.Missing
			$postID    = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;
			$emailList = $service->find( array( 'id' => $postID ) );

			if ( $emailList ) {
				// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotValidated,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
				$name = sanitize_text_field( $_POST['name'] );
				// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotValidated,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
				$subject = sanitize_text_field( $_POST['subject'] );
				// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotValidated,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
				$description = sanitize_textarea_field( $_POST['description'] );
				// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotValidated,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
				$templateID = intval( $_POST['template'] );
				// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotValidated,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
				$provider = sanitize_text_field( $_POST['provider'] );
				// phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotValidated,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
				$providerList = sanitize_text_field( $_POST['provider_list'] );
				$data         = array(
					'name'          => $name,
					'subject'       => $subject,
					'description'   => $description,
					'template_id'   => $templateID,
					'provider'      => $provider,
					'provider_list' => $providerList,
				);

				$update = $service->update( $data, array( 'id' => $postID ) );

				if ( $update ) {
					iconvertpr_flash_message_add( __( 'The list was updated!', 'iconvert-promoter' ) );
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
	 * Store an email list
	 *
	 * @return void
	 */
	public function store() {
		if ( $this->checkNonce( 'iconvertpr_create_email_list' ) ) {
			$service = new EmailListsService();

			if ( $service->store() ) {
				iconvertpr_flash_message_add( __( 'The email list was created.', 'iconvert-promoter' ) );
			} else {
				iconvertpr_flash_message_add( __( 'There was a problem creating your email list. The record was not saved', 'iconvert-promoter' ), 'error' );
			}
		} else {
			$this->nonceInvalidMessage();
		}

		$this->redirectToSettingsPage();
	}

	/**
	 * Update an email list
	 *
	 * @return void
	 */
	public function update() {
		if ( $this->checkNonce( 'iconvertpr_update_email_list' ) ) {
			$service = new EmailListsService();

			if ( $service->edit() ) {
				iconvertpr_flash_message_add( __( 'The email list was saved.', 'iconvert-promoter' ) );
			} else {
				iconvertpr_flash_message_add( __( 'There was a problem saving your email list.', 'iconvert-promoter' ), 'error' );
			}
		} else {
			$this->nonceInvalidMessage();
		}

		$this->redirectToSettingsPage();
	}

	/**
	 * Delete an email list
	 *
	 * @return void
	 */
	public function destroy() {
		if ( $this->checkNonce( 'iconvertpr_delete_email_list', true ) ) {
			$service = new EmailListsService();

			if ( $service->destroy() ) {
				iconvertpr_flash_message_add( __( 'The email list was deleted.', 'iconvert-promoter' ) );
			} else {
				iconvertpr_flash_message_add( __( 'There was a problem deleting your email list.', 'iconvert-promoter' ), 'error' );
			}
		} else {
			$this->nonceInvalidMessage();
		}

		$this->redirectToSettingsPage( 'subscribers.lists', array(), ICONVERTPR_PAGE_SUBSCRIBERS );
	}

	/**
	 * Unsubscribe a contact from an email list
	 *
	 * @return void
	 */
	public function unsubscribe() {
		if ( $this->checkNonce( 'iconvertpr_unsubscribe_contact', true ) ) {
			$service = new EmailListsService();

			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$contact_id = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$list_id = isset( $_GET['list_id'] ) ? intval( $_GET['list_id'] ) : 0;

			if ( $service->unsubscribeContact( $contact_id, $list_id ) ) {
				iconvertpr_flash_message_add( __( 'The contact was unsubscribed.', 'iconvert-promoter' ) );
			} else {
				iconvertpr_flash_message_add( __( 'There was a problem unsubscribing your contact.', 'iconvert-promoter' ), 'error' );
			}
		} else {
			$this->nonceInvalidMessage();
		}

		$this->redirectToSettingsPage( 'subscribers.lists.emails', array( 'post_id' => $list_id ), ICONVERTPR_PAGE_SUBSCRIBERS );
	}

	/**
	 * Download an email list
	 *
	 * @return void
	 */
	public function download() {
		if ( $this->checkNonce( 'iconvertpr_download_email_list', true ) ) {
			$service = new EmailListsService();

			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$list_id = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;

			if ( $service->download( $list_id ) ) {
				iconvertpr_flash_message_add( __( 'The email list was downloaded.', 'iconvert-promoter' ) );
			} else {
				iconvertpr_flash_message_add( __( 'There was a problem downloading your email list.', 'iconvert-promoter' ), 'error' );
			}
		} else {
			$this->nonceInvalidMessage();
		}

		// $this->redirectToSettingsPage('subscribers.lists.emails', ['post_id' => $list_id], ICONVERTPR_PAGE_SUBSCRIBERS);
	}

	/**
	 * AJAX Delete an email list
	 *
	 * @return void
	 */
	public function ajaxDestroy() {
		if ( $this->checkNonce( 'iconvertpr_list_management' ) ) {
			$service = new EmailListsService();
			// phpcs:ignore WordPress.Security.NonceVerification.Missing
			$post_id       = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;
			$popupWithForm = $service->isAttachedToAForm( intval( $post_id ) );

			if ( $popupWithForm === false && $post_id ) {
				if ( $service->destroy( $post_id ) ) {
					iconvertpr_flash_message_add( __( 'The email list was deleted!', 'iconvert-promoter' ) );
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
				wp_send_json_error(
					array(
						'body'    => 0,
						'message' => wp_sprintf(
							// translators: %s is the name of the form
							__( "You can't delete this list because it is attached to a subscribe form! (%s)", 'iconvert-promoter' ),
							$popupWithForm
						),
					),
					200
				);
			}
		} else {
			wp_send_json_error(
				array(
					'body'    => 0,
					'message' => __( 'There was a problem. Nonce seems invalid.', 'iconvert-promoter' ),
				),
				200
			);
		}

		wp_die();
	}

	/**
	 * AJAX Store an email list
	 *
	 * @return void
	 */
	public function ajaxStore() {
		if ( $this->checkNonce( 'iconvertpr_list_management' ) ) {
			$service = new EmailListsService();
			$listID  = $service->store();

			if ( $listID ) {
				iconvertpr_flash_message_add( __( 'The email list was created!', 'iconvert-promoter' ) );
				wp_send_json_success(
					array(
						'body' => iconvertpr_generate_page_url( 'subscribers.lists.emails', array( 'post_id' => $listID ), ICONVERTPR_PAGE_SUBSCRIBERS ),
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

	public function ajaxSyncList() {
		if ( $this->checkNonce( 'iconvertpr_list_management' ) ) {
			$list_service       = new EmailListsService();
			$subscriber_service = new SubscribersService();
			// phpcs:ignore WordPress.Security.NonceVerification.Missing
			$list_id = isset( $_POST['list_id'] ) ? intval( $_POST['list_id'] ) : 0;
			$list    = $list_service->find( array( 'id' => $list_id ) );

			if ( ! $list ) {
				wp_send_json_error( __( 'The list does not exist.', 'iconvert-promoter' ) );
			}

			$per_page = 5;

			$subs = $subscriber_service->getRecordsNotSynced(
				$list_id,
				$list->provider,
				$list->provider_list,
				$per_page,
				1
			);

			$subs_records      = $subs['records'];
			$remaining_to_sync = $subs['total'];

			foreach ( $subs_records as $sub ) {
				$list_service->maybeAddToProvider( $sub, $list, false );
			}

			$synced            = count( $subs_records );
			$remaining_to_sync = $remaining_to_sync - $synced;
			if ( $remaining_to_sync > 0 ) {
				wp_send_json_success(
					array(
						'finished' => false,
						'message'  => sprintf(
							// translators: %s is the number of subscribers remaining to sync
							esc_html__( 'The list is synchronizing. %s remaining to sync', 'iconvert-promoter' ),
							$remaining_to_sync
						),

					),
					200
				);
			}

				wp_send_json_success(
					array(
						'finished' => true,
						'message'  => __( 'The list was synchronized.', 'iconvert-promoter' ),
					),
					200
				);

		} else {
			wp_send_json_error( __( 'There was a problem. Nonce seems invalid.', 'iconvert-promoter' ) );
		}
	}
}
