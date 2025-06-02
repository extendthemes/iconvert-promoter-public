<?php

namespace KPromo\Core\StyleManager\Props;

use KPromo\Config;
use KPromo\Core\LodashBasic;
use KPromo\Core\StyleManager\ParserUtils;


class ObjectCss extends PropertyBase {

	public function parse( $value, $options ) {
		$defaultValue = Config::value( 'props.object.default' );
		$mergedValue  = LodashBasic::merge( $defaultValue, $value );

		$style          = array();
		$objectPosition = ParserUtils::toValueUnitString( LodashBasic::get( $mergedValue, 'position' ) );
		if ( ParserUtils::isNotEmptyButCanBeZero( $objectPosition ) ) {
			$style['objectPosition'] = $objectPosition;
		}
		$objectFit = ParserUtils::toValueUnitString( LodashBasic::get( $mergedValue, 'fit' ) );
		if ( ParserUtils::isNotEmptyButCanBeZero( $objectFit ) ) {
			$style['objectFit'] = $objectFit;
		}
		return $style;
	}
}
