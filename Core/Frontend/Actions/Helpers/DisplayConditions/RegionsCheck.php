<?php
namespace CSPromo\Core\Frontend\Actions\Helpers\DisplayConditions;

class RegionsCheck {
	public $id;
	public $array;

	public function __construct( $id, $array ) {
		$this->id    = $id;
		$this->array = $array;
	}

	public function check() {
		$json = file_get_contents( 'https://geo.convertsquad.com/' );
		$obj  = json_decode( $json );

		if ( $this->array[0] != 'cs-all-regions' && ! empty( $this->array ) ) {
			$percent = 0;
			foreach ( $this->array as $reg ) {
				similar_text( $reg, $obj->region, $percent );
				if ( $percent > 68 ) {
					break;
				} else {
					$percent = 0;
				}
			}
			if ( $percent == 0 ) {
				return 0;
			}
		}

		return 1;
	}
}
