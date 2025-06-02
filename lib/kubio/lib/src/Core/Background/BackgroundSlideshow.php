<?php

namespace KPromo\Core\Background;

use KPromo\Core\Element;
use KPromo\Core\ElementBase;
use KPromo\Core\LodashBasic;
use KPromo\Core\StyleManager\ParserUtils;
use KPromo\Core\Utils;

use function array_merge;

class BackgroundSlideshow extends ElementBase {

	function __construct( $value ) {
		parent::__construct( $value, BackgroundDefaults::getDefaultSlideShow() );
	}

	function getMergedValue() {
		if ( ! $this->_merged ) {
			$this->_merged = LodashBasic::mergeSkipSeqArray( $this->default, $this->value );
		}
		return $this->_merged;
	}


	function __toString() {
		$slides       = $this->get( 'slides' );
		$duration_str = ParserUtils::toValueUnitString( $this->get( 'duration' ) );
		$speed_str    = ParserUtils::toValueUnitString( $this->get( 'speed' ) );

		$slides_els = array();

		foreach ( $slides as $index => $slide ) {
			$slides_els[] = new Element(
				Element::DIV,
				array(
					'style'     => $this->getSlideStyle( $slide, $index ),
					'className' => array( 'slideshow-image' ),
				)
			);
		}

		$slideshow = Utils::useJSComponentProps(
			'slideshow',
			array(
				'duration' => $duration_str,
				'speed'    => $speed_str,
			)
		);
		return new Element(
			Element::DIV,
			array_merge(
				$slideshow,
				array(
					'className' => array(
						'background-layer',
						'cspromo-slideshow',
					),
				)
			),
			$slides_els
		) . '';
	}

	function getSlideStyle( $slide, $index ) {
		$url   = $slide['url'];
		$style = array(
			'backgroundImage' => "url(\"$url\")",
			'zIndex'          => $index,
		);
		return $style;
	}
}
