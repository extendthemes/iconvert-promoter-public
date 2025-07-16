<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';

define( 'ICONVERTPR_KUBIO_NS', __NAMESPACE__ . '\\KPromo' );
define( 'ICONVERTPR_BUILDER_NS', __NAMESPACE__ . '\\CsPromoKubio' );

\CsPromoKubio\Init::load( __FILE__ );
