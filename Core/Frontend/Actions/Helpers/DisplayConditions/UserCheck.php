<?php
namespace CSPromo\Core\Frontend\Actions\Helpers\DisplayConditions;

class UserCheck {
	public $id;
	public $array;

	public function __construct( $id, $array, $state = array() ) {
		$this->id    = $id;
		$this->array = $array;
	}

	public function check() {
		if ( is_user_logged_in() ) {
			if ( isset( $this->array[0] ) && $this->array[0] === 'logged' ) {
				return 0;
			} else {
				$user = wp_get_current_user();
				if ( $this->array !== null && ! empty( array_intersect( $user->roles, $this->array ) ) ) {
					return 0;
				}
			}
		}

		return 1;
	}
}
