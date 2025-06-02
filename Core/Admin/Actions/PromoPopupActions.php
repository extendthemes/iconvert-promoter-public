<?php

namespace CSPromo\Core\Admin\Actions;

use CSPromo\Core\PostTypes\PromoPopups;
use CSPromo\Core\Services\StatsService;

class PromoPopupActions {
	public function __construct() {
		add_action( 'admin_post_delete_popup', array( $this, 'delete_popup' ) );
		add_action( 'admin_post_store_popup', array( $this, 'store_popup' ) );
		add_action( 'admin_post_status_popup', array( $this, 'status_popup' ) );

		add_action( 'wp_ajax_cs_promo_richtext_save', array( $this, 'popup_content_save' ) );
		add_action( 'wp_ajax_cs_promo_richtext_get', array( $this, 'popup_content_get' ) );

		add_action( 'wp_ajax_ic_promo_status', array( $this, 'ajax_status_popup' ) );
		add_action( 'wp_ajax_ic_promo_search_pages', array( $this, 'ajax_promo_search_pages' ) );
		add_action( 'wp_ajax_ic_promo_search_countries', array( $this, 'ajax_promo_search_countries' ) );
		add_action( 'wp_ajax_ic_promo_search_regions', array( $this, 'ajax_promo_search_regions' ) );
		add_action( 'wp_ajax_ic_promo_search_class_id', array( $this, 'ajax_promo_search_class_id' ) );
	}

	/**
	 * delete_popup - delete the popup
	 *
	 * @return void
	 */
	public function delete_popup() {
		if ( check_admin_referer( 'delete_popup' ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$post_id = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;
			$deleted = wp_delete_post( $post_id );

			if ( $deleted ) {
				$stats = new StatsService();
				$stats->destroy( $post_id );

				cs_flash_message_add( __( 'The campaign was deleted.', 'iconvert-promoter' ) );
			} else {
				cs_flash_message_add( __( 'There was an error deleting this popup. Please try again.', 'iconvert-promoter' ), 'error' );
			}
		} else {
			cs_flash_message_add( __( 'There was a problem deleting this popup. Nonce seems invalid.', 'iconvert-promoter' ), 'error' );
		}

		wp_safe_redirect( cs_generate_page_url( 'promos.list' ) );
		exit;
	}

	/**
	 * store_popup - creates a new popup
	 *
	 * @return void
	 */
	public function store_popup() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		if ( isset( $_POST['cs_meta_nonce'] ) && wp_verify_nonce( $_POST['cs_meta_nonce'], 'store_popup' ) ) {
			if ( PromoPopups::store() ) {
				cs_flash_message_add( __( 'The popup was saved.', 'iconvert-promoter' ) );
			} else {
				cs_flash_message_add( __( 'There was an error saving this popup. Please try again.', 'iconvert-promoter' ), 'error' );
			}
		} else {
			cs_flash_message_add( __( 'There was a problem saving a new popup. Nonce seems invalid.', 'iconvert-promoter' ), 'error' );
		}

		wp_safe_redirect( cs_registry_get( 'settings_page_url' ) );
		exit;
	}





	/**
	 * status_popup - change the status of a popup
	 *
	 * @return void
	 */
	public function status_popup() {
		if ( check_admin_referer( 'status_popup' ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$post_id = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;
			$active  = get_post_meta( $post_id, 'active', true );
			update_post_meta( $post_id, 'active', ! $active );
		} else {
			cs_flash_message_add( __( 'There was a problem changing the status for this popup. Nonce seems invalid.', 'iconvert-promoter' ), 'error' );
		}

		wp_safe_redirect( cs_registry_get( 'settings_page_url' ) );
		exit;
	}

	/**
	 * AJAX change the status of a popup
	 *
	 * @return void
	 */
	public function ajax_status_popup() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;

		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotValidated
		if ( wp_verify_nonce( $_POST['nonce'], 'status_popup_' . $post_id ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$active = isset( $_POST['status'] ) && intval( $_POST['status'] ) === 1 ? false : true;

			update_post_meta( $post_id, 'active', ! $active );
			wp_send_json_success( __( 'Status changed', 'iconvert-promoter' ), 200 );
		} else {
			wp_send_json_error( __( 'There was a problem changing the status for this popup. Nonce seems invalid.', 'iconvert-promoter' ) );
		}

		wp_die();
	}


	/**
	 * AJAX return a list of records based on the search term from the pages dropdown
	 *
	 * @return void
	 */
	public function ajax_promo_search_pages() {

		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$searchTerm = isset( $_POST['search'] ) ? sanitize_text_field( $_POST['search'] ) : '';

		$results = array();

		$query = new \WP_Query(
			array(
				's'         => $searchTerm,
				'post_type' => array( 'post', 'page', 'product' ),
			)
		);

		while ( $query->have_posts() ) {
			$query->the_post();
			$results[] = array(
				'id'   => get_the_ID(),
				'text' => get_the_title(),
			);
		}

		wp_send_json_success( array( 'items' => $results ), 200 );
		wp_die();
	}

	/**
	 * AJAX return a list of records based on the search term from the countries dropdown
	 *
	 * @return void
	 */
	public function ajax_promo_search_countries() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$searchTerm = isset( $_POST['search'] ) ? sanitize_text_field( $_POST['search'] ) : '';

		$json = file_get_contents( IC_PROMO_PATH . '/admin/assets/json/countries.json' );

		$data = json_decode( $json );

		$results = array();

		foreach ( $data as $key => $value ) {
			if ( stripos( $value, $searchTerm ) !== false || $searchTerm === '' ) {
				$results[] = array(
					'id'   => $key,
					'text' => $value,
				);
			}
		}

		wp_send_json_success( array( 'items' => $results ), 200 );
		wp_die();
	}

