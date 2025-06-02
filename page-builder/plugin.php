<?php

require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';

define( 'CSKubio', __NAMESPACE__ . '\\KPromo' );
define( 'CSPromoBuilder', __NAMESPACE__ . '\\CsPromoKubio' );

\CsPromoKubio\Init::load( __FILE__ );
