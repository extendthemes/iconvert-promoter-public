<?php

namespace CSPromo\Core\Admin\Pages;

use CSPromo\Core\Admin\Structure\Pagination;
use CSPromo\Core\PostTypes\PromoPopups;
use CSPromo\Core\Services\PopupListService;
use CSPromo\Core\Traits\HasTemplate;

class ListPromos {

	use HasTemplate;

	public function render() {

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$searchTerm = isset( $_GET['search-campaign'] ) ? sanitize_text_field( $_GET['search-campaign'] ) : '';
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$paged = isset( $_GET['paged'] ) ? intval( $_GET['paged'] ) : 1;
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$sortBy = isset( $_GET['sort-by'] ) ? htmlspecialchars( $_GET['sort-by'] ) : '';
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$sortOrder = isset( $_GET['sort-order'] ) ? htmlspecialchars( $_GET['sort-order'] ) : '';
		$filter    = array(
			'search' => $searchTerm,
			'sort'   => array(
				'by'    => $sortBy,
				'order' => $sortOrder,
			),
		);

		$service = new PopupListService();
		$posts   = $service->getPostsByFilter( PromoPopups::POST_TYPE, $filter, PromoPopups::POST_PER_PAGE, Pagination::getPageNumber() );
		$popups  = PromoPopups::format( $posts['posts'] );

		$total      = $posts['total'];
		$pagination = new Pagination( $total, PromoPopups::POST_PER_PAGE );

		$sortByParams = array(
			'active'    => $this->getParamsByField( 'active', $searchTerm, $paged, $sortBy, $sortOrder ),
			'view'      => $this->getParamsByField( 'view', $searchTerm, $paged, $sortBy, $sortOrder ),
			'click'     => $this->getParamsByField( 'click', $searchTerm, $paged, $sortBy, $sortOrder ),
			'subscribe' => $this->getParamsByField( 'subscribe', $searchTerm, $paged, $sortBy, $sortOrder ),
		);

		self::templateWithLayout(
			'pages/promos-list',
			array(
				'popups'       => $popups,
				'searchTerm'   => $searchTerm,
				'paged'        => $paged,
				'sortBy'       => $sortBy,
				'sortOrder'    => $sortOrder,
				'sortByParams' => $sortByParams,
				'pagination'   => $pagination->render( 'promos.list', false ),
			)
		);
	}

	private function getParamsByField( $aField, $searchTerm, $paged, $sortBy, $sortOrder ) {
		$sortParams   = array(
			'search-campaign' => $searchTerm,
			'paged'           => $paged,
		);
		$sortByParams = array_merge( array( 'sort-by' => $aField ), $sortParams );
		if ( isset( $sortBy ) && $sortBy === $aField ) {
			$sortByParams['sort-order'] = ( $sortOrder === 'descending' ? 'ascending' : 'descending' );
		} else {
			$sortByParams['sort-order'] = 'descending';
		}

		return $sortByParams;
	}
}
