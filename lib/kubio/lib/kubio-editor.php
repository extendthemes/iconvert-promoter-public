<?php

namespace KPromo;

use IlluminateAgnostic\Arr\Support\Arr;
use KPromo\Core\Utils;
use KPromo\Flags;
use KPromo\Core\LodashBasic;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function kubio_edit_site_get_first_post_id( $loaded_id ) {
	if ( ! $loaded_id ) {
		$ids = get_posts(
			array(
				'post_type'      => 'page',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'orderby'        => 'date',
				'order'          => 'ASC',
			)
		);

		if ( ! empty( $ids ) ) {
			$loaded_id = $ids[0];
		}
	}

	if ( ! $loaded_id ) {
		$ids = get_posts(
			array(
				'post_type'      => 'post',
				'posts_per_page' => 1,
				'fields'         => 'ids',
			)
		);

		if ( ! empty( $ids ) ) {
			$loaded_id = $ids[0];
		}
	}
	return $loaded_id;
}
//this should also treat the template parts case. But at the moment you can't preview template parts but if will in the future
//the logic should work the same
function kubio_edit_site_get_template_id( $loaded_id, $postType ) {

	$parts = explode( '//', $loaded_id );
	if ( count( $parts ) !== 2 ) {
		return null;
	}
	$templateName = $parts[1];
	$query        = array(
		'name'           => $templateName,
		'post_type'      => $postType,
		'fields'         => 'ids',
		'post_status'    => 'publish',
		'posts_per_page' => 1,
	);
	$ids          = get_posts( $query );
	$resultPostId = null;
	if ( ! empty( $ids ) ) {
		$resultPostId = $ids[0];
	}
	return $resultPostId;
}
function kubio_edit_site_get_edited_entity() {
	$pag_on_front = intval( get_option( 'page_on_front' ) );

	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$loaded_id = isset( $_GET['postId'] ) ? intval( $_GET['postId'] ) : $pag_on_front;

	// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
	$post_type = isset( $_GET['postType'] ) ? sanitize_text_field( $_GET['postType'] ) : null;

	if ( ! post_type_exists( $post_type ) || ! is_numeric( $loaded_id ) ) {
		return array();
	}

	//when you have latest post set as your home page and you enter the builder without the post id the loaded_id will be 0
	//in this case we'll load the index template
	if ( $loaded_id === 0 ) {
		$themeName       = get_stylesheet();
		$indexTemplateId = strtr( ':theme//index', array( ':theme' => $themeName ) );
		$loaded_id       = $indexTemplateId;
		$post_type       = 'wp_template';
	}

	$templatePostId = null;
	if ( ! ! $loaded_id && ! is_numeric( $loaded_id ) ) {
		$templatePostId = $loaded_id;
		$loaded_id      = kubio_edit_site_get_template_id( $loaded_id, $post_type );
	}
	if ( ! $loaded_id || ! is_numeric( $loaded_id ) ) {
		$loaded_id = kubio_edit_site_get_first_post_id( $loaded_id );
	}

	if ( $loaded_id ) {
		$entity = get_post( $loaded_id );

		return array(
			'path'    => get_permalink( $loaded_id ),
			'context' => array(
				'postType'  => $entity ? $entity->post_type : '',
				'postId'    => $templatePostId ? $templatePostId : $loaded_id,
				'query'     => '',
				'postTitle' => $entity ? $entity->post_title : '',
				'title'     => $entity ? $entity->post_title : '',
			),
			'slug'    => $entity ? $entity->post_name : '',
			'label'   => $entity ? $entity->post_title : '',
		);
	}

	return array();
}


