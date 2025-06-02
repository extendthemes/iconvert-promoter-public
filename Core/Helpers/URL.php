<?php

if ( ! function_exists( 'cs_generate_page_url_params' ) ) {
	function cs_generate_page_url_params( $route, $args = array(), $namespace = false ) {
		if ( $namespace == false ) {
			$namespace = IC_PROMO_PAGE_ID;
		}
		$urlParams = array(
			'page'  => $namespace,
			'route' => $route,
		);

		if ( ! empty( $args ) ) {
			$urlParams = array_merge( $urlParams, $args );
		}

		return add_query_arg(
			$urlParams,
			''
		);
	}
}

if ( ! function_exists( 'cs_generate_page_url' ) ) {
	function cs_generate_page_url( $route, $args = array(), $ns = false ) {
		if ( $ns === false ) {
			$ns = IC_PROMO_PAGE_ID;
		}
		$urlParams = array(
			'page'  => $ns,
			'route' => $route,
		);

		if ( ! empty( $args ) ) {
			$urlParams = array_merge( $urlParams, $args );
		}

		return add_query_arg(
			$urlParams,
			admin_url( 'admin.php' )
		);
	}
}

if ( ! function_exists( 'cs_is_current_page' ) ) {
	function cs_is_current_page( $route, $page = false ) {
		if ( $page === false ) {
			$page = IC_PROMO_PAGE_ID;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$currentPage = isset( $_GET['page'] ) ? sanitize_text_field( $_GET['page'] ) : false;
		if ( $currentPage === $page ) {
			// Check if the route is the same with route
			$currentRoute = cs_registry_get( 'admin.routes.current' );
			if ( $currentRoute === $route ) {
				return true;
			}
		}
		return false;
	}
}

if ( ! function_exists( 'cs_preview_page' ) ) {
	function cs_preview_page() {

		if ( get_post_type() === 'cs-promo-popups' ) {
			return true;
		}

		if ( cs_preview_page_id() > 0 ) {
			return true;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		if ( isset( $_GET['__iconvert-promoter-preview-remote-template'] ) ) {
			return true;
		}

		return false;
	}
}

if ( ! function_exists( 'cs_preview_page_id' ) ) {
	function cs_preview_page_id() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		return isset( $_GET['__iconvert-promoter-preview'] ) ? intval( $_GET['__iconvert-promoter-preview'] ) : 0;
	}
}

if ( ! function_exists( 'cs_is_email_builder_active' ) ) {
	function cs_is_email_builder_active() {
		return function_exists( 'iceb_is_plugin_installed' );
	}
}
