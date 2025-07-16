<?php

namespace KPromo;

use IlluminateAgnostic\Arr\Support\Arr;
use KPromo\Core\LodashBasic;
use KPromo\Core\Utils;


add_filter(
	Utils::getStringWithNamespacePrefix( 'kubio/preview/template_part_blocks' ),
	function ( $parts = array() ) {
		return array_merge(
			(array) $parts,
			array(
				'core/template-part',
				'kubio/header',
				'kubio/footer',
				'kubio/sidebar',
			)
		);
	},
	5,
	1
);


function kubio_blocks_update_template_parts_theme( $parsed_blocks, $theme ) {
	$parts_block_names = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/preview/template_part_blocks' ), array() );

	Utils::walkBlocks(
		$parsed_blocks,
		function ( &$block ) use ( $theme, $parts_block_names ) {

			$block_name       = Arr::get( $block, 'blockName' );
			$current_theme    = Arr::get( $block, 'attrs.theme' );
			$is_template_part = in_array( $block_name, $parts_block_names, true );

			if ( $block_name && ( $current_theme || $is_template_part ) ) {
				Arr::set( $block, 'attrs.theme', $theme );
			}
		}
	);

	return $parsed_blocks;
}

//this code is not required for the attributes to work. But it could be a problem in the future if we don't register the
//anchor attribute
function kubio_register_anchor_attribute( $metadata ) {
	$supports_anchor = LodashBasic::get( $metadata, array( 'supports', 'anchor' ), false );
	if ( $supports_anchor ) {
		$has_anchort_attr = LodashBasic::get( $metadata, array( 'attributes', 'anchor' ), false );
		if ( ! $has_anchort_attr ) {
			$data = array(
				'type' => 'string',
			);
			LodashBasic::set( $metadata, array( 'attributes', 'anchor' ), $data );
		}
	}

	return $metadata;
}

add_filter(
	Utils::getStringWithNamespacePrefix( 'kubio/blocks/register_block_type' ),
	__NAMESPACE__ . '\\kubio_register_anchor_attribute'
);

function kubio_add_full_hd_image_size() {
	add_image_size( 'kubio-fullhd', 1920, 1080 );
}

Utils::onlyRunOnceForAllKubio( 'after_setup_theme', 'kubio_add_full_hd_image_size', 'filter' );
add_filter( 'after_setup_theme', __NAMESPACE__ . '\\kubio_add_full_hd_image_size' );

function kubio_url_import_cdn_files( $url ) {

	if ( strpos( $url, 'wp-content/uploads' ) !== false ) {

		if ( \_\startsWith( $url, site_url() ) ) {
			return $url;
		}

		return str_replace( 'https://demos.kubiobuilder.com', 'https://static-assets.kubiobuilder.com/demos', $url );
	}

	return $url;
}

add_filter( Utils::getStringWithNamespacePrefix( 'kubio/importer/kubio-source-url' ), __NAMESPACE__ . '\\kubio_url_import_cdn_files' );



add_filter(
	Utils::getStringWithNamespacePrefix( 'kubio/importer/kubio-url-placeholder-replacement' ),
	function () {
		$stylesheet = get_stylesheet();

		return "https://static-assets.kubiobuilder.com/themes/{$stylesheet}/assets/";
	},
	5
);

add_action(
	'plugins_loaded',
	function () {
		// init the hasEnoughRemainingTime static variable
		Utils::hasEnoughRemainingTime();
	}
);

/**
 * This filter checks the attributes for every imported block and replaces the link values stored on the demo site like
 * `https://support-work.kubiobuilder.com` with the site url.
 *
 * @param $parsed_blocks
 * @param $demo_url
 * @return mixed
 */
function kubio_blocks_update_block_links( $parsed_blocks, $demo_url ) {
	$replace = site_url();

	Utils::walkBlocks(
		$parsed_blocks,
		function ( &$block ) use ( $demo_url, $replace ) {

			$old_url = Arr::get( $block, 'attrs.link.value' );

			if ( $old_url !== null && ! empty( $old_url ) ) {
				$next_url = $old_url;

				if ( strpos( $old_url, 'http://wpsites.' ) === 0 ) {
					// replace internal ( extendstudio links )
					$next_url = preg_replace( '#^http://wpsites\.(.*?)\.(.*?)/(.*?)/(.*?)/([a-zA-Z0-9-]+)#', $replace, $old_url );
				} else {
					$next_url = str_replace( $demo_url, $replace, $old_url );
				}

				if ( $old_url !== $next_url ) {
					Arr::set( $block, 'attrs.link.value', $next_url );
				}
			}
		}
	);

	return $parsed_blocks;
}

//This is added for woocomerce but it fixes a general issue. If the page that we preview is being redirected we need to
//add our flag to the redirected page or the editor will not work.
function kubio_add_flags_to_redirects( $location ) {
	$flags = array(
		'_wp-find-template',
		'__kubio-page-title',
		Utils::getKubioUrlWithRestPrefix( '__kubio-rendered-content' ),
		Utils::getKubioUrlWithRestPrefix( '__kubio-rendered-styles' ),
		Utils::getKubioUrlWithRestPrefix( '__kubio-site-edit-iframe-preview' ),
		Utils::getKubioUrlWithRestPrefix( '__kubio-site-edit-iframe-classic-template' ),
		Utils::getKubioUrlWithRestPrefix( '__kubio-body-class' ),
		Utils::getKubioUrlWithRestPrefix( '__kubio-page-query' ),
	);

	foreach ( $flags as $flag ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET[ $flag ] ) && ! empty( $_GET[ $flag ] ) ) {

			// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
			$location = add_query_arg( $flag, $_GET[ $flag ], $location );
		}
	}

	return $location;
}
add_filter( 'wp_redirect', __NAMESPACE__ . '\\kubio_add_flags_to_redirects' );


require_once __DIR__ . '/filters/dismissable-notice.php';

require_once __DIR__ . '/filters/svg-kses.php';
require_once __DIR__ . '/filters/post-insert.php';
require_once __DIR__ . '/filters/gutenerg-plugin-check.php';
require_once __DIR__ . '/filters/site-urls.php';
