<?php

namespace CSPromo\Core\PostTypes;

use CSPromo\Core\Services\StatsService;

class PromoPopups {

	const POST_PER_PAGE = 10;
	const POST_TYPE     = 'cs-promo-popups';

	/**
	 * Get all the popups for the API
	 *
	 * @return array
	 */
	public static function apiGet() {
		$args = array(
			'post_type'    => self::POST_TYPE,
			'numberposts'  => -1,
			'orderby'      => 'title',
			'order'        => 'ASC',
			'meta_key'     => 'popup_type',
			'meta_value'   => 'inline-promotion-bar',
			'meta_compare' => '!=',
		);

		return self::format( get_posts( $args ), true );
	}

	public static function apiGetStatusCampaign( $id ) {
		return self::get( $id, true );
	}

	/**
	 * Get all the popups
	 *
	 * @return array
	 */
	public static function all() {
		$args = array(
			'post_type'   => self::POST_TYPE,
			'numberposts' => self::POST_PER_PAGE,
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			'offset'      => isset( $_GET['paged'] ) ? ( intval( $_GET['paged'] ) - 1 ) * self::POST_PER_PAGE : 0,
			'orderby'     => 'date',
			'order'       => 'DESC',
		);

		return self::format( get_posts( $args ) );
	}

	/**
	 * Get all the popups
	 *
	 * @return array
	 */
	public static function getRaw() {
		$args = array(
			'post_type'   => self::POST_TYPE,
			'numberposts' => -1,
			'orderby'     => 'title',
			'order'       => 'ASC',
			'post_status' => 'publish',
		);

		return get_posts( $args );
	}

	/**
	 * Get the popup slug
	 *
	 * @return void
	 */
	public static function getSlug() {
		return self::POST_TYPE;
	}

	/**
	 * Get a popup setting group
	 *
	 * @param  mixed $meta_name
	 * @param  mixed $post_id
	 * @return array
	 */
	public static function getSetting( $meta_name, $post_id ) {
		return get_post_meta( $post_id, $meta_name, true );
	}

	/**
	 * Save a popup setting
	 *
	 * @param  mixed $post_id
	 * @param  mixed $meta_name
	 * @param  mixed $meta_value
	 * @return boolean
	 */
	public static function saveSetting( $post_id, $meta_name, $meta_value ) {
		return update_post_meta( $post_id, $meta_name, $meta_value );
	}

	/**
	 * Format the response array for a popup list
	 *
	 * @param  mixed $posts
	 * @return array
	 */
	public static function format( $posts, $api = false ) {
		$records = array();
		if ( ! $posts ) {
			return array();
		}

		global $post;
		foreach ( $posts as $post ) {
			$records[] = $api === true ? self::formatSingleAPI( $post ) : self::formatSingle( $post );
		}

		wp_reset_postdata();

		return $records;
	}

	/**
	 * Format a single popup response
	 *
	 * @param  mixed $post
	 * @return array
	 */
	public static function formatSingle( $post ) {
		setup_postdata( $post );

		$url             = iconvertpr_registry_get( 'settings_page_url', '' );
		$editURL         = iconvertpr_registry_get( 'popup_page_edit_url', '' );
		$postURL         = admin_url( 'admin-post.php' );
		$hasPromoContent = self::getSetting( '_has_promo_content', get_the_ID() );

		$editorUrl = add_query_arg(
			array(
				'postId'   => get_the_ID(),
				'page'     => 'iconvertpr-editor',
				'postType' => 'cs-promo-popups',
			),
			admin_url( 'admin.php' )
		);

		$editorTemplateUrl = iconvertpr_generate_page_url( 'templates', array( 'post_id' => get_the_ID() ) );

		if ( $hasPromoContent === 'yes' ) {
			$edit = $editorUrl;
		} else {
			$edit = $editorTemplateUrl;
		}

		$statsService      = new StatsService();
		$displayConditions = self::getSetting( 'display_conditions', get_the_ID() );
		$popupType         = self::getSetting( 'popup_type', get_the_ID() );

		return array(
			'id'                 => get_the_ID(),
			'title'              => get_the_title(),
			'content'            => get_the_content(),
			'datetime'           => get_the_date() . ' @ ' . get_the_time(),
			'type'               => PromoPopupsSettings::getType( $popupType ),
			'popup_type'         => $popupType,
			'has_promo_content'  => $hasPromoContent,
			'stats'              => $statsService->getBasicStats( get_the_ID() ),
			'active'             => self::getSetting( 'active', get_the_ID() ),
			'display_conditions' => $displayConditions,
			'triggers'           => self::getSetting( 'triggers', get_the_ID() ),
			'urls'               => array(
				'delete'            => add_query_arg(
					array(
						'_wpnonce' => wp_create_nonce( 'delete_popup' ),
						'action'   => 'delete_popup',
						'post_id'  => get_the_ID(),
					),
					$postURL
				),
				'settings'          => add_query_arg( array( 'selected_popup' => get_the_ID() ), $url ),
				'edit'              => add_query_arg( array( 'post_id' => get_the_ID() ), $editURL ),
				'editor'            => $edit,
				'editorTemplateUrl' => $editorTemplateUrl,
				'editorUrl'         => $editorUrl,
				'previewUrl'        => self::getPreviewURL( $post, $popupType ),
				'status'            => add_query_arg(
					array(
						'_wpnonce' => wp_create_nonce( 'status_popup' ),
						'action'   => 'status_popup',
						'post_id'  => get_the_ID(),
					),
					$postURL
				),
			),
		);
	}

