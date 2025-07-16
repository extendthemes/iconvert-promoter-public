<?php

namespace CSPromo\Core\PostTypes;

use CSPromo\Core\Frontend\PopupGenerate\PopupGenerator;

class PromoPopupsSetup {

	public function __construct() {
		add_action( 'init', array( __CLASS__, 'register' ) );
		add_filter( 'wp_link_query_args', array( $this, 'removeFromLinkQuery' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'iconvertPromoTemplatePreviewLoaded' ), 50 );
	}

	public function iconvertPromoTemplatePreviewLoaded() {

		if ( ! iconvertpr_preview_page() ) {
			return;
		}

			$js = "jQuery(function($) {
						const popup = $('[data-cs-promoid]');
						const popupID = popup.data('cs-promoid');
						window.iconvertPromoPopup.promoRemovePopupEvent(popupID,{
							disableEsc: popup.is('.cs-popup-container-type-inline-promotion-bar'),
						});
						setTimeout(function(){
						    const event = new CustomEvent('cs-promo-popups-loaded', {
						        detail: {
						            popupID: popupID,
						        }
						    });
							document.dispatchEvent(event);
							window.iconvertPromoPopup.promoShow(popupID);
						},500);
					});";

			wp_add_inline_script(
				'iconvertpr-popups-main',
				$js
			);
	}

	/**
	 * removeFromLinkQuery
	 *
	 * @param  mixed $query
	 * @return array
	 */
	public function removeFromLinkQuery( $query ) {
		$postTypes = array();

		$exclude = array( PromoPopups::getSlug() );

		foreach ( $query['post_type'] as $pt ) {
			if ( in_array( $pt, $exclude ) ) {
				continue;
			}
			$postTypes[] = $pt;
		}

		$query['post_type'] = $postTypes;

		return $query;
	}


	/**
	 * Register the new post type
	 *
	 * @return void
	 */
	public static function register() {

		$public = false;

		if ( iconvertpr_preview_page() ) {
			$public = true;
		}

		register_post_type(
			PromoPopups::getSlug(),
			array(
				'labels'                => array(
					'name'          => __( 'Popups', 'iconvert-promoter' ),
					'singular_name' => __( 'Popups', 'iconvert-promoter' ),
				),
				'public'                => $public,
				'has_archive'           => false,
				'rewrite'               => array( 'slug' => PromoPopups::getSlug() ),
				'show_in_rest'          => true,
				'show_in_menu'          => false,
				'show_in_nav_menus'     => false,
				'exclude_from_search'   => true,
				'supports'              => array( 'editor', 'custom-fields' ),
				'rest_controller_class' => 'WP_REST_Posts_Controller',
				'map_meta_cap'          => true,
				'show_ui'               => true,
				'hierarchical'          => false,
			)
		);

		add_filter(
			'rest_prepare_' . PromoPopups::getSlug(),
			function ( $response, $post ) {

				$response->data['title'] = array(
					'raw'      => $post->post_title,
					'rendered' => get_the_title( $post->ID ),
				);

				return $response;
			},
			10,
			2
		);

		add_action(
			'save_post_' . PromoPopups::getSlug(),
			function ( $post_id ) {
				delete_post_meta( $post_id, PopupGenerator::CACHE_META_KEY );
			}
		);
	}
}
