<?php

namespace CSPromo\Core\Admin\Actions\Ajax;

use CSPromo\Core\Traits\HasAction;

class TriggersAjaxActions {
	use HasAction;

	public function __construct() {
		add_action( 'wp_ajax_iconvertpr_promo_get_cart_details', array( $this, 'getCartDetails' ) );
		add_action( 'wp_ajax_nopriv_iconvertpr_promo_get_cart_details', array( $this, 'getCartDetails' ) );
	}

	public function getCartDetails() {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( isset( $_POST['cart'] ) && $_POST['cart'] === 'cart_details' ) {
			if ( function_exists( 'WC' ) ) {
				$cart_items = WC()->cart->get_cart();
				$cart_total = wc_prices_include_tax() ? WC()->cart->get_cart_contents_total() + WC()->cart->get_cart_contents_tax() : WC()->cart->get_cart_contents_total();

				$product_ids = array();

				foreach ( $cart_items as $item ) {
					$product_ids[] = $item['product_id'];
				}

				wp_send_json_success(
					array(
						'count'       => WC()->cart->get_cart_contents_count(),
						'productsIds' => $product_ids,
						'total'       => floatval( $cart_total ),
					)
				);
			} else {
				wp_send_json_success(
					array(
						'count'       => 0,
						'productsIds' => array(),
						'total'       => 0,
					)
				);
			}
		}
	}
}