	/**
	 * getPreviewURL
	 *
	 * @param  mixed $post
	 * @param  mixed $displayConditions
	 * @return string
	 */
	public static function getPreviewURL( $post, $popupType ) {
		$url   = '';
		$query = array(
			'__iconvert-promoter-preview' => $post->ID,
		);

		$kubioPreviewUrl    = call_user_func( ICONVERTPR_KUBIO_NS . '\Core\Utils::getKubioUrlWithRestPrefix', 'kubio-preview' );
		$kubioPreviewRandom = call_user_func( ICONVERTPR_KUBIO_NS . '\Core\Utils::getKubioUrlWithRestPrefix', 'kubio-random' );

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$query['iconvert-promoter-preview'] = isset( $_GET[ $kubioPreviewUrl ] ) ? trim( $_GET[ $kubioPreviewUrl ] ) : '';
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$query['iconvert-promoter-random'] = isset( $_GET[ $kubioPreviewRandom ] ) ? trim( $_GET[ $kubioPreviewRandom ] ) : '';

		if ( $popupType !== 'inline-promotion-bar' ) {
			$url = site_url();
		} else {
			$url = get_permalink( $post->ID );
		}

		return add_query_arg( $query, $url );
	}

	/**
	 * Get the permalink of the first specific post/page or return the homepage url
	 *
	 * @param  array $pages
	 * @return string
	 */
	public static function maybeGetPermalink( $pages ) {
		if ( isset( $pages[1] ) && is_array( $pages[1] ) ) {
			return get_permalink( $pages[1][0] );
		}

		return site_url();
	}

	/**
	 * Finds a random post. If no posts are available, the site url is returned
	 *
	 * @return string
	 */
	public static function findRandomPost() {
		$args = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'orderby'        => 'rand',
		);

		// It's time! Go someplace random
		$randomPost = new \WP_Query( $args );

		while ( $randomPost->have_posts() ) {
			return get_permalink( $randomPost->posts[0]->ID );
		}

		return site_url();
	}

	/**
	 * Format a single popup response
	 *
	 * @param  mixed $post
	 * @return array
	 */
	public static function formatSingleAPI( $post ) {
		setup_postdata( $post );

		$triggers = self::getSetting( 'triggers', get_the_ID() );
		$manual   = 0;

		if ( isset( $triggers['manually-open'] ) && filter_var( $triggers['manually-open']['checkbox'], FILTER_VALIDATE_BOOLEAN ) === true ) {
			$manual = 1;
		}

		return array(
			'id'       => get_the_ID(),
			'title'    => $post->post_title,
			'datetime' => get_the_date() . ' @ ' . get_the_time(),
			'type'     => PromoPopupsSettings::getType( self::getSetting( 'popup_type', get_the_ID() ) ),
			'active'   => self::getSetting( 'active', get_the_ID() ),
			// 'triggers' => $triggers,
			'manual'   => $manual,
		);
	}

	/**
	 * Get a single popup
	 *
	 * @param  integer $post_id
	 * @return mixed
	 */
	public static function get( $post_id, $api = false ) {
		global $post;
		$post = get_post( $post_id );

		if ( $post ) {
			// $postData = self::formatSingle($post);
			$postData = $api === true ? self::formatSingleAPI( $post ) : self::formatSingle( $post );
			wp_reset_postdata();
			return $postData;
		}

		return false;
	}
}
