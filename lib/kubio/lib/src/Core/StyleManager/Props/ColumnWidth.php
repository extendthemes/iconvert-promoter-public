<?php


namespace KPromo\Core\StyleManager\Props;

use KPromo\Core\LodashBasic;
use KPromo\Core\StyleManager\ParserUtils;

class ColumnWidth extends PropertyBase {
	public function parse( $value, $options ) {
		$mergedValue = (object) $this->valueWithDefault( $value );

		// to implement (navigation sticky state)
		$htmlSupport = false;

		$types       = $this->config( 'enums.types' );
		$typeToStyle = $this->config( 'enums.typeToStyle' );

		switch ( $mergedValue->type ) {
			case $types['CUSTOM']:
				$customStyle = array();
				ParserUtils::addValueUnitString( $customStyle, 'width', $mergedValue->{$types['CUSTOM']} );
				$customStyle = LodashBasic::merge(
					array(),
					$customStyle,
					array(
						'flex'     => '0 0 auto',
						'-ms-flex' => '0 0 auto',
					)
				);
				return $customStyle;
			case $types['FLEX_GROW']:
			case $types['FIT_TO_CONTENT']:
				if ( ! $htmlSupport ) {
					return $typeToStyle[ $mergedValue->type ];
				}
		}
	}
}
