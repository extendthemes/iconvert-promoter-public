<?php
namespace CSPromo\Core\Admin\Actions\Plugin;
class Integrate {

	public static function run() {
		/**
		 * The code that runs during plugin activation.
		 * This action is documented in includes/Activator.php
		 */
		register_activation_hook( ICONVERTPR_PAGE_FILE, array( Activator::class, 'install' ) );

		/**
		 * The code that runs during plugin deactivation.
		 * This action is documented in includes/class-iconvert-wordpress-integration-deactivator.php
		 */
		register_deactivation_hook( ICONVERTPR_PAGE_FILE, array( Deactivator::class, 'uninstall' ) );
	}
}
