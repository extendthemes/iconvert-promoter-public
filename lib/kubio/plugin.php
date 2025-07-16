<?php

namespace KPromo;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


if ( defined( __NAMESPACE__ . '\\KUBIO_VERSION' ) ) {
	return;
}

define( __NAMESPACE__ . '\\KUBIO_VERSION', '@@buildversion@@' );
define( __NAMESPACE__ . '\\KUBIO_BUILD_NUMBER', '@@buildnumber@@' );

define( __NAMESPACE__ . '\\KUBIO_ENTRY_FILE', __FILE__ );
define( __NAMESPACE__ . '\\KUBIO_ROOT_DIR', plugin_dir_path( __FILE__ ) );
define( __NAMESPACE__ . '\\KUBIO_BUILD_DIR', plugin_dir_path( __FILE__ ) . '/build' );
define( __NAMESPACE__ . '\\KUBIO_LOGO_URL', plugins_url( '/static/kubio-logo.svg', __FILE__ ) );
define( __NAMESPACE__ . '\\KUBIO_LOGO_PATH', plugin_dir_path( __FILE__ ) . '/static/kubio-logo.svg' );
define( __NAMESPACE__ . '\\KUBIO_LOGO_SVG', file_get_contents( KUBIO_LOGO_PATH ) );

if ( ! defined( __NAMESPACE__ . '\\KUBIO_MINIMUM_WP_VERSION' ) ) {
	define( __NAMESPACE__ . '\\KUBIO_MINIMUM_WP_VERSION', '5.9' );
}

define( __NAMESPACE__ . '\\KUBIO_SLUG', preg_replace( '#/(.*)#', '', plugin_basename( __FILE__ ) ) );

if ( ! function_exists( __NAMESPACE__ . '\\kubio_url' ) ) {
	function kubio_url( $path = '' ) {
		return plugins_url( $path, __FILE__ );
	}
}

/**
 * @var \Composer\Autoload\ClassLoader $kubio_autoloader ;
 */

require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';
\KPromo\Core\Utils::setAutoloader( $GLOBALS['iconvertpr_autoloader'] );

require_once 'lib/init.php';
