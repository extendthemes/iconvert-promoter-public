<?php

namespace KPromo\Core\StyleManager\Props;

use KPromo\Config;
use KPromo\Core\LodashBasic;
use KPromo\Core\StyleManager\ParserUtils;

class Size extends PropertyBase {
	public function parse( $value, $options ) {
		$defaultValue = Config::value( 'definitions.unitValuePx.default' );
		$style        = array();
		$style        = ParserUtils::addValueUnitString( $style, 'width', LodashBasic::merge( $defaultValue, $value ) );
		$style        = ParserUtils::addValueUnitString( $style, 'height', LodashBasic::merge( $defaultValue, $value ) );
		$style        = ParserUtils::addValueUnitString( $style, 'minWidth', LodashBasic::merge( $defaultValue, $value ) );
		$style        = ParserUtils::addValueUnitString( $style, 'minHeight', LodashBasic::merge( $defaultValue, $value ) );
		return $style;
	}
}
