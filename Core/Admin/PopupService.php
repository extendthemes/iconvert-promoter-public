<?php

namespace CSPromo\Core\Admin;

use CSPromo\Core\PostTypes\PromoPopups;
use CSPromo\Core\PostTypes\PromoPopupsSettings;
use CSPromo\Core\Services\TemplatesService;
use IlluminateAgnostic\Arr\Support\Arr;

use function wp_insert_post;

class PopupService {


	private static $slug = 'cs-promo-popups';

	/**
	 * Get the popup slug
	 *
	 * @return string
	 */
	public static function getSlug() {
		return self::$slug;
	}

	/**
	 * @param array $data
	 *
	 * @return int|WP_Error
	 */
	public static function create( $data, $promoSettings = array() ) {
		$postContent     = '';
		$templateService = new TemplatesService( $promoSettings );

		$template_id = intval( $data['template'] );

		$postContent = '';

		$newPost = array(
			'post_title'   => esc_html( $data['name'] ),
			'post_status'  => 'publish',
			'post_type'    => self::getSlug(),
			'post_content' => $postContent,
			'meta_input'   => array(
				'popup_type'         => esc_attr( $data['type'] ),
				'triggers'           => $data['triggers'],
				'display_conditions' => $data['display_conditions'],
				'_has_promo_content' => 'yes',
			),
		);

		$postID = wp_insert_post( $newPost );

		if ( $postID ) {
			$postContentTemplate  = '';
			$default_content_file = ICONVERTPR_PATH . "/defaults/popup-templates/{$data['type']}.html";

			if ( file_exists( $default_content_file ) ) {
				$postContentTemplate = file_get_contents( $default_content_file );
			}

			if ( intval( $template_id ) !== 0 ) {
				$template            = $templateService->getTemplate( $template_id );
				$postContentTemplate = $template->content;
			}

			$postData = wp_slash(
				array(
					'ID'           => $postID,
					'post_content' => $templateService->importContent( $postContentTemplate, $postID ),
				)
			);

			wp_update_post( $postData );
		}

		return $postID;
	}

	public static function getPopupSettings( $post_id ) {
		$post        = get_post( $post_id );
		$blocks      = parse_blocks( $post->post_content );
		$popup_block = null;

		foreach ( $blocks as $block ) {
			if ( in_array( $block['blockName'], array( 'kubio/promopopup', 'cspromo/promopopup' ), true ) ) {
				$popup_block = $block;
				break;
			}
		}

		$popup_block_attrs = $popup_block ? $popup_block['attrs'] : array();
		$align             = isset( $popup_block_attrs['align'] ) ? $popup_block_attrs['align'] : 'center';
		$align_h           = isset( $popup_block_attrs['alignH'] ) ? $popup_block_attrs['alignH'] : 'center';

		$show_notice         = isset( $popup_block_attrs['showNotice'] ) ? $popup_block_attrs['showNotice'] : array();
		$animation_in_type   = isset( $show_notice['effectActive'] ) ? $show_notice['effectActive'] : '';
		$animation_in_effect = '';

		if ( $animation_in_type && isset( $show_notice[ $animation_in_type ] ) ) {
			$animation_in_effect = $show_notice[ $animation_in_type ];
		}

		$hide_notice          = isset( $popup_block_attrs['hideNotice'] ) ? $popup_block_attrs['hideNotice'] : array();
		$animation_out_type   = isset( $hide_notice['effectActive'] ) ? $hide_notice['effectActive'] : '';
		$animation_out_effect = '';

		if ( $animation_out_type && isset( $hide_notice[ $animation_out_type ] ) ) {
			$animation_out_effect = $hide_notice[ $animation_out_type ];
		}
		// $popup_block_attrs["kubio"]["style"]["descendants"]["container"]["animation"]["duration"]["value"]
		$position_selector = 'position-matrix';
		$position          = $align ? "{$align}#{$align_h}" : null;

		$popup_type = PromoPopups::getSetting( 'popup_type', $post_id );

		switch ( $popup_type ) {
			case 'inline-promotion-bar':
			case 'fullscreen-mat':
				$position_selector = false;
				break;
			case 'floating-bar':
				$position          = $align;
				$position_selector = 'position-toggle';
				break;
		}

		$animation_duration = Arr::get( $popup_block_attrs, 'kubio.style.descendants.container.animation.duration.value', 1 );

		return array(
			'align'             => $align,
			'alignH'            => $align_h,
			'position'          => $position,
			'position_selector' => $position_selector,
			'contentPosition'   => isset( $popup_block_attrs['contentPosition'] ) ? $popup_block_attrs['contentPosition'] : null,
			'animations'        => array(
				'in'  => array(
					'type'     => $animation_in_type,
					'effect'   => $animation_in_effect,
					'composed' => $animation_in_type . '#' . str_replace( 'animate__', '', $animation_in_effect ),
				),
				'out' => array(
					'type'     => $animation_out_type,
					'effect'   => $animation_out_effect,
					'composed' => $animation_out_type . '#' . str_replace( 'animate__', '', $animation_out_effect ),
				),
			),
			'animationDuration' => $animation_duration,
		);
	}

