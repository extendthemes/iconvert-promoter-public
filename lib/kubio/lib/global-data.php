<?php

namespace KPromo;

use IlluminateAgnostic\Arr\Support\Arr;
use KPromo\Core\StyleManager\GlobalStyleRender;
use KPromo\Core\StyleManager\StyleManager;
use KPromo\Core\Utils;

function kubio_global_data_post_type() {
	return apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/kubio_global_data_post_type' ), 'kubio-globals' );
}

function kubio_global_get_rest_base() {
	return apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/kubio_register_global_data_post_type/rest_base' ), 'kubio/global-data' );
}
/**
 * Registers a Custom Post Type to store the user's origin config.
 */
function kubio_register_global_data_post_type() {
	$rest_base = kubio_global_get_rest_base();
	$args      = array(
		'label'        => __( 'KPromo Globals', 'iconvert-promoter' ),
		'public'       => false,
		'show_ui'      => false,
		'show_in_rest' => true,
		'rewrite'      => false,
		'rest_base'    => $rest_base,
		'capabilities' => array(
			'read'                   => 'edit_theme_options',
			'create_posts'           => 'edit_theme_options',
			'edit_posts'             => 'edit_theme_options',
			'edit_published_posts'   => 'edit_theme_options',
			'delete_published_posts' => 'edit_theme_options',
			'edit_others_posts'      => 'edit_theme_options',
			'delete_others_posts'    => 'edit_theme_options',
		),
		'map_meta_cap' => true,
		'supports'     => array(
			'title',
			'editor',
			'revisions',
		),
	);
	register_post_type( kubio_global_data_post_type(), $args );
	register_post_meta(
		kubio_global_data_post_type(),
		'compiled_css',
		array(
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'string',
			'auth_callback' => function () {
				return current_user_can( 'edit_theme_options' );
			},
		)
	);
}


add_action( 'init', __NAMESPACE__ . '\\kubio_register_global_data_post_type', 8 );


function kubio_add_global_data_edit_capability() {
	$role = get_role( 'editor' );
	$role->add_cap( 'read_' . kubio_global_data_post_type() );
}

add_action( 'admin_init', __NAMESPACE__ . '\\kubio_add_global_data_edit_capability' );



function kubio_global_data_post_id( $create_new = true, $skip_cache = false, $theme = null ) {

	if ( ! $skip_cache && $cached = wp_cache_get( 'id', Utils::getStringWithNamespacePrefix( 'kubio/global_data' ) ) ) {
		return $cached;
	}

	$post_type  = kubio_global_data_post_type();
	$stylesheet = get_stylesheet();

	//for kubio children we don't want to save different global data per theme. So we override the stylesheet with something
	//unique for the plugin
	$stylesheet = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/global-data/stylesheet' ), $stylesheet );

	$query = new \WP_Query(
		array(
			'post_type'     => $post_type,
			'post_status'   => array( 'draft', 'publish' ),
			'no_found_rows' => true,
			'post_per_page' => 1,
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
			'tax_query'     => array(
				array(
					'taxonomy' => 'wp_theme',
					'field'    => 'name',
					'terms'    => $theme ? array( $theme ) : array( $stylesheet ),
				),
			),
		)
	);

	// fallback for current instances - get the post without theme term and set it later
	$set_term = false;
	if ( ! $query->have_posts() && ! $theme ) {
		$set_term = true;
		$query    = new \WP_Query(
			array(
				'post_type'     => $post_type,
				'post_status'   => array( 'draft', 'publish' ),
				'no_found_rows' => true,
				'post_per_page' => 1,
			)
		);
	}

	if ( $query->have_posts() ) {
		$post                      = $query->next_post();
		$kubio_global_post_content = json_decode( $post->post_content, true );
		wp_cache_set( 'data', $kubio_global_post_content, Utils::getStringWithNamespacePrefix( 'kubio/global_data' ) );
		$id = $post->ID;
		if ( $set_term ) {
			wp_set_post_terms( $id, $stylesheet, 'wp_theme' );
		}
	} else {

		if ( $create_new ) {
			$content = kubio_get_initial_global_data_content();
			$id      = wp_insert_post(
				array(
					'post_content' => json_encode( $content, true ), // remove the pretty prints
					'post_status'  => 'publish',
					'post_type'    => $post_type,
					'post_name'    => $post_type,
					'post_title'   => __( 'KPromo Globals', 'iconvert-promoter' ),
					'tax_input'    => array(
						'wp_theme' => array( $stylesheet ),
					),
				),
				true
			);
		} else {
			return null;
		}
	}

	if ( kubio_is_page_preview() ) {
		$autosaved_posts = kubio_get_current_changeset_data( 'autosaves', array() );

		foreach ( $autosaved_posts as $autosaved_post ) {
			$autosaved_parent = intval( Arr::get( $autosaved_post, 'parent', 0 ) );
			if ( $autosaved_parent === intval( $id ) ) {
				return $autosaved_post['id'];
			}
		}
	}

	if ( ! $skip_cache ) {
		wp_cache_set( 'id', $id, Utils::getStringWithNamespacePrefix( 'kubio/global_data' ) );
	}
	return $id;
}

