<?php
namespace CSPromo\Core\Frontend\Actions\Helpers\DisplayConditions;

class CountriesCheck {
	public $id;
	public $array;

	public function __construct( $id, $array ) {
		$this->id    = $id;
		$this->array = $array;
	}

	public function check() {
		$json = file_get_contents( 'https://geo.convertsquad.com/' );
		$obj  = json_decode( $json );

		if ( $this->array[0] != 'cs-all-countries' && ! empty( $this->array ) ) {
			if ( ! @in_array( $obj->country, $this->array ) ) {
				return 0;
			}
		}

		return 1;
	}
}
