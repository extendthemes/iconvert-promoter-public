<?php
namespace CSPromo\Core\Frontend\PopupGenerate;

use CSPromo\Core\Frontend\PopupGenerate\PopupGenerator;
use CSPromo\Core\Traits\IsSingleton;

class PopupsListGenerator {
	use IsSingleton;

	private $popups = array();

	public function getActivePopups( $with_inline = array() ) {
		$args = array(
			'post_type'           => 'cs-promo-popups',
			'posts_per_page'      => -1,
			'orderby'             => 'menu_order',
			'order'               => 'ASC',
			'meta_query'          => array(
				array(
					'key'     => 'active',
					'value'   => '1',
					'compare' => '=',
				),
				array(
					'key'     => 'popup_type',
					'value'   => 'inline-promotion-bar',
					'compare' => '!=',
				),
			),
			'ignore_sticky_posts' => 1,
			'fields'              => 'ids',
		);

		$popups_posts = get_posts( $args );

		if ( ! empty( $with_inline ) ) {
			$to_append_query = array(
				'post_type'           => 'cs-promo-popups',
				'posts_per_page'      => -1,
				'orderby'             => 'menu_order',
				'order'               => 'ASC',
				'post__in'            => $with_inline,
				'meta_query'          => array(
					array(
						'key'     => 'active',
						'value'   => '1',
						'compare' => '=',
					),
				),
				'ignore_sticky_posts' => 1,
				'fields'              => 'ids',
			);

			$to_append_posts = get_posts( $to_append_query );
			$popups_posts    = array_merge( $popups_posts, $to_append_posts );
		}

		PopupGenerator::loadCachedForPosts( $popups_posts );

		foreach ( $popups_posts as $post ) {
			$this->popups[] = new PopupGenerator( $post );
		}
	}

	public function kubio_get_preview_content( $postID ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$autosave_id = isset( $_GET['iconvert-promoter-preview'] ) ? intval( $_GET['iconvert-promoter-preview'] ) : '';
		$autoSavedID = $this->getAutosaveID( $autosave_id, $postID );
		if ( $autoSavedID > 0 ) {
			$post = get_post( $autoSavedID );

			if ( $post ) {
				return $post->post_content;
			}
		}
		return '';
	}

	public function getAutosaveID( $kubioPreview, $postID ) {
		$previewSaves = $this->kubio_get_changeset_by_uuid( $kubioPreview );
		if ( is_array( $previewSaves ) && array_key_exists( 'autosaves', $previewSaves ) && ! empty( $previewSaves['autosaves'] ) ) {
			foreach ( $previewSaves['autosaves'] as $autosaved_post ) {
				$autosaved_parent = intval( $autosaved_post['parent'] );
				if ( $autosaved_parent === intval( $postID ) ) {
					return $autosaved_post['id'];
				}
			}
		}

		return 0;
	}

	public function kubio_get_changeset_by_uuid( $uuid ) {
		if ( ! empty( $uuid ) ) {

			$cached = wp_cache_get( "{$uuid}-data", call_user_func( ICONVERTPR_KUBIO_NS . '\Core\Utils::getStringWithNamespacePrefix', 'kubio/preview' ) );
			if ( $cached ) {
				return $cached;
			}

			$args = array(
				'name'        => $uuid,
				'post_type'   => 'kubio_changeset',
				'post_status' => array( 'publish', 'draft' ),
			);

			$posts = get_posts( $args );

			if ( ! empty( $posts ) ) {
				/** @var WP_Post $my_posts */
				$changeset = $posts[0];

				$content = json_decode( $changeset->post_content, true );
				wp_cache_set( "{$uuid}-data", $content, call_user_func( ICONVERTPR_KUBIO_NS . '\Core\Utils::getStringWithNamespacePrefix', 'kubio/preview' ) );

				return $content;
			}
		}

		return null;
	}

	/**
	 * Get the popups
	 *
	 * @return PopupGenerator[]
	 */
	public function getPopups() {
		return $this->popups;
	}
}