function kubio_get_patterns_categories() {
	return array(
		array(
			'label' => __( 'Hero accent', 'iconvert-promoter' ),
			'name'  => 'kubio-content/overlappable',
		),

		array(
			'label' => __( 'About', 'iconvert-promoter' ),
			'name'  => 'kubio-content/about',
		),

		array(
			'label' => __( 'Features', 'iconvert-promoter' ),
			'name'  => 'kubio-content/features',
		),

		array(
			'label' => __( 'Content', 'iconvert-promoter' ),
			'name'  => 'kubio-content/content',
		),

		array(
			'label' => __( 'Call to action', 'iconvert-promoter' ),
			'name'  => 'kubio-content/cta',
		),
		array(
			'label' => __( 'Blog', 'iconvert-promoter' ),
			'name'  => 'kubio-content/blog',
		),

		array(
			'label' => __( 'Counters', 'iconvert-promoter' ),
			'name'  => 'kubio-content/counters',
		),

		array(
			'label' => __( 'Portfolio', 'iconvert-promoter' ),
			'name'  => 'kubio-content/portfolio',
		),

		array(
			'label' => __( 'Photo gallery', 'iconvert-promoter' ),
			'name'  => 'kubio-content/photo gallery',
		),

		array(
			'label' => __( 'Testimonials', 'iconvert-promoter' ),
			'name'  => 'kubio-content/testimonials',
		),

		array(
			'label' => __( 'Clients', 'iconvert-promoter' ),
			'name'  => 'kubio-content/clients',
		),

		array(
			'label' => __( 'Team', 'iconvert-promoter' ),
			'name'  => 'kubio-content/team',
		),

		array(
			'label' => __( 'Contact', 'iconvert-promoter' ),
			'name'  => 'kubio-content/contact',
		),

		array(
			'label' => __( 'F.A.Q.', 'iconvert-promoter' ),
			'name'  => 'kubio-content/f.a.q.',
		),

		array(
			'label' => __( 'Pricing', 'iconvert-promoter' ),
			'name'  => 'kubio-content/pricing',
		),
		array(
			'label' => __( 'Inner Headers', 'iconvert-promoter' ),
			'name'  => 'kubio-header/inner headers',
		),

		array(
			'label' => __( 'Headers', 'iconvert-promoter' ),
			'name'  => 'kubio-header/headers',
		),

		array(
			'label' => __( 'Footers', 'iconvert-promoter' ),
			'name'  => 'kubio-footer/footers',
		),
	);
}

function kubio_get_editor_style( $get_css = false, $skipped_handlers = array() ) {
	$style_handles = array(
		'wp-edit-blocks',
		'wp-block-editor',
		'wp-block-library',
		'wp-block-library-theme',
		Utils::getPrefixedScriptName( 'editor' ),
		Utils::getPrefixedScriptName( 'controls' ),
		Utils::getPrefixedScriptName( 'format-library' ),
		Utils::getPrefixedScriptName( 'pro' ),
		Utils::getPrefixedScriptName( 'block-library-editor' ),
		Utils::getPrefixedScriptName( 'third-party-blocks' ),
	);

	foreach ( $skipped_handlers as $index => $handler ) {
		$handler                    = preg_replace( '#(.*?)-inline-css$#', '$1', $handler );
		$handler                    = preg_replace( '#(.*?)-css$#', '$1', $handler );
		$skipped_handlers[ $index ] = $handler;
	}

	$skipped_handlers = array_unique( $skipped_handlers );
	$style_handles    = array_diff( $style_handles, $skipped_handlers );

	$block_registry = \WP_Block_Type_Registry::get_instance();

	foreach ( $block_registry->get_all_registered() as $block_type ) {
		if ( ! empty( $block_type->style ) ) {
			if ( is_array( $block_type->style ) ) {
				$style_handles = array_merge( $style_handles, $block_type->style );
			} else {
				$style_handles[] = $block_type->style;
			}
		}

		if ( ! empty( $block_type->editor_style ) ) {
			if ( is_array( $block_type->editor_style ) ) {
				$style_handles = array_merge( $style_handles, $block_type->editor_style );
			} else {
				$style_handles[] = $block_type->editor_style;
			}
		}
	}

	$style_handles   = Arr::flatten( $style_handles );
	$style_handles   = array_unique( $style_handles );
	$done            = wp_styles()->done;
	$wp_block_inline = array();
	if ( isset( wp_styles()->registered['wp-block-library'] ) ) {
		$wp_block_inline = wp_styles()->registered['wp-block-library']->extra;
	}

	ob_start();
	wp_styles()->done = $skipped_handlers;
	wp_styles()->do_items( $style_handles );

	wp_styles()->done = $done;

	if ( ! empty( $wp_block_inline ) ) {
		wp_styles()->registered['wp-block-library']->extra = $wp_block_inline;
	}

	$style = ob_get_clean();

	if ( $get_css ) {
		$style = preg_replace( "#<link(.*)href='(.*?)'(.*)/>#", '@import url($2);', $style );
		$style = preg_replace( '#<style(.*)>#', '', $style );
		$style = preg_replace( '#</style>#', '', $style );
	}

	return $style;
}

