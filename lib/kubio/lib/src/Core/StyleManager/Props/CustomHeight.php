<?php


namespace KPromo\Core\StyleManager\Props;

use KPromo\Core\LodashBasic;
use KPromo\Core\StyleManager\ParserUtils;

class CustomHeight extends PropertyBase {

	public function parse( $value, $options ) {
		$mergedValue = (object) $this->valueWithDefault( $value );

		$types       = $this->config( 'enums.types' );
		$typeToConst = array_flip( $types );

		$typeConstName = $typeToConst[ $mergedValue->type ];

		$cssByType  = $this->config( 'config.cssByType' );
		$minHeights = $this->config( 'config.minHeightByType' );

		if ( $typeConstName == 'MIN_HEIGHT' ) {
			$minHeights['MIN_HEIGHT'] = $mergedValue->{$types['MIN_HEIGHT']};
		}

		$style = LodashBasic::get( $cssByType, $typeConstName, array() );

		if ( isset( $minHeights[ $typeConstName ] ) ) {
			ParserUtils::addValueUnitString( $style, 'min-height', $minHeights[ $typeConstName ] );
		}

		return $style;
	}
}
