<?php

namespace KPromo;


use IlluminateAgnostic\Arr\Support\Arr;

function kubio_enable_block_support() {
	add_theme_support( 'block-templates' );

	if ( ! current_theme_supports( 'align-wide' ) ) {
		add_theme_support( 'align-wide' );
	}
}

function kubio_is_kubio_editor_page() {
	global $pagenow;

	$builder_page = 'iconvertpr-editor';

	if ( substr( $pagenow, 0, -4 ) === 'admin' ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$page = Arr::get( $_REQUEST, 'page', false );

		if ( $page === $builder_page ) {
			return true;
		}
	}

	return false;
}

add_filter(
	'kubio/is_kubio_editor_page',
	function ( $is_kubio_page ) {
		global $pagenow;

		$builder_page = 'iconvertpr-editor';

		if ( substr( $pagenow, 0, -4 ) === 'admin' ) {

			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$page = sanitize_text_field( Arr::get( $_REQUEST, 'page', false ) );

			if ( $page === $builder_page ) {
				$is_kubio_page = false;
			}
		}

		return $is_kubio_page;
	},
	1000
);

function kubio_plugin_init() {
	require_once plugin_dir_path( __FILE__ ) . '/load.php';

	add_action( 'after_setup_theme', __NAMESPACE__ . '\\kubio_enable_block_support', 500 );
}

kubio_plugin_init();