function kubio_get_editor_scripts( $skipped_handlers = array() ) {
	$script_handles = kubio_get_frontend_scripts();

	foreach ( $skipped_handlers as $index => $handler ) {
		$handler                    = preg_replace( '#(.*?)-js-after#', '$1', $handler );
		$handler                    = preg_replace( '#(.*?)-js-before#', '$1', $handler );
		$handler                    = preg_replace( '#(.*?)-js-translations#', '$1', $handler );
		$handler                    = preg_replace( '#(.*?)-js-extra#', '$1', $handler );
		$skipped_handlers[ $index ] = $handler;
	}

	$script = '';
	$done   = wp_scripts()->done;
	ob_start();
	wp_scripts()->done = $skipped_handlers;
	wp_scripts()->do_items( $script_handles );
	wp_scripts()->done = $done;
	$script            = ob_get_clean();

	return $script;
}

function kubio_extend_block_editor_styles_html() {
	$script = kubio_get_editor_scripts();
	$style  = kubio_get_editor_style();
	$script = "<template id='kubio-scripts-template'>{$script}</template>";

	wp_add_inline_script(
		Utils::getPrefixedScriptName( 'editor' ),
		sprintf(
			'window.__kubioEditorStyles = %s;',
			wp_json_encode( array( 'html' => $style . $script ) )
		),
		'before'
	);
}

