<?php
namespace CSPromo\Core\Frontend\PopupGenerate;

use IlluminateAgnostic\Arr\Support\Arr;
use KPromo\Core\StyleManager\StyleManager;
use KPromo\Core\Utils as CoreUtils;

class PopupGenerator {

	const CACHE_META_KEY = '_icpromo_popup_render_cache';

	public $id;

	public $extras = array();

	public function __construct( $id ) {
		$this->id = $id;
	}


	public function render() {

		if ( function_exists( 'materialis_gutenberg_keep_comment_before' ) ) {
			remove_filter( 'the_content', 'materialis_gutenberg_keep_comment_before', 5 );
			remove_filter( 'the_content', 'materialis_gutenberg_keep_comment_after', 6 );
		}

		add_filter( 'wp_content_img_tag', array( $this, 'filter_image_tag' ) );
		add_filter( 'wp_get_attachment_image_attributes', array( $this, 'filter_image_attributes' ) );

		if ( function_exists( 'materialis_gutenberg_keep_comment_before' ) ) {
			add_filter( 'the_content', 'materialis_gutenberg_keep_comment_before', 5 );
			add_filter( 'the_content', 'materialis_gutenberg_keep_comment_after', is_customize_preview() ? 20 : 6 );
		}

		$rendered = $this->render_content();

		remove_filter( 'wp_content_img_tag', array( $this, 'filter_image_tag' ) );
		remove_filter( 'wp_get_attachment_image_attributes', array( $this, 'filter_image_attributes' ) );

		return $rendered;
	}


	public function local_style_prefix() {
		return 'style-' . $this->id . '-';
	}

	public function add_extras( $block_content, $block ) {

		switch ( $block['blockName'] ) {
			case 'cspromo/subscribe':
				$form_id                 = Arr::get( $block['attrs'], 'formId', 1 );
				$this->extras['forms']   = isset( $this->extras['forms'] ) ? $this->extras['forms'] : array();
				$this->extras['forms'][] = $form_id;
				break;
		}

		return $block_content;
	}

	private function render_content() {

		$loaded = PopupGenerator::loadCachedForPosts( array( $this->id ) );

		$cached = isset( $loaded[ $this->id ] ) ? $loaded[ $this->id ] : false;

		$style   = '';
		$content = '';
		$fonts   = array();

		if ( $cached && ! $this->can_cache( $cached['content'] ) ) {
			$cached = false;
		}

		if ( $cached ) {
			return $cached;
		} else {
			$content = get_post( $this->id )->post_content;
			$fonts   = array();
			add_filter( 'kubio/element-style-class-prefix', array( $this, 'local_style_prefix' ) );
			add_filter( CoreUtils::getStringWithNamespacePrefix( 'kubio/element-style-class-prefix' ), array( $this, 'local_style_prefix' ) );
			add_filter( 'render_block', array( $this, 'add_extras' ), 10, 2 );

			$style = StyleManager::withCustomStyleManager(
				function () use ( &$content, &$fonts ) {
					$content = do_blocks( $content );
					$content = wptexturize( $content );
					$content = convert_smilies( $content );

					// match all font-family in inline styles
					preg_match_all( '/style=["\'][^"\']*font-family:\s*([^;]*)[^"\']*["\']/', $content, $style_matches );
					foreach ( $style_matches[1] as $family ) {
						$family = trim( $family );
						if ( $family ) {
							StyleManager::getInstance()->registerFonts( $family );
						}
					}

					$fonts = StyleManager::getInstance()->getFonts();
				}
			);
			remove_filter( 'kubio/element-style-class-prefix', array( $this, 'local_style_prefix' ) );
			remove_filter( CoreUtils::getStringWithNamespacePrefix( 'kubio/element-style-class-prefix' ), array( $this, 'local_style_prefix' ) );
				remove_filter( 'render_block', array( $this, 'add_extras' ), 10, 2 );

			if ( $this->can_cache( $content ) ) {
				update_post_meta(
					$this->id,
					PopupGenerator::CACHE_META_KEY,
					array(
						'content' => $content,
						'style'   => $style,
						'fonts'   => $fonts,
						'extras'  => $this->extras,
					),
					$cached
				);
			}
		}

		return array(
			'content' => $content,
			'style'   => $style,
			'fonts'   => $fonts,
			'extras'  => $this->extras,
		);
	}

	private function can_cache( $content ) {
		$can_cache = true;

		if ( str_contains( $content, 'cspromo/promoproduct' ) ) {
			$can_cache = false;
		}

		return $can_cache;
	}

	public function filter_image_tag( $image ) {
		$image = str_replace( ' sizes="auto, ', ' sizes="', $image );
		$image = str_replace( ' sizes="auto, ', ' sizes="', $image );
		$image = str_replace( 'loading="lazy"', '', $image );
		$image = str_replace( 'decoding="async"', '', $image );

		return $image;
	}

	public function filter_image_attributes( $attr ) {
		if ( isset( $attr['sizes'] ) ) {
			$attr['sizes'] = preg_replace( '/^auto, /', '', $attr['sizes'] );
		}

		return $attr;
	}

	public static function loadCachedForPosts( $posts = array() ) {

		if ( defined( 'ICONVERTPR_SKIP_POPUP_CACHING' ) && ICONVERTPR_SKIP_POPUP_CACHING ) {
			return array();
		}

		static $popups = array();
		global $wpdb;
		$to_load = array_diff( $posts, array_keys( $popups ) );

		if ( ! empty( $to_load ) ) {
			$to_load = array_filter( $to_load, 'is_numeric' );
			$ids     = implode( ',', array_map( 'intval', $to_load ) );

			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$query = "SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE post_id IN ( {$ids} ) AND meta_key = '" . PopupGenerator::CACHE_META_KEY . "'";

			// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
			$results = $wpdb->get_results( $query, ARRAY_A );
			foreach ( $results as $result ) {
				$popups[ intval( $result['post_id'] ) ] = maybe_unserialize( $result['meta_value'] );
			}
		}

		return $popups;
	}
}
