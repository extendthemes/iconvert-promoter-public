<?php

namespace KPromo\Core\GlobalElements;
use KPromo\Core\Element;
use KPromo\Core\LodashBasic;


class Icon extends Element {
	public function __construct( $tag_name, $props = array(), $children = array(), $block = null ) {
		$default_icon = 'font-awesome/star';
		$icon         = LodashBasic::get( $props, 'name', $default_icon );
		if ( ! $icon ) {
			$icon = $default_icon;
		}
		$svg = '';
		if ( $icon && is_string( $icon ) ) {
			$icon_folder_name = explode( '/', $icon );
			$library          = $icon_folder_name[0];
			$icon_name        = str_replace( ' ', '-', trim( $icon_folder_name[1] ) );

			$svg_file = ( \KPromo\KUBIO_ROOT_DIR . 'static/icons/' . sanitize_file_name( $library ) . '/' . $icon_name . '.svg' );
			if ( file_exists( $svg_file ) ) {
				// the $svg_file is a path to the SVG file, not a URL
				// so it is safe to use file_get_contents to read the file content
				$svg = file_get_contents( $svg_file );
			}
		}
		parent::__construct(
			Element::SPAN,
			LodashBasic::merge(
				$props,
				array(
					'className' => array( 'h-svg-icon' ),
				)
			),
			array( $svg ),
			$block
		);
	}

	public function __toString() {
		return parent::__toString();
	}
}