function kubio_edit_site_get_settings() {
	$max_upload_size = wp_max_upload_size();
	if ( ! $max_upload_size ) {
		$max_upload_size = 0;
	}

	// This filter is documented in wp-admin/includes/media.php.
	// This filter is documented in wp-admin/includes/media.php.
	$image_size_names      = apply_filters(
		'image_size_names_choose',
		array(
			'thumbnail' => __( 'Thumbnail', 'iconvert-promoter' ),
			'medium'    => __( 'Medium', 'iconvert-promoter' ),
			'large'     => __( 'Large', 'iconvert-promoter' ),
			'full'      => __( 'Full Size', 'iconvert-promoter' ),
		)
	);
	$available_image_sizes = array();
	foreach ( $image_size_names as $image_size_slug => $image_size_name ) {
		$available_image_sizes[] = array(
			'slug' => $image_size_slug,
			'name' => $image_size_name,
		);
	}

	// use array_values to ensure that json_encode sees it as array not object
	$styles = array_values(
		array_merge(
			function_exists( 'get_block_editor_theme_styles' ) ? get_block_editor_theme_styles() : array(),
			array(
				array(
					'css'            => kubio_get_editor_style( true ),
					'__unstableType' => 'theme',
				),
			)
		)
	);

	global $current_screen;
	if ( function_exists( '_register_core_block_patterns_and_categories' ) ) {
		_register_core_block_patterns_and_categories();
	}

	if ( function_exists( '_load_remote_block_patterns' ) ) {
		_load_remote_block_patterns();
	}

	if ( function_exists( '_load_remote_featured_patterns' ) ) {
		_load_remote_featured_patterns( $current_screen );
	}

	$settings = array_merge(
		get_default_block_editor_settings(),
		array(
			'alignWide'                            => true, //get_theme_support( 'align-wide' ),
			'siteUrl'                              => site_url( '/' ),
			'postsPerPage'                         => get_option( 'posts_per_page' ),
			// 'defaultTemplateTypes'                 => kubio_get_indexed_default_template_types(),
			'__experimentalBlockPatterns'          => \WP_Block_Patterns_Registry::get_instance()->get_all_registered(),
			'__experimentalBlockPatternCategories' => array_merge(
				\WP_Block_Pattern_Categories_Registry::get_instance()->get_all_registered(),
				kubio_get_patterns_categories()
			),
			'imageSizes'                           => $available_image_sizes,
			'isRTL'                                => is_rtl(),
			'maxUploadFileSize'                    => $max_upload_size,
			'styles'                               => $styles,
		)
	);

	if ( function_exists( 'get_block_editor_settings' ) && class_exists( '\WP_Block_Editor_Context' ) ) {
		$settings = get_block_editor_settings( $settings, new \WP_Block_Editor_Context() );
	}

	if ( function_exists( 'gutenberg_experimental_global_styles_settings' ) ) {
		$settings = gutenberg_experimental_global_styles_settings( $settings );
	}

	$settings['state'] = array(
		'entity' => kubio_edit_site_get_edited_entity(),
	);

	$settings['kubioPrimaryMenuLocation'] = apply_filters(
		Utils::getStringWithNamespacePrefix( 'kubio/primary_menu_location' ),
		'header-menu'
	);

	global $post;
	$settings = apply_filters( 'block_editor_settings_all', $settings, $post );
	$settings = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/block_editor_settings' ), $settings, $post );

	$settings['kubioThemeAssetsUrlBase'] = untrailingslashit( apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/importer/kubio-url-placeholder-replacement' ), '' ) );

	$settings['defaultTemplatePartAreas'] = array();
	$settings['classicThemeTemplates']    = array();
	$settings['themeUri']                 = get_template_directory_uri();
	$scrollableImagePath                  = wp_get_theme()->get_file_path( 'resources/images/front-page-preview.jpg' );
	// Handle the Front page suggestion preview image
	if ( file_exists( $scrollableImagePath ) ) {
		$settings['kubioHasFpsScrollPreview'] = true;  // 'resources/images/front-page-preview.jpg';
	} else {
		$settings['kubioHasFpsScrollPreview'] = false; //'screenshot.jpg';
	}
	$settings['supportsLayout'] = true;
	$layout                     = LodashBasic::get( $settings, '__experimentalFeatures.layout', array() );
	$mergedLayout               = array_merge( array( 'contentSize' => '1172px' ), $layout );
	if ( ! isset( $settings['__experimentalFeatures'] ) ) {
		$settings['__experimentalFeatures'] = array();
	}
	$settings['__experimentalFeatures']['layout'] = $mergedLayout;
	LodashBasic::set( $settings, '__experimentalFeatures.blocks.core/post-content.layout', $mergedLayout );

	return $settings;
}

function kubio_block_editor_general_settings( $settings ) {

	if ( ! kubio_is_kubio_editor_page() ) {
		return $settings;
	}

	$settings['__unstableEnableFullSiteEditingBlocks'] = true;
	$settings['enableFSEBlocks']                       = true;
	$settings['kubioGlobalSettings']                   = (object) Flags::getSettings();

	$settings['kubioLoaded'] = true;
	return $settings;
}

add_filter( 'block_editor_settings_all', __NAMESPACE__ . '\\kubio_block_editor_general_settings', 50 );

function kubio_load_gutenberg_assets() {
	wp_enqueue_style( Utils::getPrefixedScriptName( 'pro' ) );

	wp_enqueue_script( Utils::getPrefixedScriptName( 'block-patterns' ) );
	//wp_enqueue_script(Utils::getPrefixedScriptName('third-party-blocks'));
	wp_localize_script(
		Utils::getPrefixedScriptName( 'block-patterns' ),
		'kubioBlockPatterns',
		array(
			'inGutenbergEditor' => ! kubio_is_kubio_editor_page(),
		)
	);

	wp_add_inline_style( Utils::getPrefixedScriptName( 'block-library' ), kubio_get_shapes_css() );
}

function kubio_get_post_types() {
	$extra_types = get_post_types(
		array(
			'_builtin' => false,
			'public'   => true,
		)
	);

	$types = array();
	global $wp_post_types;

	foreach ( $extra_types as $type ) {
		$types[] = array(
			'entity' => $type,
			'kind'   => 'postType',
			'title'  => $wp_post_types[ $type ]->label,
		);
	}

	return $types;
}

if ( kubio_is_kubio_editor_page() ) {
	Utils::onlyRunOnceForAllKubio( 'enqueue_block_editor_assets', 'kubio_load_gutenberg_assets' );
}

function kubio_navigation_get_menu_items_endpoint(
	$menu_id,
	$results_per_page = 100
) {
	return '/__experimental/menu-items?' .
		build_query(
			array(
				'context'  => 'edit',
				'menus'    => $menu_id,
				'per_page' => $results_per_page,
				'_locale'  => 'user',
			)
		);
}

function kubio_add_endpoint_details(
	$url,
	$results_per_page = null,
	$locale = null
) {
	$vars = array( 'context' => 'edit' );
	if ( $results_per_page !== null ) {
		$vars['per_page'] = $results_per_page;
	}
	if ( $locale !== null ) {
		$vars['_locale'] = 'user';
	}
	return $url . '?' . build_query( $vars );
}

function kubio_edit_site_init() {
	if ( ! kubio_is_kubio_editor_page() ) {
		return;
	}

	add_filter( 'use_block_editor_for_post_type', '__return_true' );

	global $current_screen, $post;
	$current_screen->is_block_editor( true );

	// Inline the Editor Settings
	$settings = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/editor/settings' ), kubio_edit_site_get_settings() );

	$menus         = wp_get_nav_menus();
	$first_menu_id = ! empty( $menus ) ? $menus[0]->term_id : null;

	// Preload block editor paths.
	// most of these are copied from edit-forms-blocks.php.
	$preload_paths = array(
		array( '/wp/v2/media', 'OPTIONS' ),
		// '/',
		// '/?context=edit',
		'/wp/v2/types?context=edit',
		// '/wp/v2/taxonomies?context=edit',
		// '/wp/v2/categories?context=edit',
		// '/wp/v2/categories/1?context=edit',
		// '/wp/v2/tags?context=edit',

		'/wp/v2/settings',

		array( '/wp/v2/pages', 'OPTIONS' ),
		array( '/wp/v2/posts', 'OPTIONS' ),

		// kubio_add_endpoint_details( '/wp/v2/pages', 100 ),
		// kubio_add_endpoint_details( '/wp/v2/posts', 100 ),
		// kubio_add_endpoint_details( '/wp/v2/templates', 100 ),
		// kubio_add_endpoint_details( '/wp/v2/template-parts', 100 ),

		Utils::getKubioUrlWithRestPrefix( '/kubio/v1/contact-form/forms_by_type' ),
		Utils::getKubioUrlWithRestPrefix( '/kubio/v1/subscribe-form/forms_by_type' ),
		Utils::getKubioUrlWithRestPrefix( '/kubio/v1/page-templates/get' ),

		'/__experimental/menus?_locale=user&context=edit&per_page=100',
		'/__experimental/menus?context=edit&per_page=-1',
		'/__experimental/menu-locations?context=edit',

		// kubio_add_endpoint_details( "/wp/v2/template-parts/{$stylesheet}//footer" ),
		// kubio_add_endpoint_details( "/wp/v2/template-parts/{$stylesheet}//front-header" ),
		// kubio_add_endpoint_details( "/wp/v2/templates/{$stylesheet}//front-page" ),

		// '/wp/v2/types/wp_template?context=edit',
		// '/wp/v2/types/wp_template-part?context=edit',
		// '/wp/v2/pages?context=edit',
		// '/wp/v2/posts?context=edit',
		// '/wp/v2/templates?context=edit&per_page=-1',
		// '/wp/v2/template-parts?context=edit&per_page=-1',
		// '/wp/v2/themes?context=edit&status=active',
	);

	$active_global_styles_id = 0;
	$active_theme            = wp_get_theme()->get_stylesheet();

	if ( class_exists( '\WP_Theme_JSON_Resolver' ) && method_exists( \WP_Theme_JSON_Resolver::class, 'get_user_global_styles_post_id' ) ) {
		$active_global_styles_id = \WP_Theme_JSON_Resolver::get_user_global_styles_post_id();
	}

	if ( $active_global_styles_id ) {
		$preload_paths = array_merge(
			$preload_paths,
			array(
				'/wp/v2/global-styles/' . $active_global_styles_id . '?context=edit',
				'/wp/v2/global-styles/' . $active_global_styles_id,
				'/wp/v2/global-styles/themes/' . $active_theme,
			)
		);
	}

	wp_enqueue_media();

	$global_data_rest_base = kubio_global_get_rest_base();
	$preload_paths[]       =
		"/wp/v2/$global_data_rest_base/" .
		kubio_global_data_post_id() .
		'?context=edit';

	// $preload_paths[] = Utils::getKubioUrlWithRestPrefix( '/kubio/v1/menu/' );
	// $preload_paths[] =
	//  '/wp/v2/pages/' . get_option( 'page_on_front' ) . '?context=edit';

	// $preload_paths[] = '/wp/v2/users/1?context=edit';
	// $preload_paths[] = '/wp/v2/comments?context=edit&post=1';

	if ( $first_menu_id ) {
		$preload_paths[] = Utils::getKubioUrlWithRestPrefix( "/kubio/v1/menu/{$first_menu_id}" );
		$preload_paths[] = kubio_navigation_get_menu_items_endpoint(
			$first_menu_id
		);
	}

	$preload_data = array_reduce(
		$preload_paths,
		'rest_preload_api_request',
		array()
	);

	do_action( Utils::getStringWithNamespacePrefix( 'kubio/editor/enqueue_assets_before' ) );

	if ( function_exists( 'block_editor_rest_api_preload' ) ) {
		block_editor_rest_api_preload( $preload_paths, new \WP_Block_Editor_Context() );
	} else {
		wp_add_inline_script(
			'wp-api-fetch',
			sprintf(
				'wp.apiFetch.use( wp.apiFetch.createPreloadingMiddleware( %s ) );',
				wp_json_encode( $preload_data )
			),
			'after'
		);
	}

	wp_add_inline_script(
		'wp-blocks',
		sprintf(
			'wp.blocks.unstable__bootstrapServerSideBlockDefinitions( %s );',
			wp_json_encode( get_block_editor_server_block_settings() )
		),
		'after'
	);

	wp_add_inline_script(
		'wp-blocks',
		sprintf(
			'wp.blocks.setCategories( %s );',
			wp_json_encode( get_block_categories( $post ) )
		),
		'after'
	);

	// Editor default styles
	wp_enqueue_style( 'wp-format-library' );
	wp_enqueue_style( 'wp-block-editor' );

	wp_enqueue_style( Utils::getPrefixedScriptName( 'format-library' ) );
	wp_enqueue_script( Utils::getPrefixedScriptName( 'editor' ) );

	if ( wp_script_is( 'wc-blocks-shared-hocs', 'registered' ) ) {
		global $wp_scripts;
		$block_library_script         = $wp_scripts->registered[ Utils::getPrefixedScriptName( 'block-library' ) ];
		$block_library_script->deps[] = 'wc-blocks-shared-hocs';
	}

	wp_enqueue_script( Utils::getPrefixedScriptName( 'block-library' ) );
	wp_enqueue_style( Utils::getPrefixedScriptName( 'admin-panel' ) );

	wp_enqueue_style( Utils::getPrefixedScriptName( 'editor' ) );
	wp_enqueue_style( Utils::getPrefixedScriptName( 'advanced-panel' ) );
	wp_enqueue_style( Utils::getPrefixedScriptName( 'block-library-editor' ) );
	wp_enqueue_style( Utils::getPrefixedScriptName( 'controls' ) );
	wp_enqueue_style( Utils::getPrefixedScriptName( 'pro' ) );
	wp_enqueue_style( Utils::getPrefixedScriptName( 'scripts' ) );
	wp_enqueue_style( Utils::getPrefixedScriptName( 'wp-global-styles' ) );

	if ( wp_script_is( 'kubio-shop-block-library', 'enqueued' ) ) {
		wp_dequeue_script( 'kubio-shop-block-library' );
	}
	wp_deregister_script( 'kubio-shop-block-library' );

	$settings['postTypes'] = kubio_get_post_types();

	$editor_ready_script_prefix            = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/kubio_edit_site_init/editor_ready_script_prefix' ), 'kubio' );
	$editor_ready_script_entry_point_class = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/kubio_edit_site_init/editor_ready_script_entry_point_class' ), 'kubio-editor' );
	$editor_ready_script                   = sprintf( 'wp.domReady( function() { %s.editor.initialize( "%s", window.kubioEditSiteSettings );	} );', $editor_ready_script_prefix, $editor_ready_script_entry_point_class );
	wp_add_inline_script(
		Utils::getPrefixedScriptName( 'editor' ),
		sprintf(
			'window.kubioEditSiteSettings = %s;' .
				"\n" .
				'%s',
			wp_json_encode( $settings ),
			$editor_ready_script
		),
		'after'
	);

	wp_add_inline_style( Utils::getPrefixedScriptName( 'editor' ), kubio_get_shapes_css() );

	add_action( 'admin_footer', __NAMESPACE__ . '\\kubio_extend_block_editor_styles_html' );
	do_action( 'enqueue_block_editor_assets' );
	do_action( Utils::getStringWithNamespacePrefix( 'kubio/editor/enqueue_assets' ) );

	$editor_styles = function_exists( 'get_editor_stylesheets' ) ? get_editor_stylesheets() : null;
	if (
		current_theme_supports( 'wp-block-styles' ) ||
		( ! is_array( $editor_styles ) || count( $editor_styles ) === 0 )
	) {
		wp_enqueue_style( 'wp-block-library-theme' );
	}
}


add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\kubio_edit_site_init' );

// Add tinymce scripts within the KPromo Editor and WordPress Editor since we need them in blocks like Subscribe form.
// we use the `enqueue_block_editor_assets` action since it is called in both editors.
add_action(
	'enqueue_block_editor_assets',
	function () {
		wp_enqueue_script( 'wp-tinymce' );
		wp_enqueue_editor();
		wp_enqueue_code_editor( array() );
		wp_tinymce_inline_scripts();
	}
);

/**
 * Renders the Menu Page
 *
 * @return void
 */
function kubio_edit_site_render_block_editor( $props = array() ) {
	$editor_entry_point_class = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/kubio_edit_site_render_block_editor/editor_entry_point_class' ), 'kubio-editor' );

	// Add a loader style. loaded it inline so it will be displayed before the editor or other styles are loaded.
	?>
	<div id="kubio-editor" class="kubio <?php echo esc_attr( $editor_entry_point_class ); ?>">
		<div class="kubio-loading-editor">
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped - This is a safe function that returns an iframe HTML element.
			echo kubio_get_iframe_loader( array_merge( array( 'size' => '120px' ), $props ) );
			?>
		</div>
	</div>
	<?php
}

add_action(
	'admin_enqueue_scripts',
	function () {
		global $plugin_page;
		if ( $plugin_page === 'iconvertpr-editor' ) {
			$css = '
			div#wpcontent, #wpbody-content {
				position: fixed;
				z-index: 1000000;
				width: 100vw;
				height: 100vh;
				background: #fff;
				top: 0%;
				left: 0%;
				right: 0;
				border: 0;
				display: block;
				box-sizing: border-box;
			}

			#wp-link-backdrop {
				z-index: 1000050;
			}

			#wp-link-wrap {
				z-index: 1000100;
			}

			.kubio {
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				z-index: 1000;
				width: 100%;
				height: 100%;
				background: #fff;
			}

			.kubio-loading-editor {
				position: absolute;
				top: 50%;
				left: 50%;
				display: block;
				font-size: 1.5em;
				transform: translate(-50%, -50%);
			}

			.kubio-loading-editor iframe {
				margin: 0px auto 0px auto;
			}
			';
			wp_add_inline_style( 'common', $css );
		}
	}
);

