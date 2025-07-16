<?php

namespace CSPromo\Core\Frontend\Actions\Helpers\DisplayConditions;

use IlluminateAgnostic\Arr\Support\Arr;

class DateTimeCheck {
	public $id;
	public $data;

	public $state = array();


	public function __construct( $id, $data, $state = array() ) {
		$this->id    = intval( $id );
		$this->data  = $data;
		$this->state = $state;
	}

	private function getLastVisitTime() {
		$last_visit = Arr::get( $this->state, 'local_storage.timestamps.last', time() );

		return $last_visit;
	}

	public function check() {
		$converted = Arr::get( $this->state, 'local_storage.converted', array() );

		if ( ! isset( $converted[ $this->id ] ) ) {
			return 1;
		}

		$conversion_state_type = Arr::get( $converted, "{$this->id}.type", null );
		$conversion_state_time = Arr::get( $converted, "{$this->id}.time", 0 );

		$default_recurring_settings = array(
			'converted' => array(
				'when'  => 'never',
				'delay' => 1,
				'unit'  => 'd',
			),
			'closed'    => array(
				'when'  => 'next_visit',
				'delay' => 1,
				'unit'  => 'd',
			),
		);

		$recurring_settings = isset( $this->data['recurring'] ) ? $this->data['recurring'] : array();

		$recurring_settings = isset( $recurring_settings[ $conversion_state_type ] ) ? $recurring_settings[ $conversion_state_type ] : $default_recurring_settings[ $conversion_state_type ];

		switch ( $recurring_settings['when'] ) {
			case 'never':
				return 0;
			case 'next_visit':
				$passed_from_last_visit = time() - $this->getLastVisitTime();
				return ( $passed_from_last_visit > ICONVERTPR_SESSION_DURATION ) ? 1 : 0;
			case 'after':
				return $this->isDue( intval( $recurring_settings['delay'] ), $recurring_settings['unit'], $conversion_state_time );
			default:
				return 1;
		}
	}

	public function isDue( $delay, $unit, $converted_time = 0 ) {

		$multiplier = 1;
		switch ( $unit ) {
			case 'm':
				$multiplier = MINUTE_IN_SECONDS;
				break;
			case 'h':
				$multiplier = HOUR_IN_SECONDS;
				break;
			case 'd':
				$multiplier = DAY_IN_SECONDS;
				break;
		}

		$delay = $delay * $multiplier;

		$converted_time = $converted_time ? $converted_time : 0;

		if ( intval( $converted_time ) === 0 ) {
			return 0;
		}

		if ( intval( $converted_time ) + $delay > time() ) {
			return 0;
		}

		return 1;
	}
}
