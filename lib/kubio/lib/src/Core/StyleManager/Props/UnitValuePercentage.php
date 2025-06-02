<?php

namespace KPromo\Core\StyleManager\Props;

use KPromo\Config;
use KPromo\Core\LodashBasic;
use KPromo\Core\StyleManager\ParserUtils;

class UnitValuePercentage extends PropertyBase {
	public function parse( $value, $options ) {
		$defaultValue = Config::value( 'definitions.unitValuePercent.default' );
		$style        = ParserUtils::addValueUnitString( $style, $this->name, LodashBasic::merge( $defaultValue, $value ) );
		return $style;
	}
}
