<?php
namespace KPromo;

use KPromo\Core\Utils;

function kubio_get_shapes_css() {
	$shapes = array(
		'circles',
		'10degree-stripes',
		'rounded-squares-blue',
		'many-rounded-squares-blue',
		'two-circles',
		'circles-2',
		'circles-3',
		'circles-gradient',
		'circles-white-gradient',
		'waves',
		'waves-inverted',
		'dots',
		'left-tilted-lines',
		'right-tilted-lines',
		'right-tilted-strips',
		'doodle',
		'falling-stars',
		'poly1',
		'poly2',
		'wavy-lines',
	);
	$css    = '';
	$url    = plugin_dir_url( __FILE__ );

	$shapes_prefix_selector = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/kubio_get_shapes_css/shapes_prefix_selector' ), '' );
	foreach ( $shapes as $shape ) {
		$css .= "$shapes_prefix_selector .kubio-shape-{$shape}{background-image:url('{$url}header-shapes/{$shape}.png')}";
	}

	return $css;
}