	public static function changeTemplate( $post_id, $template_id ) {
		$popup_settings = static::getPopupSettings( $post_id );
		$popup_type     = PromoPopups::getSetting( 'popup_type', $post_id );

		$promoSettings = array(
			'promoType'       => $popup_type,
			'position'        => $popup_settings['position'],
			'contentPosition' => $popup_settings['contentPosition'],
			'animationIn'     => $popup_settings['animations']['in']['composed'],
			'animationOut'    => $popup_settings['animations']['out']['composed'],
		);

		foreach ( $promoSettings as $key => $value ) {
			if ( $value === null ) {
				unset( $promoSettings[ $key ] );
			}
		}

		$templateService = new TemplatesService( $promoSettings );
		$template        = $templateService->getTemplate( $template_id );

		if ( ! $template ) {
			return false;
		}

		$postData = wp_slash(
			array(
				'ID'           => $post_id,
				'post_content' => $templateService->importContent( $template->content, $post_id, true ),
			)
		);

		return wp_update_post( $postData );
	}

	/**
	 * @param $postId
	 * @param $name
	 * @param $displayConditions
	 * @param $triggers
	 *
	 * @return int|WP_Error
	 * @throws Exception
	 */
	public static function edit( $postId, $name, $displayConditions, $triggers, $settings = array() ) {
		$postData = array(
			'ID'         => $postId,
			'meta_input' => array(
				'triggers'           => $triggers,
				'display_conditions' => $displayConditions,
			),
		);
		if ( strlen( $name ) > 0 ) {
			$postData['post_title'] = $name;
		}

		if ( ! empty( $settings ) ) {
			$post    = get_post( $postId );
			$content = $post->post_content;

			$settings['promoType'] = PromoPopups::getSetting( 'popup_type', $postId );

			$template_service = new TemplatesService( $settings );
			$content          = $template_service->importContent( wp_slash( $content ), $postId, true );

			$postData['post_content'] = wp_slash( $content );
		}

		return wp_update_post( $postData );
	}

	/**
	 * @param int $postId
	 * @param string $campaignName
	 *
	 * @return int $newPostId|WP_Error
	 */
	public static function duplicate( $postId, $campaignName, $duplicate_as = null ) {
		$post          = get_post( $postId );
		$currentUser   = wp_get_current_user();
		$newPostAuthor = $currentUser->ID;

		$original_type = PromoPopups::getSetting( 'popup_type', $postId );
		$duplicate_as  = $duplicate_as ? $duplicate_as : $original_type;

		if ( ! in_array( $duplicate_as, array_keys( PromoPopupsSettings::getTypes() ) ) ) {
			$duplicate_as = $original_type;
		}

		$popup_settings = PopupService::getPopupSettings( $postId );

		if ( isset( $post ) && $post != null ) {
			$args = array(
				'comment_status' => $post->comment_status,
				'ping_status'    => $post->ping_status,
				'post_author'    => $newPostAuthor,
				'post_content'   => $post->post_content,
				'post_excerpt'   => $post->post_excerpt,
				'post_parent'    => $post->post_parent,
				'post_password'  => $post->post_password,
				'post_status'    => 'publish',
				'post_title'     => $campaignName,
				'post_type'      => $post->post_type,
				'to_ping'        => $post->to_ping,
				'menu_order'     => $post->menu_order,
				'meta_input'     => array(
					'popup_type'         => $duplicate_as,
					'triggers'           => PromoPopups::getSetting( 'triggers', $postId ),
					'display_conditions' => PromoPopups::getSetting( 'display_conditions', $postId ),
					'_has_promo_content' => 'yes',
				),
			);

			$newPostId = wp_insert_post( $args );

			if ( $newPostId ) {
				$templateService = new TemplatesService(
					array(
						'promoType'       => $duplicate_as,
						'position'        => $popup_settings['position'],
						'contentPosition' => $popup_settings['contentPosition'],
						'animationIn'     => $popup_settings['animations']['in']['composed'],
						'animationOut'    => $popup_settings['animations']['out']['composed'],
					)
				);
				$newPostContent  = $templateService->importContent( addslashes( $post->post_content ), $newPostId, $duplicate_as !== $original_type );

				$postData = array(
					'ID'           => $newPostId,
					'post_content' => $newPostContent,
				);

				wp_update_post( wp_slash( $postData ) );
			}
		}

		return $newPostId;
	}

	/**
	 * @param $postId
	 * @param $name

	 *
	 * @return int|WP_Error
	 * @throws Exception
	 */
	public static function editTitle( $postId, $title ) {
		$postData = array(
			'ID' => $postId,
		);

		if ( strlen( $title ) > 0 ) {
			$postData['post_title'] = $title;
		}

		return wp_update_post( $postData );
	}

	public static function setTemplate( $template, $popup ) {
		return wp_update_post(
			array(
				'ID'           => $popup,
				'post_content' => $template,
			)
		);
	}
}