function kubio_get_global_data_content( $redo_cache = false ) {

	$id = kubio_global_data_post_id();

	if ( ! $redo_cache && $cached = wp_cache_get( 'data', Utils::getStringWithNamespacePrefix( "kubio/global_data/{$id}" ) ) ) {
		return $cached;
	}

	$post                      = get_post( $id );
	$kubio_global_post_content = json_decode( $post->post_content, true );
	wp_cache_set( 'data', $kubio_global_post_content, Utils::getStringWithNamespacePrefix( "kubio/global_data/{$id}" ) );

	return $kubio_global_post_content;
}

function kubio_get_theme_global_data_content( $theme ) {
	$id   = kubio_global_data_post_id( false, true, $theme );
	$post = get_post( $id );

	if ( is_wp_error( $post ) ) {
		return null;
	}

	return json_decode( $post->post_content, true );
}

function kubio_has_global_data( $theme = null ) {
	$id = kubio_global_data_post_id( false, true, $theme );

	return ! ! $id;
}

function kubio_get_global_data( $path, $fallback = null ) {
	$data = kubio_get_global_data_content();

	return Arr::get( $data, $path, $fallback );
}

function kubio_global_data_add_if_not_exists( $data, $theme = null ) {

	$id = kubio_global_data_post_id( false, true, $theme );

	$current_post = get_post( $id );
	if ( $current_post ) {
		return;
	}

	kubio_replace_global_data_content( $data, $theme );
}


function kubio_replace_global_data_content( $data, $theme = null ) {

	if ( ! is_string( $data ) ) {
		$data = wp_slash( json_encode( $data ) );
	}

	$id = kubio_global_data_post_id( true, true, $theme );
	return wp_update_post(
		array(
			'ID'           => $id,
			'post_content' => $data,
		)
	);
}

function kubio_set_global_data( $path, $value ) {
	$data = kubio_get_global_data_content();
	Arr::set( $data, $path, $value );

	wp_cache_set( 'data', $data, Utils::getStringWithNamespacePrefix( 'kubio/global_data' ) );
	kubio_replace_global_data_content( $data );
}

function kubio_get_initial_global_data_content() {
	$content = file_get_contents( __DIR__ . '/../defaults/global-data.json' );
	$content = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/global-data/default_content' ), $content );
	return json_decode( $content, true );
}

function kubio_edit_global_styles_editor_settings( $settings ) {

	//the hook is not prefixed so we must be in the correct editor page before we change settings
	if ( ! kubio_is_kubio_editor_page() ) {
		return $settings;
	}

	$settings['kubioGlobalStyleEntityType']      = kubio_global_data_post_type();
	$settings['kubioGlobalStyleEntityId']        = kubio_global_data_post_id();
	$settings['kubioGlobalStyleDefaults']        = kubio_get_global_data_content();
	$settings['kubioInitialGlobalStyleDefaults'] = kubio_get_initial_global_data_content();

	return $settings;
}

