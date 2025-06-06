<?php


namespace KPromo\Core\StyleManager\Props;


use KPromo\Core\LodashBasic;
use function join;

class TextShadow extends PropertyBase {
	public function parse( $value, $options ) {
		$enabled = LodashBasic::get( $value, 'enabled', false );
		if ( ! $enabled ) {
			return array();
		}

		$layer               = $this->valueWithDefault( $value );
		$style               = array();
		$style['textShadow'] = join( ' ', array( "{$layer['x']}px", "{$layer['y']}px", "{$layer['blur']}px", $layer['color'] ) );
		return $style;
	}
}
