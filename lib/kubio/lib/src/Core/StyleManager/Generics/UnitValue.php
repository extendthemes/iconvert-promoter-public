<?php

namespace KPromo\Core\StyleManager\Generics;

use KPromo\Core\StyleManager\ParserUtils;
use KPromo\Core\StyleManager\Props\Property;
use function is_string;

class UnitValue extends Property {
	public function __toString() {
		if ( is_string( $this->value ) ) {
			return $this->value;
		}

		return ParserUtils::toValueUnitString( $this->value, $this->default );
	}
}
