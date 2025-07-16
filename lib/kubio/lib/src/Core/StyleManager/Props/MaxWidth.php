<?php

namespace KPromo\Core\StyleManager\Props;

use KPromo\Config;
use KPromo\Core\LodashBasic;
use KPromo\Core\StyleManager\ParserUtils;

class MaxWidth extends PropertyBase {

	public function parse( $value, $options ) {
		$defaultValue  = Config::value( 'props.maxWidth.default' );
		$mergedValue   = LodashBasic::merge( $defaultValue, $value );
		$maxWidthValue = ParserUtils::toValueUnitString( $mergedValue );
		if ( ! $maxWidthValue ) {
			return $maxWidthValue;
		}
		$style = array();

		$style['max-width'] = $maxWidthValue;
		return $style;
	}
}
