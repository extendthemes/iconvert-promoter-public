<?php

namespace CSPromo\Core\Frontend\Actions\Helpers\DisplayConditions;


class PageCheck {

	public $id;
	public $array;
	public $state;

	public function __construct( $id, $array, $state = array() ) {
		$this->id    = $id;
		$this->array = $array;
		$this->state = $state;
	}

	public function check() {
		if ( ! is_array( $this->array ) || empty( $this->array ) ) {
			return true;
		}

		$entities_ids = isset( $this->array[1] ) ? $this->array[1] : array();
		$entities_ids = array_map( 'intval', $entities_ids );

		switch ( $this->array[0] ) {
			case 'all':
				return true;

			case 'all-no-homepage':
				if ( ! is_front_page() ) {
					return true;
				}
				break;
			case 'homepage':
				if ( is_front_page() ) {
					return true;
				}
				break;
			case 'posts':
				if ( is_singular( 'post' ) ) {
					return true;
				}
				break;
			case 'pages':
				if ( is_singular( 'page' ) || $this->is_blog_page() ) {
					return true;
				}
				break;
			case 'products':
				if ( function_exists( 'wc_get_product' ) && is_singular( 'product' ) ) {
					return true;
				}
				break;
			case 'specific_posts':
				if ( is_single( $entities_ids ) ) {
					return true;
				}
				break;

			case 'specific_pages':
				if ( is_page( $entities_ids ) || $this->is_blog_page_selected( $this->array[1] ) ) {
					return true;
				}

				$shop_page = function_exists( 'wc_get_page_id' ) ? wc_get_page_id( 'shop' ) : 0;
				if ( in_array( $shop_page, $entities_ids ) && is_shop() ) {
					return true;
				}
				break;

			case 'specific_products':
				if ( function_exists( 'wc_get_product' ) && is_single() ) {
					$product = wc_get_product();
					if ( in_array( $product->id, $entities_ids ) ) {
						return true;
					}
				}
				break;
		}

		return false;
	}

	public function is_blog_page_selected( $pageIDs ) {
		global $wp_query;
		$blogPageID    = get_option( 'page_for_posts' );
		$currentPageID = isset( $wp_query->query_vars['page_id'] ) ? $wp_query->query_vars['page_id'] : false;
		if ( isset( $wp_query->queried_object_id ) && $currentPageID == false ) {
			$currentPageID = $wp_query->queried_object_id;
		}

		if ( in_array( $blogPageID, $pageIDs ) && ( $currentPageID == $blogPageID ) ) {
			return true;
		}

		return false;
	}

	public function is_blog_page() {
		global $wp_query;

		if ( isset( $wp_query ) && (bool) $wp_query->is_posts_page ) {
			return true;
		}

		return false;
	}
}
