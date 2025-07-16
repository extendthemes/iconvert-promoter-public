<?php

namespace CSPromo\Core\Admin\Pages;

use CSPromo\Core\Traits\HasTemplate;
use CSPromo\Core\Admin\Structure\Pagination;
use CSPromo\Core\Services\EmailListsService;
use CSPromo\Core\Services\SubscribersService;

class EmailListContactsPage {
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
		$perPage = 15;
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$listID = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;

		$service = new SubscribersService();
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.NonceVerification.Recommended
		$search_email = isset( $_GET['search-email'] ) ? sanitize_text_field( $_GET['search-email'] ) : '';

		$totalRecords = $service->getRecordsByList( $listID, $perPage, Pagination::getPageNumber(), trim( $search_email ) );

		$service    = new EmailListsService();
		$emailLists = $service->getRecords( 100, 1 );

		$pagination  = new Pagination( $totalRecords['total'], $perPage );
		$listService = new EmailListsService();

		$list               = $listService->find( array( 'id' => $listID ) );
		$createFormTemplate = self::template( 'pages/email-lists/create', array(), false );

		if ( $list ) {

			$innerContent = array(
				'records'             => $totalRecords['records'],
				'total'               => $totalRecords['total'],
				'emailLists'          => $emailLists['records'],
				'createFormTemplate'  => $createFormTemplate,
				'listID'              => $listID,
				'list'                => $list,
				// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
				'isSearchResultsPage' => isset( $_GET['search-email'] ),
				// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
				'searchTerm'          => isset( $_GET['search-email'] ) ? sanitize_text_field( $_GET['search-email'] ) : '',
				'pagination'          => $pagination->render( 'subscribers.lists.emails', ICONVERTPR_PAGE_SUBSCRIBERS ),
			);

			self::templateWithLayout( 'pages/email-lists/subscribers', $innerContent );
		} else {
			self::templateWithLayout(
				'pages/email-lists/index',
				array(
					'emailLists'         => $emailLists['records'],
					'createFormTemplate' => $createFormTemplate,
					'listID'             => $listID,
					'list'               => $list,
				)
			);
		}
	}
}