function kubio_on_global_data_post_update( $data ) {

	if ( $data['post_type'] !== kubio_global_data_post_type() ) {
		return $data;
	}

	if ( $data['post_status'] !== 'publish' ) {
		return $data;
	}

	$content           = json_decode( wp_unslash( $data['post_content'] ), true );
	$locations         = Arr::get( $content, 'menuLocations', array() );
	$current_locations = get_theme_mod( 'nav_menu_locations', array() );

	$should_update_locations = false;
	foreach ( $locations as $location ) {
		$location_name = Arr::get( $location, 'name' );
		$location_menu = Arr::get( $location, 'menu' );

		if ( $location_menu && intval( $current_locations[ $location_name ] ) !== intval( $location_menu ) ) {
			$should_update_locations             = true;
			$current_locations[ $location_name ] = $location_menu;
		}
	}

	if ( $should_update_locations ) {
		set_theme_mod( 'nav_menu_locations', $current_locations );
	}

	Arr::forget( $content, 'menuLocations' );
	$data['post_content'] = wp_slash( json_encode( $content ) );

	$settings = Arr::get( $content, '_settings', array() );

	Flags::setSettings(
		array_replace_recursive(
			Flags::getSettings(),
			$settings
		)
	);

	Arr::forget( $content, '_settings' );

	return $data;
}

add_filter(
	'wp_insert_post_data',
	__NAMESPACE__ . '\\kubio_on_global_data_post_update',
	10,
	1
);

add_filter( 'block_editor_settings_all', __NAMESPACE__ . '\\kubio_edit_global_styles_editor_settings' );

function kubio_register_global_style() {
	$styles = kubio_get_global_data_content();
	$styles = Arr::get( $styles, 'globalStyle', array() );

	$prefixSelectorsByType = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/kubio_register_global_style/prefixSelectorsByType' ), null );
	$styleRenderer         = new GlobalStyleRender( $styles, $prefixSelectorsByType );
	$globalStyle           = $styleRenderer->export();

	StyleManager::getInstance()->registerBlockStyle( $globalStyle );
}

function kubio_render_global_colors() {
	$styles               = kubio_get_global_data_content();
	list($color_palette,) = (array) get_theme_support( 'editor-color-palette' );
	$color_palette        = Arr::get( $styles, 'colors', $color_palette );

	$vars          = array();
	$color_palette = is_array( $color_palette ) ? $color_palette : array();
	foreach ( $color_palette as $index => $value ) {
		$vars[] = '--' . $value['slug'] . ':' . implode( ',', $value['color'] );
	}

	$color_palette_variants = Arr::get( $styles, 'colorVariants', $color_palette );
	foreach ( $color_palette_variants as $index => $value ) {
		$vars[] = '--' . $value['slug'] . ':' . implode( ',', $value['color'] );
	}

	$global_colors_selector = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/kubio_render_global_colors/global_colors_selector' ), ':root' );
	$new_line               = Utils::isDebug() ? "\n" : '';
	$css                    = array( "$global_colors_selector {" );
	$css[]                  = implode( ";{$new_line}", $vars );
	$css[]                  = '}';

	$prefixes = array( '.has-', '[data-kubio] .has-' );
	$suffixes = array(
		'-color'            => 'color',
		'-background-color' => 'background-color',
	);

	foreach ( $color_palette as $value ) {
		foreach ( $prefixes as $prefix ) {
			foreach ( $suffixes as $suffix => $property ) {
				$css[] = "{$prefix}{$value['slug']}{$suffix}{{$property}:rgb(var(--{$value['slug']}))}";
			}
		}

		if ( Utils::isDebug() ) {
			$css[] = "\n";
		}
	}

	return implode( Utils::isDebug() ? $new_line : ' ', $css );
}


function kubio_enqueue_google_fonts() {
	$fonts_query = GoogleFontsLocalLoader::getInstance()->getFontsQuery();

	if ( ! $fonts_query ) {
		return;
	}

	$query_args = array(
		'family'  => urlencode( $fonts_query ),
		'display' => 'swap',
	);

	// in preview load remote google fonts to save disk space ( as the content is not yet saved )
	// also load remote fonts if the user chosed not to use local google fonts
	if ( kubio_is_page_preview() || ! Flags::getSetting( 'googleFonts.serveLocally', false ) ) {
		$fonts_url = add_query_arg( $query_args, 'https://fonts.googleapis.com/css' );
		// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		wp_enqueue_style( Utils::getPrefixedScriptName( 'google-fonts' ), $fonts_url, array(), null );
	} else {
		GoogleFontsLocalLoader::enqueuLocalGoogleFonts( $fonts_query );
	}
}


add_filter(
	'rest_prepare_' . kubio_global_data_post_type(),
	function ( $response, $post ) {
		$response->set_data(
			array_merge(
				$response->get_data(),
				array(
					'parsed' => json_decode( $post->post_content ),
				)
			)
		);

		return $response;
	},
	10,
	2
);
