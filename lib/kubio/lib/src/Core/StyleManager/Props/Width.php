<?php

namespace KPromo\Core\StyleManager\Props;

use KPromo\Config;
use KPromo\Core\LodashBasic;
use KPromo\Core\StyleManager\ParserUtils;

class Width extends PropertyBase {
	public function parse( $value, $options ) {
		if ( is_string( $value ) ) {
			return $value;
		}

		$defaultValue = Config::value( 'definitions.unitValuePx.default' );

		$style = ParserUtils::addValueUnitString( $style, 'width', LodashBasic::merge( $defaultValue, $value ) );
		return $style;
	}
}
