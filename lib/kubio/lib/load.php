<?php

namespace KPromo;


use KPromo\GoogleFontsLocalLoader;


require_once __DIR__ . '/env.php';
require_once __DIR__ . '/filters.php';
require_once __DIR__ . '/preview/index.php';


require_once __DIR__ . '/global-data.php';
require_once __DIR__ . '/shapes/index.php';
require_once __DIR__ . '/api/index.php';
require_once __DIR__ . '/editor-assets.php';
require_once __DIR__ . '/frontend.php';
require_once __DIR__ . '/kubio-block-library.php';
require_once __DIR__ . '/kubio-editor.php';



function kubio_get_iframe_loader( $props = array() ) {
	$params = array_merge(
		array(
			'color'    => '',
			'size'     => '40px',
			'bg-color' => 'transparent',
			'message'  => '',
			'url'      => kubio_url( '/static/kubio-iframe-loader.html' ),
		),
		$props
	);

	foreach ( $params as $key => $value ) {
		if ( $key !== 'url' ) {
			$params[ $key ] = urlencode( $value );
		}
	}
	$query_params = $params;
	unset( $query_params['url'] );
	$url = add_query_arg( $params, $params['url'] );

	return sprintf( '<iframe style="border:none;pointer-events:none;user-select:none;display:block" allowtransparency="true" width="%2$s" height="%2$s" src="%1$s"></iframe>', $url, $params['size'] );
}


GoogleFontsLocalLoader::registerFontResolver();