function kubio_editor_add_default_template_types( $template_types ) {
	if ( kubio_is_kubio_editor_page() && is_user_logged_in() ) {
		$kubio_templates = array(
			'full-width'       => array(
				'title'       => _x( 'Full Width', 'Template name', 'iconvert-promoter' ),
				'description' => __(
					'Recommended KPromo template to display individual pages. This template works best with the KPromo provided blocks and predesigned sections.',
					'iconvert-promoter'
				),
			),
			'kubio-full-width' => array(
				'title'       => _x( 'KPromo Full Width', 'Template name', 'iconvert-promoter' ),
				'description' => __(
					'Recommended KPromo template to display individual pages. This template works best with the KPromo provided blocks and predesigned sections.',
					'iconvert-promoter'
				),
			),
		);

		foreach ( $kubio_templates as $slug => $settings ) {
			$template_types[ $slug ] = $settings;
		}
	}

	return $template_types;
}

add_filter( 'default_template_types', __NAMESPACE__ . '\\kubio_editor_add_default_template_types' );

add_action(
	'init',
	function () {
		// deregister all kubio blocks to avoid conflicts with the editor
		if ( kubio_is_kubio_editor_page() && is_user_logged_in() ) {
			$registered_blocks = \WP_Block_Type_Registry::get_instance()->get_all_registered();

			foreach ( array_keys( $registered_blocks ) as $block_type ) {
				if ( str_starts_with( $block_type, 'kubio/' ) ) {
					\WP_Block_Type_Registry::get_instance()->unregister( $block_type );
				}
			}
		}
	},
	500
);


