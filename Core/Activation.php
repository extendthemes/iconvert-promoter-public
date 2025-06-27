<?php
namespace CSPromo\Core;

use CSPromo\Core\PostTypes\PromoPopupsSetup;

class Activation {

	public function __construct() {
		register_activation_hook( ICONVERTPR_PAGE_FILE, array( $this, 'onActivate' ) );
	}

	public function onActivate() {
		PromoPopupsSetup::register();
		flush_rewrite_rules();
	}
}
