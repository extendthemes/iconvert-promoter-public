<?php

namespace KPromo;

use IlluminateAgnostic\Arr\Support\Arr;
use KPromo\Core\LodashBasic;
use KPromo\Core\Utils;
use KPromo\Flags;

if(! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function kubio_override_script( $scripts, $handle, $src, $deps = array(), $ver = false, $in_footer = false ) {
	$script = $scripts->query( $handle, 'registered' );
	if ( $script ) {

		$script->src  = $src;
		$script->deps = $deps;
		$script->ver  = $ver;
		$script->args = $in_footer;

		unset( $script->extra['group'] );
		if ( $in_footer ) {
			$script->add_data( 'group', 1 );
		}
	} else {
		$scripts->add( $handle, $src, $deps, $ver, $in_footer );
	}

	if ( in_array( 'wp-i18n', $deps, true ) ) {
		$scripts->set_translations( $handle, 'kubio' );
	}
}

function kubio_override_style( $styles, $handle, $src, $deps = array(), $ver = false, $media = 'all' ) {
	$style = $styles->query( $handle, 'registered' );
	if ( $style ) {
		$styles->remove( $handle );
	}
	$styles->add( $handle, $src, $deps, $ver, $media );
}

function kubio_register_kubio_scripts_scripts_dependencies( $version ) {
	$scripts = array(
		array(
			'handle' => 'typed',
			'deps'   => array( 'jquery' ),
			'src'    => 'typed.js',
		),
		array(
			'handle' => 'fancybox',
			'deps'   => array( 'jquery' ),
			'src'    => 'fancybox/jquery.fancybox.min.js',
		),
		
	);

	$script_handles = array();

	foreach ( $scripts as $script ) {
		$handle                    = Utils::getPrefixedScriptName( "scripts-dep-{$script['handle']}" );
		$script_handles[ $handle ] = array(
			$handle,
			kubio_url( "/static/{$script['src']}" ),
			$script['deps'],
			$version,
			true,
		);
	}

	return $script_handles;
}

function kubio_register_frontend_script( $handle ) {
	add_filter(
		Utils::getStringWithNamespacePrefix( 'kubio/frontend/scripts' ),
		function ( $scripts ) use ( $handle ) {

			if ( ! in_array( $handle, $scripts ) ) {
				$scripts[] = $handle;
			}

			return $scripts;
		}
	);
}
function kubio_register_frontend_style( $handle ) {
	add_filter(
		Utils::getStringWithNamespacePrefix( 'kubio/frontend/styles' ),
		function ( $styles ) use ( $handle ) {

			if ( ! in_array( $handle, $styles ) ) {
				$styles[] = $handle;
			}

			return $styles;
		}
	);
}

function kubio_get_frontend_scripts() {
	return apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/frontend/scripts' ), array() );
}

function kubio_enqueue_frontend_styles() {
	$styles = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/frontend/styles' ), array() );
	foreach ( $styles as $handle ) {
		wp_enqueue_style( $handle );
	}
}

function kubio_enqueue_frontend_scripts() {
	$scripts = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/frontend/scripts' ), array() );
	foreach ( $scripts as $handle ) {
		wp_enqueue_script( $handle );
	}
}

function kubio_get_register_packages_options( $options ) {
	$default_options = array(
		'kubio_root_dir' => KUBIO_ROOT_DIR,
		'handle_prefix'  => Utils::getPrefixedScriptName( '', 'kubio-' ),
		'get_plugin_url' => __NAMESPACE__ . '\\kubio_url',
	);
	$mergedOptions   = LodashBasic::merge( $default_options, $options );

	return $mergedOptions;
}

function kubio_register_packages_scripts( $options = array() ) {

	$mergedOptions = kubio_get_register_packages_options( $options );

	$kubio_root_dir = $mergedOptions['kubio_root_dir'];
	$handle_prefix  = $mergedOptions['handle_prefix'];
	$get_plugin_url = $mergedOptions['get_plugin_url'];

	$registered = array();

	$paths = glob( $kubio_root_dir . 'build/*/index.js' );
	foreach ( $paths as $path ) {
		$handle       = $handle_prefix . basename( dirname( $path ) );
		$asset_file   = substr( $path, 0, -3 ) . '.asset.php';
		$asset        = file_exists( $asset_file )
			? require $asset_file
			: null;
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();

		//prefix dependencies that we got from javascript
		foreach ( $dependencies as $key => $dependency ) {
			if ( str_contains( $dependency, 'kubio-' ) ) {
				$dependency_with_kubio = str_replace( 'kubio-', '', $dependency );
				$dependencies[ $key ]  = Utils::getPrefixedScriptName( $dependency_with_kubio );
			}
		}

		if ( Utils::isDebug() ) {
			$version = uniqid( time() . '-' );
		} else {
			$version = isset( $asset['version'] ) ? $asset['version'] : filemtime( $path );
		}

		switch ( $handle ) {
			case Utils::getPrefixedScriptName( 'editor', $handle_prefix ):
				array_push( $dependencies, 'wp-dom-ready', 'editor' );

				if ( kubio_is_kubio_editor_page() ) {
					array_push( $dependencies, Utils::getPrefixedScriptName( 'interface-store' ) );
				}

				break;

			case Utils::getPrefixedScriptName( 'format-library', $handle_prefix ):
				array_push( $dependencies, 'wp-format-library' );
				break;

			case Utils::getPrefixedScriptName( 'scripts', $handle_prefix ):
				$extra_scripts = kubio_register_kubio_scripts_scripts_dependencies( $version );
				$registered    = array_merge( $registered, $extra_scripts );
				$extra_deps    = array_keys( $extra_scripts );
				$dependencies  = array_merge( $dependencies, $extra_deps, array( 'jquery', 'jquery-masonry' ) );
				$dependencies  = array_diff( $dependencies, array( 'wp-polyfill' ) );
				break;

			case Utils::getPrefixedScriptName( 'frontend', $handle_prefix ):
				$dependencies = array( Utils::getPrefixedScriptName( 'scripts' ) );
				kubio_register_frontend_script( Utils::getPrefixedScriptName( 'frontend', $handle_prefix ) );
				break;

			case Utils::getPrefixedScriptName( 'block-library', $handle_prefix ):
				array_push( $dependencies, Utils::getPrefixedScriptName( 'format-library' ) );
				break;

			case Utils::getPrefixedScriptName( 'block-editor', $handle_prefix ):
				if ( wp_script_is( 'wp-private-apis', 'registered' ) ) {
					$dependencies[] = 'wp-private-apis';
				}
				array_push( $dependencies, 'wp-block-editor', 'wp-block-directory' );
				break;
		}

		$kubio_path = substr( $path, strlen( $kubio_root_dir ) );

		$registered[] = array(
			$handle,
			call_user_func( $get_plugin_url, $kubio_path ),
			$dependencies,
			$version,
			true,
		);
	}
	$registered = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/kubio_register_packages_scripts/before_register' ), $registered );

	foreach ( $registered as $script ) {

		if ( is_array( $script ) && count( $script ) >= 2 ) {
			$handle = $script[0];
			$deps   = $script[2];
			if ( in_array( 'wp-i18n', $deps, true ) ) {
				wp_set_script_translations( $handle, 'kubio' );
			}

			call_user_func_array( 'wp_register_script', $script );
			do_action( Utils::getStringWithNamespacePrefix( 'kubio_registered_script' ), $script[0], $script[3] );
		}
	}

	do_action( Utils::getStringWithNamespacePrefix( 'kubio_scripts_registered' ), $registered );
}


function kubio_replace_default_scripts( $scripts ) {

	if ( ! kubio_is_kubio_editor_page() ) {
		return;
	}

	$to_replace = array(
		'wp-block-editor' => 'block-editor',
	);

	foreach ( $to_replace as $old => $new ) {
		$script_path = KUBIO_ROOT_DIR . "/build/{$new}/index.js";
		$asset_file  = KUBIO_ROOT_DIR . "/build/{$new}/index.asset.php";

		$asset        = file_exists( $asset_file )
			? require $asset_file
			: null;
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();
		$version      = isset( $asset['version'] ) ? $asset['version'] : filemtime( $script_path );

		//prefix dependencies that we got from javascript
		foreach ( $dependencies as $key => $dependency ) {
			if ( str_contains( $dependency, 'kubio-' ) ) {
				$dependency_with_kubio = str_replace( 'kubio-', '', $dependency );
				$dependencies[ $key ]  = Utils::getPrefixedScriptName( $dependency_with_kubio );
			}
		}

		kubio_override_script(
			$scripts,
			$old,
			kubio_url( "/build/{$new}/index.js" ),
			$dependencies,
			$version,
			true
		);
	}
}


function kubio_register_kubio_block_library__style_dependencies( $version ) {
	$styles = array(
		array(
			'handle' => 'fancybox',
			'src'    => 'fancybox/jquery.fancybox.min.css',
		),
	);

	$handles = array();

	foreach ( $styles as $style ) {
		$handle             = "kubio-block-library-dep-{$style['handle']}";
		$handles[ $handle ] = array(
			$handle,
			kubio_url( "/static/{$style['src']}" ),
			isset( $style['deps'] ) ? $style['deps'] : array(),
			$version,
		);
	}

	return $handles;
}


function kubio_register_packages_styles( $options = array() ) {

	$mergedOptions = kubio_get_register_packages_options( $options );

	$kubio_root_dir = $mergedOptions['kubio_root_dir'];
	$handle_prefix  = $mergedOptions['handle_prefix'];
	$get_plugin_url = $mergedOptions['get_plugin_url'];

	$registered = array();

	foreach ( glob( $kubio_root_dir . 'build/*/style.css' ) as $path ) {
		$handle       = $handle_prefix . basename( dirname( $path ) );
		$kubio_path   = substr( $path, strlen( $kubio_root_dir ) );
		$version      = filemtime( $path );
		$dependencies = array();

		switch ( $handle ) {
			case Utils::getPrefixedScriptName( 'editor', $handle_prefix ):
				$dependencies = array( 'wp-edit-blocks' );
				break;

			case Utils::getPrefixedScriptName( 'format-library', $handle_prefix ):
				array_push( $dependencies, 'wp-format-library' );
				break;

			case Utils::getPrefixedScriptName( 'admin-panel', $handle_prefix ):
				array_push( $dependencies, Utils::getPrefixedScriptName( 'utils' ) );
				break;

			case Utils::getPrefixedScriptName( 'block-library', $handle_prefix ):
				$extra_styles = kubio_register_kubio_block_library__style_dependencies( $version );
				$registered   = array_merge( $registered, $extra_styles );
				$extra_deps   = array_keys( $extra_styles );
				$dependencies = array_merge( $dependencies, $extra_deps, array( 'wp-block-library' ) );
				break;
		}

		$registered[] = array(
			$handle,
			call_user_func( $get_plugin_url, $kubio_path ),
			$dependencies,
			$version,
		);
	}

	foreach ( glob( $kubio_root_dir . 'build/*/editor.css' ) as $path ) {
		$handle       = $handle_prefix . basename( dirname( $path ) );
		$kubio_path   = substr( $path, strlen( $kubio_root_dir ) );
		$version      = filemtime( $path );
		$dependencies = array();

		switch ( $handle ) {
			case Utils::getPrefixedScriptName( 'editor', $handle_prefix ):
				$dependencies = array( 'wp-edit-blocks' );
				break;

			case Utils::getPrefixedScriptName( 'block-library', $handle_prefix ):
				$dependencies = array( /* 'wp-block-library' */ );
				break;
		}

		$registered[] = array(
			"{$handle}-editor",
			call_user_func( $get_plugin_url, $kubio_path ),
			$dependencies,
			$version,
		);
	}
	$registered = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/kubio_register_packages_styles/before_register' ), $registered );
	foreach ( $registered as $style ) {

		if ( is_array( $style ) && count( $style ) >= 2 ) {

			call_user_func_array( 'wp_register_style', $style );
		}
	}
}


function kubio_replace_default_styles( $styles ) {

	if ( ! kubio_is_kubio_editor_page() ) {
		return;
	}

	// Editor Styles .
	kubio_override_style(
		$styles,
		'wp-block-editor',
		kubio_url( 'build/block-editor/style.css' ),
		array( 'wp-components', 'wp-editor-font' ),
		filemtime( KUBIO_ROOT_DIR . 'build/editor/style.css' )
	);
	$styles->add_data( 'wp-block-editor', 'rtl', 'replace' );
}

add_action( 'init', __NAMESPACE__ . '\\kubio_register_packages_scripts' );
add_action( 'init', __NAMESPACE__ . '\\kubio_register_packages_styles' );

add_action( 'wp_default_styles', __NAMESPACE__ . '\\kubio_replace_default_styles' );
add_action( 'wp_default_scripts', __NAMESPACE__ . '\\kubio_replace_default_scripts' );


add_action(
	Utils::getStringWithNamespacePrefix( 'kubio_registered_script' ),
	function ( $handle, $version ) {

		if (
			$handle === Utils::getPrefixedScriptName( 'utils' ) ||
			$handle === Utils::getPrefixedScriptName( 'admin-panel' ) ||
			$handle === Utils::getPrefixedScriptName( 'constants' )
		) {

			global $wp_version;

			$kubio_block_prefix = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/kubio_block_prefix' ), 'kubio' );
			$dataArray          = array(

				'defaultAssetsURL'        => kubio_url( 'static/default-assets' ),
				'staticAssetsURL'         => kubio_url( 'static' ),
				'patternsAssetsUrl'       => kubio_url( 'static/patterns' ),
				'kubioRemoteContentFile'  => 'https://static-assets.kubiobuilder.com/content-2022-05-17.json',
				'kubioLocalContentFile'   => kubio_url( 'static/patterns/content-converted.json' ),
				'kubioEditorURL'          => add_query_arg(
					'page',
					'kubio',
					admin_url( 'admin.php' )
				),
				'patternsOnTheFly'        => ( defined( 'KUBIO_PATTERNS_ON_THE_FLY' ) && KUBIO_PATTERNS_ON_THE_FLY )
					? KUBIO_PATTERNS_ON_THE_FLY
					: '',
				'base_url'                => site_url(),
				'admin_url'               => admin_url(),
				'kubioNamespacePrefix'    => Utils::getNamespaceIdentifier(),
				'kubioBlockPrefix'        => $kubio_block_prefix,
				'admin_plugins_url'       => admin_url( 'plugins.php' ),
				'last_imported_starter'   => Flags::get( 'last_imported_starter' ),

				//this is needed for kubio children. The blocks in block library need to be loaded after the editor
				//has loaded. But this is only needed for kubio children for kubio we don't need a hook
				'kubioLoadBlocksWithHook' => false,
				'enable_starter_sites'    => apply_filters( 'kubio/starter-sites/enabled', true ),
				'wpVersion'               => preg_replace( '/([0-9]+).([0-9]+).*/', '$1.$2', $wp_version ),

				'wooIsActive'             => class_exists( 'WooCommerce' ),
			);

			$dataArray = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/kubioUtilsData' ), $dataArray );

			$data = 'window.kubioUtilsData=' . wp_json_encode(
				array_merge(
					kubio_get_site_urls(),
					$dataArray
				)
			);

			wp_add_inline_script( $handle, $data, 'before' );
		}

		if ( $handle === Utils::getPrefixedScriptName( 'style-manager' ) ) {

			$url = add_query_arg(
				array(
					'action' => Utils::getKubioUrlWithRestPrefix( 'kubio_style_manager_web_worker' ),
					'v'      => Utils::isDebug() ? time() : KUBIO_VERSION,
				),
				admin_url( 'admin-ajax.php' )
			);

			wp_add_inline_script(
				$handle,
				'var _kubioStyleManagerWorkerURL=' . wp_json_encode( $url ),
				'before'
			);
		}
	},
	10,
	2
);

function kubio_print_style_manager_web_worker() {
	header( 'content-type: application/javascript' );

	$script = '';
	$done   = wp_scripts()->done;
	ob_start();
	wp_scripts()->done = array( 'wp-inert-polyfill', 'wp-polyfill' );
	wp_scripts()->do_items( Utils::getPrefixedScriptName( 'style-manager' ) );
	wp_scripts()->done = $done;
	$script            = ob_get_clean();

	$script = preg_replace_callback(
		'#<script(.*?)>(.*?)</script>#s',
		function ( $matches ) {
			$script_attrs = Arr::get( $matches, 1, '' );
			preg_match( "#src=(\"|')(.*?)(\"|')#", $script_attrs, $attrs_match );
			$url     = Arr::get( $attrs_match, 2, '' );
			$content = trim( Arr::get( $matches, 2, '' ) );

			$result = array();

			if ( ! empty( $url ) ) {
				$result[] = sprintf( "importScripts('%s');", $url );
			}

			if ( ! empty( $content ) ) {
				$result[] = $content;
			}

			return trim( implode( "\n", $result ) ) . "\n\n";
		},
		$script
	);

	$content = file_get_contents( KUBIO_ROOT_DIR . '/defaults/style-manager-web-worker-template.js' );
	$content = str_replace( '// {{{importScriptsPlaceholder}}}', $script, $content );

	if ( ! Utils::isDebug() ) {
		header( 'Cache-control: public' );
		header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s', time() ) . ' GMT' );
		header( 'Expires: ' . gmdate( 'D, d M Y H:i:s', time() + YEAR_IN_SECONDS ) . ' GMT' );
		header( 'Etag: ' . md5( $content ) );
	}

	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	die( $content );
}

add_action( Utils::getKubioAjaxWithPrefix( 'wp_ajax_kubio_style_manager_web_worker' ), __NAMESPACE__ . '\\kubio_print_style_manager_web_worker' );

// quick test for safari
add_action(
	'admin_init',
	function () {
		$content = '
			window.requestIdleCallback =
				window.requestIdleCallback ||
				function(cb) {
					var start = Date.now();
					return setTimeout(function() {
						cb({
							didTimeout: false,
							timeRemaining: function() {
								return Math.max(0, 50 - (Date.now() - start));
							},
						});
					}, 1);
				};

			window.cancelIdleCallback =
				window.cancelIdleCallback ||
				function(id) {
					clearTimeout(id);
				};
		';

		wp_add_inline_script( 'wp-polyfill', $content, 'after' );
	}
);
