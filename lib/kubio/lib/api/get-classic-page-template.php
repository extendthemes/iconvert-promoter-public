<?php
namespace KPromo;
use KPromo\Core\Utils;
use IlluminateAgnostic\Arr\Support\Arr;

add_filter(
	'template_include',
	function ( $template ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( Arr::has( $_REQUEST, Utils::getKubioUrlWithRestPrefix( '__kubio-classic-page-template-slug' ) ) && Utils::canEdit() ) {
			$slug = str_replace( wp_normalize_path( get_stylesheet_directory() ), '', wp_normalize_path( $template ) );
			$slug = str_replace( wp_normalize_path( get_template_directory() ), '', wp_normalize_path( $slug ) );
			$slug = str_replace( '.php', '', trim( $slug, '/' ) );
			return wp_send_json_success( $slug );
		}

		return $template;
	},
	PHP_INT_MAX
);
