<?php
namespace KPromo;


use KPromo\Core\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function _kubio_gutenberg_check_notice() {
	$pluginName = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/get_plugin_label' ), __( 'Iconvert Promoter', 'iconvert-promoter' ) );
	?>
	<p>
		<?php
			printf(
				esc_html( 'The %1$s plugin is active on this site. This might interfere with the proper functioning of the %2$s plugin. It is recommended to deactivate the %1$s plugin' ),
				'<strong>Gutenberg</strong>',
				'<strong>' . esc_html( $pluginName ) . '</strong>'
			);
		?>
	</p>
	<?php
}

function kubio_add_gutenberg_plugin_notice() {
	include_once ABSPATH . 'wp-admin/includes/plugin.php';
	if ( is_plugin_active( 'gutenberg/gutenberg.php' ) || defined( 'GUTENBERG_VERSION' ) ) {
			kubio_add_dismissable_notice( 'kubio-gutenberg-check-1', __NAMESPACE__ . '\\_kubio_gutenberg_check_notice', 1 * DAY_IN_SECONDS, array(), 'notice-warning' );
	}
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\kubio_add_gutenberg_plugin_notice' );
