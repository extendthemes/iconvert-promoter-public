<?php
namespace CSPromo\Core\Traits;

trait HasRateLimit {

	public function get_client_ip() {
		$ip_keys = array(
			'HTTP_CF_CONNECTING_IP',       // Cloudflare
			'HTTP_X_FORWARDED_FOR',        // Standard proxies, might contain multiple IPs
			'HTTP_CLIENT_IP',              // Shared internet
			'HTTP_X_REAL_IP',              // Nginx proxy / FastCGI
			'HTTP_X_FORWARDED',            // Microsoft proxy
			'HTTP_X_CLUSTER_CLIENT_IP',    // Load balancers
			'HTTP_FORWARDED_FOR',          // Squid proxies
			'HTTP_FORWARDED',
			'REMOTE_ADDR',                  // Fallback
		);

		foreach ( $ip_keys as $key ) {
			if ( array_key_exists( $key, $_SERVER ) && ! empty( $_SERVER[ $key ] ) ) {
				$ip_list = explode( ',', sanitize_textarea_field( wp_unslash( $_SERVER[ $key ] ) ) ); // In case of multiple IPs - each will be checked later with filter_var
				foreach ( $ip_list as $ip ) {
					$clean_ip = trim( $ip );
					if ( filter_var( $clean_ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_RES_RANGE | FILTER_FLAG_NO_PRIV_RANGE ) ) {
						return $clean_ip;
					}
				}
			}
		}

		if ( ! isset( $_SERVER['REMOTE_ADDR'] ) || empty( $_SERVER['REMOTE_ADDR'] ) ) {
			return '0.0.0.0';
		}

		// Final fallback
		return sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) );
	}


	public function is_rate_limit_exceeded( $action = 'default', $limit = null, $window = null ) {
		$ip         = $this->get_client_ip();
		$agent      = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_textarea_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : 'unknown';
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$visitor_id = isset( $_REQUEST['visitor_id'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['visitor_id'] ) ) : 'unknown';

		// Hash IP and User-Agent together for uniqueness
		$hash = md5( $ip . '|' . $agent . '|' . $visitor_id );
		$key  = 'iconvertpr_rate_limit_' . $hash;

		$limit  = $limit ? $limit : ICONVERTPR_ANALYTICS_RATE_LIMIT_REQUEST; // requests
		$window = $window ? $window : ICONVERTPR_RATE_LIMIT_TIME; // seconds

		$this->maybe_cleanup_rate_limit_transients();

		$data = get_transient( $key );

		if ( ! $data ) {
			$data = array();
		}

		$action_data    = isset( $data[ $action ] ) ? $data[ $action ] : false;
		$transient_time = $window;

		if ( $action_data === false ) {
			$action_data = array(
				'count' => 1,
				'start' => microtime( true ),
			);
		} else {
			$time_diff = microtime( true ) - $action_data['start'];
			if ( $time_diff < $window ) {
				if ( $action_data['count'] >= $limit ) {
					return true; // Rate limit exceeded
				} else {
					$action_data['count'] += 1;
					$transient_time        = ceil( $window - $time_diff );
				}
			} else {
				// Reset the count and start time
				$action_data = array(
					'count' => 1,
					'start' => microtime( true ),
				);

			}
		}

		$data[ $action ] = $action_data;
		set_transient( $key, $data, $transient_time ); // Update the transient with the new data

		return false; // Rate limit not exceeded
	}

	public function maybe_cleanup_rate_limit_transients() {

		// phpcs:ignore WordPress.WP.AlternativeFunctions.rand_mt_rand
		if ( mt_rand( 1, 10 ) !== 1 ) {
			return; // 90% of the time, skip cleanup
		}

		$last_cleanup = get_option( 'iconvertpr_rate_limit_last_cleanup', 0 );

		if ( time() - $last_cleanup < ICONVERTPR_RATE_LIMIT_CLEANUP_INTERVAL ) {
			return;
		}

		delete_expired_transients( true );
		update_option( 'iconvertpr_rate_limit_last_cleanup', time() );
	}
}
