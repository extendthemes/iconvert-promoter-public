<?php

namespace CSPromo\Core\Frontend\Actions\Helpers;

use CSPromo\Core\Frontend\Actions\Helpers\DisplayConditions\DateTimeCheck;
use CSPromo\Core\Frontend\Actions\Helpers\DisplayConditions\PageCheck;
use CSPromo\Core\Frontend\Actions\Helpers\DisplayConditions\UserCheck;

class DisplayConditionsCheck {
	public $id;

	private $state = array();

	public function __construct( $id, $state = array() ) {
		$this->id    = $id;
		$this->state = $state;
	}

	public function meetsDisplayConditions() {
		$display_conditions = $this->createDisplayConditionsArr();

		if ( empty( $display_conditions ) || ! isset( $display_conditions ) ) {
			return false;
		}

		$conditions_arr = array(
			new DateTimeCheck( $this->id, $display_conditions, $this->state ),
			new PageCheck( $this->id, isset( $display_conditions['pages'] ) ? $display_conditions['pages'] : array(), $this->state ),
			new UserCheck( $this->id, isset( $display_conditions['cs-roles'] ) ? $display_conditions['cs-roles'] : array(), $this->state ),
		);

		$conditions_arr = apply_filters( 'iconvertpr_display_conditions', $conditions_arr, $this->id, $display_conditions, $this->state );

		$show = true;

		foreach ( $conditions_arr as $condition ) {
			$show = $show && $condition->check();

			if ( ! $show ) {
				break;
			}
		}

		return $show;
	}

	public function createDisplayConditionsArr() {
		return get_post_meta( $this->id, 'display_conditions', true );
	}
}
