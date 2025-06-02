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

		if ( defined( 'IC_PROMO_AJAX_LOAD' ) ) {
			return;
		}

		//main style + js
		wp_enqueue_style( 'cs-promo-popups-main', $this->assets_url( 'css/dist/style.min.css' ), array(), IC_PROMO_VERSION );
		wp_enqueue_script(
			'cs-promo-popups-main',
			$this->assets_url( 'js/dist/index.js' ),
			array( 'jquery' ),
			IC_PROMO_VERSION,
			array(
				'strategy'  => 'defer',
				'in_footer' => true,
			)
		);

		// animate
		wp_enqueue_style( 'cs-promo-popups-animations', $this->assets_url( 'css/animate.min.css' ), array(), IC_PROMO_VERSION );

		if ( cs_preview_page() ) {
			wp_enqueue_style( 'cs-promo-skeleton-css', $this->assets_url( 'css/skeleton-css/style.css' ) );
		}
		/**
		 * load the JS variables here
		 */

		$storage_key = 'icp';

		if ( defined( 'IC_USE_UNIQUE_STORAGE_KEY' ) && IC_USE_UNIQUE_STORAGE_KEY ) {
			$storage_key = get_option( 'cs_promo_storage_key' );
			if ( empty( $storage_key ) ) {
				$storage_key = 'icp_' . wp_generate_uuid4() . '-' . get_current_blog_id();
				update_option( 'cs_promo_storage_key', $storage_key, true );
			}
		}

		global $wp;
		wp_localize_script(
			'cs-promo-popups-main',
			'cs_promo_settings',
			array(
				'ajax_url'         => admin_url( 'admin-ajax.php' ),
				'query_vars_keys'  => $wp->public_query_vars,
				'site_url'         => site_url(),
				'page_no'          => get_the_ID(),
				'session_duration' => IC_PROMO_SESSION_DURATION,
				'referrer'         => isset( $_SERVER['HTTP_REFERER'] ) ? $_SERVER['HTTP_REFERER'] : '',
				'server_time'      => time(),
				'storage_key'      => $storage_key,
			)
		);

		wp_add_inline_script(
			'cs-promo-popups-main',
			$this->add_loader_script(),
			'before'
		);
	}


	public function add_loader_script() {
		return file_get_contents( IC_PROMO_PATH . 'frontend/assets/loader.js' );
	}


	/**
	 * Get the admin assets url
	 *
	 * @param  mixed $filename
	 * @return void
	 */
	public function assets_url( $filename ) {
		return IC_PROMO_URL . 'frontend/assets/' . $filename;
	}
}
