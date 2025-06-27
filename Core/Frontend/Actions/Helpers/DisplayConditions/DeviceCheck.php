<?php
namespace CSPromo\Core\Frontend\Actions\Helpers\DisplayConditions;

class DeviceCheck {
	public $id;
	public $data;

	public function __construct( $id, $data ) {
		$this->id   = $id;
		$this->data = $data;
	}

	public function check() {
		// if nothing is selected we show it on all devices (for backward compatibility with the free version, which has no device condition)
		if ( ! is_array( $this->data ) ) {
			return 1;
		}

		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$useragent = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_textarea_field( $_SERVER['HTTP_USER_AGENT'] ) : '';
		if ( stripos( $useragent, 'mobile' ) === false && stripos( $useragent, 'tablet' ) === false && stripos( $useragent, 'ipad' ) === false ) { //is desktop
			if ( ! in_array( 'desktop', $this->data, true ) ) {
				return 0;
			}
		} elseif (
			( stripos( $useragent, 'tablet' ) !== false || stripos( $useragent, 'tab' ) !== false ) ||
			( stripos( $useragent, 'ipad' ) !== false )
		) { //is tablet/ipad
			if ( ! in_array( 'tablet', $this->data, true ) ) {
				return 0;
			}
		} elseif ( stripos( $useragent, 'mobile' ) !== false || stripos( $useragent, 'nokia' ) !== false || stripos( $useragent, 'phone' ) !== false ) { //is mobile
			if ( ! in_array( 'mobile', $this->data, true ) ) {
				return 0;
			}
		}

		return 1;
	}
}
