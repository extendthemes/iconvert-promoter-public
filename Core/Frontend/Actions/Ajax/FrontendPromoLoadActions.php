<?php

namespace CSPromo\Core\Frontend\Actions\Ajax;

use CSPromo\Core\Frontend\API\EmailListsAPI;
use CSPromo\Core\Frontend\PopupGenerate\PopupsListGenerator;
use CsPromoKubio\FrontendAssets;
use KPromo\Core\StyleManager\Utils as StyleManagerUtils;

class FrontendPromoLoadActions {
	use \CSPromo\Core\Traits\HasAction;

	public function __construct() {

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_REQUEST['iconvertpr_promo_load_popups'] ) ) {
			add_action( 'wp', array( $this, 'promo_load' ), 10 );
		}
	}

	private function get_state() {

        // phpcs:disable WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$payload       = isset( $_REQUEST['payload'] ) ? json_decode( wp_unslash( $_REQUEST['payload'] ), true ) : array();
		$visitor_id    = isset( $payload['visitorId'] ) ? sanitize_text_field( wp_unslash( $payload['visitorId'] ) ) : '';
		$is_preview    = isset( $payload['is_preview'] ) ? rest_sanitize_boolean( $payload['is_preview'] ) : false;
		$local_storage = isset( $payload['localStorage'] ) ? $payload['localStorage'] : array();
		$referrer      = isset( $payload['referrer'] ) ? $payload['referrer'] : array(
			'source'   => 'server',
			'referrer' => '',
		);

        // phpcs:enable

		$local_storage = array_replace_recursive(
			array(
				'timestamps' => array(
					'first' => time(),
					'last'  => time(),
				),
				'sessions'   => 1,
				'fired'      => array(),
				'converted'  => array(),
			),
			$local_storage
		);

		foreach ( $local_storage as $key => $value ) {
			switch ( $key ) {
				case 'timestamps':
					$local_storage[ $key ] = array(
						'first' => intval( $value['first'] ),
						'last'  => intval( $value['last'] ),
					);
					break;
				case 'sessions':
					$local_storage[ $key ] = intval( $value );
					break;
				case 'fired':
					foreach ( $value as $fired_key => $fired_value ) {
						unset( $local_storage[ $key ][ $fired_key ] );
						$fired_value = intval( $fired_value );
						$fired_key   = intval( $fired_key );
						if ( $fired_value && $fired_key ) {
							$local_storage[ $key ][ $fired_key ] = intval( $fired_value );
						}
					}
					break;
			}
		}

		 // phpcs:disable WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$inline_popups = isset( $payload['inlinePopups'] ) ? wp_unslash( $payload['inlinePopups'] ) : array();
		$inline_popups = array_map( 'intval', $inline_popups );

		if ( ! is_array( $referrer ) ) {
			$referrer = array(
				'source'   => 'server',
				'referrer' => $referrer,
			);
		}

		$referrer['source']   = isset( $referrer['source'] ) ? sanitize_text_field( wp_unslash( $referrer['source'] ) ) : 'server';
		$referrer['referrer'] = isset( $referrer['referrer'] ) ? sanitize_text_field( wp_unslash( $referrer['referrer'] ) ) : '';

		return array(
			'visitor_id'    => $visitor_id,
			'is_preview'    => ! ! $is_preview,
			'referrer'      => $referrer,
			'local_storage' => $local_storage,
			'inline_popups' => $inline_popups,
		);
	}

	public function promo_load() {

		$popups = PopupsListGenerator::getInstance();

		// handle the preview
		$state = $this->get_state();

		$active_popups = array();
		$triggers      = array();

		$popups->getActivePopups( $state['inline_popups'] );

		add_filter( 'kubio/can_render_block', '__return_true', PHP_INT_MAX );
		add_filter( 'kubio/can_register_style', '__return_true', PHP_INT_MAX );

		$scripts_render_options = array();
		$popup_fonts            = array();
		$popup_styles           = '';
		$subscribe_nonces       = array();

		foreach ( $popups->getPopups() as $popup ) {

			$check = new \CSPromo\Core\Frontend\Actions\Helpers\DisplayConditionsCheck( $popup->id, $state );

			if ( $check->meetsDisplayConditions() ) {
				$rendered_data    = $popup->render();
				$rendered_content = $rendered_data['content'];

				$active_popups[ $popup->id ] = $rendered_content;
				$popup_styles               .= $rendered_data['style'];
				$rendered_fonts              = $rendered_data['fonts'];
				$extras                      = $rendered_data['extras'];

				foreach ( $rendered_fonts as $family => $weights ) {
					if ( ! isset( $popup_fonts[ $family ] ) ) {
						$popup_fonts[ $family ] = array();
					}
					$popup_fonts[ $family ] = array_unique( array_merge( $popup_fonts[ $family ], $weights ) );
				}

				if ( str_contains( $rendered_content, 'cspromo/promoproduct' ) ) {
					$scripts_render_options['with_woo_styles'] = true;
				}

				$triggers[ $popup->id ] = $this->get_triggers( $popup, $state );

				if ( isset( $extras['forms'] ) ) {
					$subscribe_nonces[ $popup->id ] = array();
					foreach ( $extras['forms'] as $form ) {
						$subscribe_nonces[ $popup->id ][ $form ] = EmailListsAPI::createNonce( $popup->id, $form );
					}
				}
			}
		}

		$head_enqueued = '';

		if ( ! empty( $active_popups ) ) {
			$this->enqueue_google_fonts( $popup_fonts );
			$head_enqueued = $this->enqueue(
				$scripts_render_options
			);
		}

		$visitor_id = isset( $state['visitor_id'] ) ? $state['visitor_id'] : '';

		add_action(
			'nonce_user_logged_out',
			function ( $uid ) use ( $visitor_id ) {
				if ( ! $uid ) {
					$uid = $visitor_id;
				}

				return $uid;
			}
		);

		// we add the popup styles inline, because they are loaded from an ajax action,
		// when the popup is required to be displayed, and we load only the popup specific styles
		$head = $head_enqueued . "<style>{$popup_styles}</style>";

		$popup_data = apply_filters(
			'iconvertpr_ajax_load_popup_data',
			array(
				'popups'           => $active_popups,
				'head'             => $head,
				'triggers'         => $triggers,
				'analytics_nonce'  => $visitor_id ? wp_create_nonce( 'iconvertpr_promo_analytics' ) : '',
				'subscribe_nonces' => $subscribe_nonces,
				'data'             => array(
					'page_id' => get_the_ID(),
					'wc'      => array(
						'active' => function_exists( 'WC' ),
					),
				),
			),
			$state
		);

		$popup_data['data'] = (object) $popup_data['data'];

		wp_send_json_success(
			$popup_data
		);
	}

	private function enqueue( $options = array() ) {
		global $wp_styles, $wp_scripts, $wp_filter;
		define( 'ICONVERTPR_AJAX_LOAD', true );

		if ( isset( $wp_filter['wp_enqueue_scripts'] ) ) {
			$wp_filter['wp_enqueue_scripts'] = new \WP_Hook();
		}

		FrontendAssets::loadKubioAssets();

		// we reset the scripts as they are already enqueued in the page
		$wp_scripts = new \WP_Scripts();

		foreach ( $wp_styles->queue as  $handle ) {
			$lower_handle = strtolower( $handle );
			if ( isset( $options['with_woo_styles'] ) && $options['with_woo_styles'] ) {
				if ( str_starts_with( $lower_handle, 'woocommerce' ) || str_starts_with( $lower_handle, 'wc-' ) ) {
					continue;
				}
			}

			if ( str_starts_with( $lower_handle, 'kpromo' ) || str_starts_with( $lower_handle, 'cspromo' ) | str_starts_with( $lower_handle, 'iconvert' ) ) {
				continue;
			}

			$wp_styles->done[] = $handle;
		}

		$wp_styles->done = array_merge(
			$wp_styles->done,
			$wp_styles->registered['cspromo-block-library']->deps
		);

		// we enqueue the styles and scripts so we can server the correct styles and scripts for the popup
		do_action( 'wp_enqueue_scripts' );
		do_action( 'wp_print_head_scripts' );
		do_action( 'wp_print_footer_scripts' );
		$head = ob_get_clean();

		return $head;
	}

	private function get_triggers( $popup, $state ) {
		$applied_triggers = array();

		if ( $state['is_preview'] ) {
			$applied_triggers = array(
				'preview' => array(),
			);
		}

		$triggers = get_post_meta( $popup->id, 'triggers', true );

		if ( empty( $triggers ) ) {
			$triggers = array();
		}

		foreach ( $triggers as $trigger_name => $trigger_values ) {
			if ( filter_var( $trigger_values['checkbox'], FILTER_VALIDATE_BOOLEAN ) ) {
				unset( $trigger_values['checkbox'] );
				$applied_triggers[ $trigger_name ] = $trigger_values;
			}
		}

		if ( empty( $applied_triggers ) ) {
			$applied_triggers = array(
				'page-load' => array(
					0 => 0,
				),
			);
		}

		$state         = $this->get_state();
		$inline_popups = isset( $state['inline_popups'] ) ? $state['inline_popups'] : array();

		if ( in_array( $popup->id, $inline_popups, true ) ) {
			$applied_triggers = array_merge(
				$applied_triggers,
				array(
					'inline'    => array(
						0 => 1,
					),
					'page-load' => array(
						0 => 0,
					),
				)
			);
		}

		return (object) $applied_triggers;
	}

	private function enqueue_google_fonts( $fonts ) {
		if ( empty( $fonts ) ) {
			return '';
		}

		$groups = array();
		foreach ( $fonts as $family => $weights ) {

			// add the default if necessary 400 and normailize weights array - ensure proper caching by sorting the weights and removing duplicates
			$groups[] = $family . ':' . implode( ',', StyleManagerUtils::normalizeFontWeights( $weights ) );
		}
		$fonts_query = implode( '|', $groups );

		$query_args = array(
			'family'  => urlencode( $fonts_query ),
			'display' => 'swap',
		);

		$fonts_url = add_query_arg( $query_args, 'https://fonts.googleapis.com/css' );
		wp_enqueue_style( 'kpromo-promoter-google-fonts', $fonts_url, array(), ICONVERTPR_VERSION );
	}
}
