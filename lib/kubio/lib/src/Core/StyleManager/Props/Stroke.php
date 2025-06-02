<?php

namespace KPromo\Core\StyleManager\Props;

use KPromo\Config;
use KPromo\Core\LodashBasic;
use KPromo\Core\StyleManager\ParserUtils;

class Stroke extends PropertyBase {
	public function parse( $value, $options ) {
		$style        = array();
		$defaultValue = Config::value( 'props.stroke.default' );
		$style        = ParserUtils::addPrimitiveValues( $style, LodashBasic::merge( $defaultValue, $value ), Config::value( 'props.stroke.map' ) );
		return $style;
	}
}
