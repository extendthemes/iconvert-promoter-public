<?php

namespace KPromo\Core\StyleManager\Props;

use KPromo\Core\LodashBasic;

class MultipleImage extends PropertyBase {
	public function parse( $value, $options ) {

		$angle           = LodashBasic::get( $value, 'angle', '' );
		$widthPercentage = LodashBasic::get( $value, 'widthPercentage', '' );
		$topPercentage   = LodashBasic::get( $value, 'topPercentage', '' );
		$leftPercentage  = LodashBasic::get( $value, 'leftPercentage', '' );
		$zIndex          = LodashBasic::get( $value, 'zIndex', '' );
		$style           = array(
			'transform' => sprintf( 'rotate(%sdeg)', $angle ),
			'width'     => $widthPercentage . '%',
			'top'       => $topPercentage . '%',
			'left'      => $leftPercentage . '%',
			'zIndex'    => $zIndex,
			'position'  => 'absolute',
			'height'    => 'auto',
		);
		return $style;
	}
}
