<?php

namespace CsPromoKubio;


class Woocommerce {
	private static $instance;

	protected function __construct() {
		if ( 'yes' === get_option( 'woocommerce_enable_coupons' ) ) {
			add_filter(
				'woocommerce_register_post_type_shop_coupon',
				array( $this, 'woocommerce_register_post_type_shop_coupon' )
			);
			add_filter(
				'rest_prepare_shop_coupon',
				function ( $response ) {
					$response->data['excerpt'] = get_the_excerpt();
					return $response;
				}
			);
			add_action( 'wp_ajax_iconvertpr_apply_coupon', array( $this, 'apply_coupon' ) );
			add_action( 'wp_ajax_nopriv_iconvertpr_apply_coupon', array( $this, 'apply_coupon' ) );
			add_action( 'woocommerce_before_cart', array( $this, 'apply_coupon' ) );

		}
	}
	public function apply_coupon() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( ! isset( $_POST['coupon_code'] ) ) {
			return;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( $_POST['coupon_code'] == '' ) {
			return;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		$coupon_code = sanitize_text_field( $_POST['coupon_code'] );

		if ( \WC()->cart->has_discount( $coupon_code ) ) {
			wp_send_json_success(
				array(
					'code'   => 'already_applied',
					'status' => 'success',
				),
				200
			);
			return;
		}

		\WC()->cart->apply_coupon( $coupon_code );
		if ( \WC()->cart->has_discount( $coupon_code ) ) {
			\WC()->cart->calculate_totals();
			wp_send_json_success(
				array(
					'code'         => 'applied',
					'status'       => 'success',
					'checkout_url' => \wc_get_checkout_url(),
				),
				200
			);
		} else {
			wp_send_json_success(
				array(
					'code'   => 'not_valid',
					'status' => 'error',
				),
				200
			);
		}
	}

	public function woocommerce_register_post_type_shop_coupon( $settings ) {
		$settings['show_in_rest'] = true;
		//var_dump($settings); die("Woocommerce filter");
		return $settings;
	}
	public static function getInstance() {
		if ( ! self::$instance ) {

			self::$instance = new self();
		}

		return self::$instance;
	}

	public static function load() {
		return self::getInstance();
	}
}
