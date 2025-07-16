<?php

namespace CSPromo\Core\Admin\Actions;

class Assets {

	public function __construct() {

		$allowed_pages = array(
			ICONVERTPR_PAGE_ID,
			ICONVERTPR_PAGE_SUBSCRIBERS,
			ICONVERTPR_PAGE_INTEGRATIONS,
			ICONVERTPR_PAGE_UPGRADE,
		);

		$allowed_pages = apply_filters( 'iconvertpr_allowed_pages_for_assets', $allowed_pages );

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['page'] ) && in_array( $_GET['page'], $allowed_pages, true ) ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'load' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'bootstrap_init' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'autocomplete_init' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'datetimepicker_init' ) );

			// add a common body class for the plugin admin pages
			add_filter( 'admin_body_class', array( $this, 'bodyClass' ) );

			// add_action( 'admin_head', array( $this, 'metaViewport' ) );
		} else {
			add_action( 'admin_enqueue_scripts', array( $this, 'loadGlobal' ) );
		}
	}

	public function loadGlobal() {
		// need to load the css globally
		wp_enqueue_style( 'iconvertpr-style', $this->assets_url( 'css/dist/style.min.css' ), array(), ICONVERTPR_VERSION );
	}

	/**
	 * Load the scripts/styles
	 *
	 * @return void
	 */
	public function load() {
		//select2
		wp_enqueue_script( 'select2', $this->assets_url( 'js/select2/js/select2.min.js' ), array(), '4.1.0', true );
		wp_enqueue_style( 'select2', $this->assets_url( 'js/select2/css/select2.min.css' ), array(), '4.1.0' );

		wp_enqueue_script( 'cs-snackbar', $this->assets_url( 'js/snackbar/js-snackbar.min.js' ), array(), '0.1', true );
		wp_enqueue_style( 'cs-snackbar-style', $this->assets_url( 'js/snackbar/js-snackbar.css' ), array(), '0.1' );

		//main style + js
		wp_enqueue_style( 'iconvertpr-style', $this->assets_url( 'css/dist/style.min.css' ), array(), ICONVERTPR_VERSION );

		wp_enqueue_script( 'iconvertpr-popups', $this->assets_url( 'js/dist/index.js' ), array( 'jquery', 'select2', 'cs-snackbar' ), ICONVERTPR_VERSION, true );

		wp_localize_script(
			'iconvertpr-popups',
			'cs_promo_settings',
			array(
				'ajax_url'    => admin_url( 'admin-ajax.php' ),
				'windowPopup' => array( 'status' => false ),
				'messages'    => array(
					'deletePromoConfirmation' => __( 'Are you sure you want to delete this record?', 'iconvert-promoter' ),
				),
				'has_providers_configured' => apply_filters(
					'iconvertpr_has_providers_configured',
					false
				),
			)
		);
	}


	public function bootstrap_init() {
		// JS popper
		wp_register_script( 'cs-promo-popper-js', $this->assets_url( 'js/popper/popper.min.js' ), array(), ICONVERTPR_VERSION, true );
		wp_enqueue_script( 'cs-promo-popper-js' );

		// JS bootstrap
		wp_register_script( 'cs-promo-bootstrap-js', $this->assets_url( 'js/bootstrap/bootstrap.bundle.min.js' ), array(), ICONVERTPR_VERSION, true );
		wp_enqueue_script( 'cs-promo-bootstrap-js' );

		// JS bootstrap
		wp_register_script( 'cs-promo-bootbox-js', $this->assets_url( 'js/bootstrap/bootbox.min.js' ), array(), ICONVERTPR_VERSION, true );
		wp_enqueue_script( 'cs-promo-bootbox-js' );

		// styles
		wp_register_style( 'cs-promo-bootstrap-css', $this->assets_url( 'js/bootstrap/css/bootstrap.min.css' ), array(), ICONVERTPR_VERSION );
		wp_enqueue_style( 'cs-promo-bootstrap-css' );

		// Icons
		wp_register_style( 'cs-promo-bootstrap-icons', $this->assets_url( 'js/bootstrap/css/bootstrap-icons.css' ), array(), ICONVERTPR_VERSION );
		wp_enqueue_style( 'cs-promo-bootstrap-icons' );
	}

	public function autocomplete_init() {

		// js
		wp_register_script( 'iconvertpr-autocomplete', $this->assets_url( 'js/bundles/autocomplete-bundle.min.js' ), array( 'jquery' ), ICONVERTPR_VERSION, true );
		wp_enqueue_script( 'iconvertpr-autocomplete' );

		$countries = apply_filters( 'iconvertpr_countries', array() );
		$states    = apply_filters( 'iconvertpr_states', array() );

		wp_localize_script(
			'iconvertpr-autocomplete',
			'cs_promo_autocomplete',
			array(
				'countries' => array_merge( array( '' => __( 'Select a country', 'iconvert-promoter' ) ), $countries ),
				'cities'    => $states,
			)
		);
	}

	public function datetimepicker_init() {
		// CSS datetimepicker
		wp_register_style( 'cs-promo-datetimepicker-local-css', $this->assets_url( 'js/datetimepicker/jquery.datetimepicker.min.css' ), array(), ICONVERTPR_VERSION );
		wp_enqueue_style( 'cs-promo-datetimepicker-local-css' );

		// JS datetimepicker
		wp_register_script( 'cs-promo-datetimepicker-local-js', $this->assets_url( 'js/datetimepicker/jquery.datetimepicker.full.min.js' ), array( 'jquery' ), ICONVERTPR_VERSION, true );
		wp_enqueue_script( 'cs-promo-datetimepicker-local-js' );
	}
	/**
	 * Get the admin assets url
	 *
	 * @param mixed $filename
	 *
	 * @return string
	 */
	public function assets_url( $filename ) {
		return ICONVERTPR_URL . 'admin/assets/' . $filename;
	}

	// function bodyClass
	public function bodyClass( $classes ) {
		$classes .= ' ic-promo-admin';

		return $classes;
	}
}
