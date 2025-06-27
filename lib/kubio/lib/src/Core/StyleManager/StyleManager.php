<?php

namespace KPromo\Core\StyleManager;

use KPromo\Config;
use KPromo\Core\LodashBasic;
use KPromo\Core\Utils;

use function array_merge;

class StyleManager {

	private static $instance;
	private $styles = array(
		'shared'  => array(),
		'local'   => array(),
		'dynamic' => array(),
		'global'  => array(),
	);

	private $style_join = array(
		'new_line' => '',
		'tab'      => '',
	);

	private $fonts               = array();
	private $window_font_weights = array( '400', '700', '400italic', '700italic' );

	public function __construct() {
		if ( Utils::isDebug() ) {
			$this->style_join = array(
				'new_line' => "\n",
				'tab'      => "\t",
			);

		}
	}

	public function registerFonts( $family, $weights = array() ) {

		if ( $family == null && ! empty( $weights ) ) {
			$this->window_font_weights = array_unique( array_merge( $this->window_font_weights, $weights ) );
			return;
		}

		if ( ! isset( $this->fonts[ $family ] ) ) {
			$this->fonts[ $family ] = array();
		}

		$this->fonts[ $family ] = array_unique( array_merge( $this->fonts[ $family ], $weights ) );
	}

	public function getFonts() {
		$result = array();

		foreach ( $this->fonts as $font => $weights ) {
			$next_weights    = LodashBasic::uniq( array_merge( $weights, $this->window_font_weights ) );
			$result[ $font ] = $next_weights;
		}

		return $result;
	}

	static function withCustomStyleManager( $callback ) {
		$initial_instance = self::$instance;
		self::$instance   = new self();
		call_user_func( $callback );
		$style          = self::$instance->render();
		self::$instance = $initial_instance;
		return $style;
	}

	/**
	 * Get the singleton instance of StyleManager.
	 *
	 * @return StyleManager
	 */
	static function getInstance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	function registerBlockStyle( $styleByType ) {
		foreach ( $styleByType as $type => $styleByMedia ) {
			foreach ( $styleByMedia as $media => $styles ) {
				$path = array( $type, $media );
				LodashBasic::set( $this->styles, $path, array_merge( LodashBasic::get( $this->styles, $path, array() ), $styles ) );
			}
		}
	}

	public function render() {
		$renderByMedia = array();
		foreach ( $this->styles as $styleByMedia ) {
			foreach ( $styleByMedia as $media => $styles ) {
				if ( ! isset( $renderByMedia[ $media ] ) ) {
					$renderByMedia[ $media ] = array();
				}
				$renderByMedia[ $media ] = array_merge( $renderByMedia[ $media ], $styles );
			}
		}

		$render = '';

		$devices    = LodashBasic::mapValues( Config::value( 'medias' ), 'id' );
		$mediasById = Config::mediasById();

		$device_rules = array();

		foreach ( $devices as $device ) {
			if ( isset( $renderByMedia[ $device ] ) ) {
				$query = LodashBasic::get( $mediasById, array( $device, 'query' ), false );
				$rules = join( $this->style_join['new_line'], $renderByMedia[ $device ] );
				if ( $query ) {
					$device_rules[] = $query . "{$this->style_join['tab']}{{$this->style_join['new_line']}{$rules}{$this->style_join['new_line']}}";
				} else {
					$device_rules[] = $rules;
				}
			}
		}

		$render .= join( '', $device_rules );

		return $render;
	}
}
