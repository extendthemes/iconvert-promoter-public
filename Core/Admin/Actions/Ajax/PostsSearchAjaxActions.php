<?php

namespace CSPromo\Core\Admin\Actions\Ajax;

use CSPromo\Core\Traits\HasAction;

class PostsSearchAjaxActions {

	use HasAction;

	public function __construct() {
		add_action( 'wp_ajax_iconvertpr_posts_search', array( $this, 'searchPostPages' ) );
		add_action( 'wp_ajax_iconvertpr_products_search', array( $this, 'searchProducts' ) );
	}

	/**
	 * Get provider settings field and logo
	 *
	 * @return void
	 */
	public function searchPostPages() {
		if ( $this->checkNonce( 'iconvertpr_posts-search', true, '_wpnonce_iconvertpr_search' ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$search = isset( $_GET['search'] ) ? sanitize_text_field( $_GET['search'] ) : '';
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$postType = isset( $_GET['post_type'] ) ? sanitize_text_field( $_GET['post_type'] ) : '';

			$searchParams = array(
				's'           => esc_html( $search ),
				'post_type'   => array( $postType ),
				'post_status' => array( 'publish' ),
				'orderby'     => 'title',
				'order'       => 'ASC',
			);

			// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$ids = isset( $_GET['ids'] ) ? explode( ',', $_GET['ids'] ) : array();
			$ids = array_map( 'intval', $ids );

			if ( count( $ids ) ) {

				$searchParams = array_merge( $searchParams, array( 'post__in' => $ids ) );
			}

			$query = new \WP_Query();
			$posts = $query->query( $searchParams );

			wp_send_json_success(
				array(
					'posts' => $posts,
				),
				200
			);
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
	public function searchProducts() {
		if ( $this->checkNonce( 'iconvertpr_product-search', true, '_wpnonce_iconvertpr_product_search' ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$search = isset( $_GET['search'] ) ? sanitize_text_field( $_GET['search'] ) : '';
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$ids = isset( $_GET['ids'] ) ? explode( ',', $_GET['ids'] ) : array(); // - this is mapped later to integers
			$ids = array_map( 'intval', $ids );

			if ( $search ) {
				// phpcs:ignore WordPress.WP.DiscouragedFunctions.query_posts_query_posts
				$posts = query_posts(
					array(
						's'         => $search,
						'post_type' => array( 'product' ),
					)
				);
			}

			if ( count( $ids ) ) {
				// phpcs:ignore WordPress.WP.DiscouragedFunctions.query_posts_query_posts
				$posts = query_posts(
					array(
						'post__in'  => $ids,
						'post_type' => array( 'product' ),
					)
				);
			}

			wp_send_json_success(
				array(
					'posts' => $posts,
				),
				200
			);
		} else {
			wp_send_json_error( __( 'There was a problem. Nonce seems is invalid.', 'iconvert-promoter' ) );
		}

		wp_die();
	}
}