function iconvert_deregister_kubio_assets_for_promoter_editor() {
	// deregister the kubio block library script to avoid conflicts with the editor
	// we do this after the kubio/editor/load_gutenberg_assets action is fired
	if ( kubio_is_kubio_editor_page() && is_user_logged_in() ) {
		global $wp_scripts, $wp_styles;

		$prefixes_to_dequeue = array(
			'kubio-',
			'demo-image-hub-',
		);

		foreach ( $wp_scripts->queue as $script_handle ) {
			foreach ( $prefixes_to_dequeue as $prefix ) {
				if ( str_starts_with( $script_handle, $prefix ) ) {
					wp_deregister_script( $script_handle );
					wp_dequeue_script( $script_handle );
				}
			}
		}

		foreach ( $wp_styles->queue as $style_handle ) {
			foreach ( $prefixes_to_dequeue as $prefix ) {
				if ( str_starts_with( $style_handle, $prefix ) ) {
					wp_deregister_style( $style_handle );
					wp_dequeue_style( $style_handle );
				}
			}
		}
	}

	if ( isset( $wp_styles->registered['wp-block-library'] ) ) {
		$wp_block_library_style        = $wp_styles->registered['wp-block-library'];
		$wp_block_library_style->extra = array();
	}
}

add_action(
	'admin_enqueue_scripts',
	__NAMESPACE__ . '\\iconvert_deregister_kubio_assets_for_promoter_editor',
	500
);

add_action(
	'admin_print_footer_scripts',
	__NAMESPACE__ . '\\iconvert_deregister_kubio_assets_for_promoter_editor',
	0
);