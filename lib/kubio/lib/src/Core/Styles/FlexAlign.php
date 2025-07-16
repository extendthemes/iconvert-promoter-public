<?php
namespace KPromo\Core\Styles;

use KPromo\Core\LodashBasic;
use KPromo\Core\Styles\Utils;

class FlexAlign {
	public static function getVAlignClasses( $alignByMedia, $options = array() ) {
		$self        = LodashBasic::get( $options, 'self', false );
		$alignPrefix = $self ? 'align-self' : 'align-items';
		return Utils::composeClassesByMedia( $alignByMedia, $alignPrefix );
	}

	public static function getHAlignClasses( $alignByMedia, $options = array() ) {
		$self        = LodashBasic::get( $options, 'self', false );
		$alignPrefix = $self ? 'justify-self' : 'justify-content';
		return Utils::composeClassesByMedia( $alignByMedia, $alignPrefix );
	}
}
