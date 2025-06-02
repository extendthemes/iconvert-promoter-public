<?php

namespace KPromo\Core\StyleManager\Props;

use KPromo\Config;
use KPromo\Core\LodashBasic;
use KPromo\Core\StyleManager\ParserUtils;

class Gap extends PropertyBase {
	public function parse( $value, $options ) {
		$defaultValue = Config::value( 'definitions.unitValuePx.default' );
		$style        = array();
		$style        = ParserUtils::addValueUnitString( $style, 'gap', LodashBasic::merge( $defaultValue, $value ) );
		$style        = ParserUtils::addValueUnitString( $style, '--kubio-gap-fallback', LodashBasic::merge( $defaultValue, $value ) );
		return $style;
	}
}
