<?php

namespace KPromo\Core\StyleManager\Props;

use KPromo\Config;
use KPromo\Core\LodashBasic;

class PropertyBase {

	public $value;
	public $name = '';
	public $_config;
	public $merged = array();


	public function __construct( $name = '' ) {
		$this->name = $name;
	}

	public function parse( $value, $options ) {
		return $value;
	}

	public function valueWithDefault( $value ) {
		$defaultValue = $this->getDefaultValue();
		return LodashBasic::merge( array(), $defaultValue, $value );
	}

	public function getDefaultValue() {
		return $this->config( 'default' );
	}

	public function config( $path ) {
		return Config::value( 'props.' . $this->name . '.' . $path );
	}
}
