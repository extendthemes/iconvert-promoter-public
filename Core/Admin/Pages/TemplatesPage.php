<?php

namespace CSPromo\Core\Admin\Pages;

use CSPromo\Core\Traits\HasTemplate;
use CSPromo\Core\PostTypes\PromoPopups;
use CSPromo\Core\Services\TemplatesService;
use CSPromo\Core\Admin\Structure\Pagination;

class TemplatesPage {
	use HasTemplate;

	public function __construct() {
		self::$_layout = '_layout_templates';
	}

	/**
	 * Render the lists page
	 *
	 * @return void
	 */
	public function index() {

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$popupID = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : null;

		// get current popup
		$popup = PromoPopups::get( $popupID );

		if ( $popup ) {
			$perPage   = 15;
			$service   = new TemplatesService();
			$templates = $service->getRecords( $popup['popup_type'] );
			// get popup types

			$pagination = new Pagination( $templates['total'], $perPage );

			self::templateWithLayout(
				'pages/templates/index',
				array(
					'records'    => $templates['records'],
					'popup'      => $popup,
					'pagination' => $pagination->render( 'templates' ),
				)
			);
		}
	}
}