	/**
	 * AJAX return a list of records based on the search term from the regions dropdown
	 *
	 * @return void
	 */
	public function ajax_promo_search_regions() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$searchTerm = isset( $_POST['search'] ) ? sanitize_text_field( $_POST['search'] ) : '';

		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$countries = isset( $_POST['countries'] ) ? $_POST['countries'] : array();

		$results = array();

		$json = file_get_contents( IC_PROMO_PATH . '/admin/assets/json/regions.json' );

		$data = json_decode( $json );

		$results = array();

		foreach ( $countries as $countryCode ) {
			foreach ( $data->$countryCode as  $value ) {
				if ( stripos( $value, $searchTerm ) !== false || $searchTerm === '' ) {
					$results[] = array(
						'id'   => $value,
						'text' => $value . ', ' . $countryCode,
					);
				}
			}
		}

		wp_send_json_success( array( 'items' => $results ), 200 );
		wp_die();
	}

	/**
	 * AJAX return a list of records based on the search term from the pages dropdown
	 *
	 * @return void
	 */
	public function ajax_promo_search_class_id() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$searchTerm = isset( $_POST['search'] ) ? sanitize_text_field( $_POST['search'] ) : '';

		$results = array();

		$query = new \WP_Query(
			array(
				'posts_per_page' => -1,
				'post_type'      => array( 'post', 'page', 'product' ),
			)
		);

		$classes = array();
		$ids     = array();
		$content = '';

		while ( $query->have_posts() ) {
			$query->the_post();

			global $more;
			$more = 1;

			ob_start();
			the_content();
			get_header();
			get_sidebar();
			get_footer();
			$content .= ob_get_clean();

			preg_match_all(
				"|class=[\"'](.*)[\"']|U",
				$content,
				$outClasses,
				PREG_PATTERN_ORDER
			);

			preg_match_all(
				"|id=[\"'](.*)[\"']|U",
				$content,
				$outIds,
				PREG_PATTERN_ORDER
			);

			$classes = array_merge( $classes, $outClasses[1] );
			$ids    += array_merge( $ids, $outIds[1] );
		}

		$classesNew = array();
		foreach ( $classes as $element ) {
			$classesNew = array_merge( $classesNew, array_filter( explode( ' ', $element ) ) );
		}

		$idsNew = array();
		foreach ( $ids as $element ) {
			$idsNew = array_merge( $idsNew, array_filter( explode( ' ', $element ) ) );
		}

		$classes = array_unique( $classesNew );
		$ids     = array_unique( $idsNew );

		sort( $classes );
		sort( $ids );

		$results[] = array(
			'id'   => $searchTerm,
			'text' => $searchTerm,
		);

		foreach ( $classes as $element ) {
			if ( $searchTerm ) {
				if ( strpos( $element, $searchTerm ) ) {
					$results[] = array(
						'id'   => '.' . $element,
						'text' => '.' . $element,
					);
				}
			} else {
				$results[] = array(
					'id'   => '.' . $element,
					'text' => '.' . $element,
				);
			}
		}

		foreach ( $ids as $element ) {
			if ( $searchTerm ) {
				if ( strpos( $element, $searchTerm ) ) {
					$results[] = array(
						'id'   => '#' . $element,
						'text' => '#' . $element,
					);
				}
			} else {
					$results[] = array(
						'id'   => '#' . $element,
						'text' => '#' . $element,
					);
			}
		}

		wp_send_json_success( array( 'items' => $results ), 200 );
		wp_die();
	}

	/**
	 * save content from gutenberg
	 *
	 * @return void
	 */
	public function popup_content_save() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;
		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.ValidatedSanitizedInput.InputNotValidated,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$post_content = $_POST['content'];

		if ( ! $post_id ) {
			wp_die();
		}

		update_post_meta( $post_id, 'cs_promo_rich_text', $post_content );
		get_post_meta( 'cs_promo_rich_text', $post_id, true );

		wp_die();
	}

	/**
	 * get content for the gutenberg editor
	 *
	 * @return void
	 */
	public function popup_content_get() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$post_id = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;
		$meta    = get_post_meta( $post_id, false, true );

		if ( isset( $meta['cs_promo_rich_text'] ) && is_array( $meta['cs_promo_rich_text'] ) ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo $meta['cs_promo_rich_text'][0];
		} else {
			echo '';
		}

		wp_die();
	}
}
