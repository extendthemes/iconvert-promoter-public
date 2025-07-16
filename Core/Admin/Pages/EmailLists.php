<?php

namespace CSPromo\Core\Admin\Pages;

use CSPromo\Core\Traits\HasTemplate;
use CSPromo\Core\Admin\Structure\Pagination;
use CSPromo\Core\Services\EmailListsService;

class EmailLists {
	use HasTemplate;

	public function __construct() {
		self::$_layout = '_layout_email_lists';
	}

	/**
	 * Render the lists page
	 *
	 * @return void
	 */
	public function index() {
		$perPage    = 15;
		$service    = new EmailListsService();
		$emailLists = $service->getRecords( $perPage, Pagination::getPageNumber() );

		$pagination         = new Pagination( $emailLists['total'], $perPage );
		$createFormTemplate = self::template( 'pages/email-lists/create', array(), false );

		self::templateWithLayout(
			'pages/email-lists/index',
			array(
				'emailLists'         => $emailLists['records'],
				'createFormTemplate' => $createFormTemplate,
				'list'               => false,
				'listID'             => 0,
				'pagination'         => $pagination->render( 'subscribers.lists', ICONVERTPR_PAGE_SUBSCRIBERS ),
			)
		);
	}

	/**
	 * Render the create page
	 *
	 * @return void
	 */
	public function create() {
		self::templateWithLayout( 'pages/email-lists/create', array() );
	}

	/**
	 * Render the update page
	 *
	 * @return void
	 */
	public function update() {
		$service = new EmailListsService();

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$post_id = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;
		$record  = $service->find( array( 'id' => $post_id ) );

		if ( ! empty( $record ) ) {
			self::templateWithLayout( 'pages/email-lists/update', array( 'record' => $record ) );
		} else {
			self::show404( __( 'The record was not found.', 'iconvert-promoter' ) );
		}
	}
}
