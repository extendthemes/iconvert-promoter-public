<?php

namespace CSPromo\Core\Frontend\Actions;



class Assets {


	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'load' ) );
	}

	/**
	 * Load the scripts/styles
	 *
	 * @return void
	 */
	public function load() {

		if ( defined( 'ICONVERTPR_AJAX_LOAD' ) ) {
			return;
		}

		//main style + js
		wp_enqueue_style( 'iconvertpr-popups-main', $this->assets_url( 'css/dist/style.min.css' ), array(), ICONVERTPR_VERSION );
		wp_enqueue_script(
			'iconvertpr-popups-main',
			$this->assets_url( 'js/dist/index.js' ),
			array( 'jquery' ),
			ICONVERTPR_VERSION,
			array(
				'strategy'  => 'defer',
				'in_footer' => true,
			)
		);

		// animate
		wp_enqueue_style( 'iconvertpr-animations', $this->assets_url( 'css/animate.min.css' ), array(), ICONVERTPR_VERSION );

		if ( iconvertpr_preview_page() ) {
			wp_enqueue_style( 'iconvertpr-skeleton', $this->assets_url( 'css/skeleton-css/style.css' ), array(), ICONVERTPR_VERSION );
		}
		/**
		 * load the JS variables here
		 */

		$storage_key = 'icp';

		if ( defined( 'ICONVERTPR_USE_UNIQUE_STORAGE_KEY' ) && ICONVERTPR_USE_UNIQUE_STORAGE_KEY ) {
			$storage_key = get_option( 'iconvertpr_promo_storage_key' );
			if ( empty( $storage_key ) ) {
				$storage_key = 'icp_' . wp_generate_uuid4() . '-' . get_current_blog_id();
				update_option( 'iconvertpr_promo_storage_key', $storage_key, true );
			}
		}

		global $wp;
		wp_localize_script(
			'iconvertpr-popups-main',
			'cs_promo_settings',
			array(
				'ajax_url'         => admin_url( 'admin-ajax.php' ),
				'query_vars_keys'  => $wp->public_query_vars,
				'site_url'         => site_url(),
				'page_no'          => get_the_ID(),
				'session_duration' => ICONVERTPR_SESSION_DURATION,
				'referrer'         => esc_url_raw( isset( $_SERVER['HTTP_REFERER'] ) ? wp_unslash( $_SERVER['HTTP_REFERER'] ) : '' ),
				'server_time'      => time(),
				'storage_key'      => $storage_key,
			)
		);

		wp_add_inline_script(
			'iconvertpr-popups-main',
			$this->add_loader_script(),
			'before'
		);
	}


	public function add_loader_script() {

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- we just check if the property is set, not the value.
		if ( isset( $_GET['__iconvert-promoter-preview-remote-template'] ) ) {
			return '';
		}

		return file_get_contents( ICONVERTPR_PATH . 'frontend/assets/loader.js' );
	}


	/**
	 * Get the admin assets url
	 *
	 * @param  mixed $filename
	 * @return void
	 */
	public function assets_url( $filename ) {
		return ICONVERTPR_URL . 'frontend/assets/' . $filename;
	}
}
