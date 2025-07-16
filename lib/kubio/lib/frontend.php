<?php

namespace KPromo;

use IlluminateAgnostic\Arr\Support\Arr;
use KPromo\Core\Utils;
use KPromo\Core\StyleManager\StyleManager;

function kubio_enqueue_frontend_assets( $with_page_css = true ) {

	kubio_register_frontend_style( Utils::getPrefixedScriptName( 'block-library' ) );

	kubio_enqueue_frontend_scripts();
	kubio_enqueue_frontend_styles();

	$style = array();

	//when we are inside the editor and render the content inside a post or a woo product. We don't want to add a new instance
	//of global colors or aditional css. Because it will overwrite the css from the editor
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	if ( ! Arr::has( $_REQUEST, Utils::getKubioUrlWithRestPrefix( '__kubio-rendered-styles' ) ) ) {
		$style = array(
			// shapes
			defined( 'ICONVERTPR_AJAX_LOAD' ) ? '' : kubio_get_shapes_css(),
			// colors
			defined( 'ICONVERTPR_AJAX_LOAD' ) ? '' : kubio_render_global_colors(),
			// global
			kubio_get_global_data( 'additional_css' ),
		);
	}

	if ( $with_page_css ) {
		//page css
		$style[] = kubio_get_page_css();
	}

	$frontend_block_library_scrip_name = apply_filters(
		Utils::getStringWithNamespacePrefix( 'kubio/kubio_enqueue_frontend_assets/inline_script_name' ),
		Utils::getPrefixedScriptName( 'block-library' )
	);

	wp_add_inline_style( $frontend_block_library_scrip_name, implode( "\n\n", $style ) );
}


function kubio_enqueue_frontend_assets_action() {
	kubio_enqueue_frontend_assets();
}

function kubio_get_page_css() {
	return StyleManager::getInstance()->render();
}

add_filter(
	'style_loader_tag',
	function ( $tag, $handle ) {
		$asynced_styles = array( Utils::getPrefixedScriptName( 'google-fonts' ) );

		if ( in_array( $handle, $asynced_styles, true ) ) {
			if ( strpos( $tag, ' async' ) === false ) {
				$tag = str_replace( '<link', '<link async', $tag );
			}
		}

		return $tag;
	},
	PHP_INT_MAX,
	4
);

require_once __DIR__ . '/polyfills/polyfills.php';
