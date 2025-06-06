<?php

namespace KPromo\Core\StyleManager\Props;

use KPromo\Core\StyleManager\ParserUtils;
use function join;

class TBLR extends PropertyBase {
	public function computeTBLRCss( $prefix, $style, $obj ) {
		foreach ( $obj as $name => $value ) {
			ParserUtils::addValueUnitString( $style, join( '-', array( $prefix, $name ) ), $value );
		}
		return $style;
	}

	public function parse( $value, $options ) {
		$defaultValue = $this->config( 'default' );
		$obj          = new ValueProxy( $value, $defaultValue );
		return $this->computeTBLRCss( $this->name, array(), $obj->mergedValue );
	}
}
