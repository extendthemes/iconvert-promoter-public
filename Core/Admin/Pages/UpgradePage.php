<?php

namespace CSPromo\Core\Admin\Pages;

use CSPromo\Core\Traits\HasTemplate;

use function KPromo\kubio_get_site_url_for;

class UpgradePage {

	use HasTemplate;

	public function __construct() {
		self::$_layout = '_layout_upgrade_page';
	}


	public function index() {

		self::templateWithLayout(
			'blank',
			array(
				'contact_url' => kubio_get_site_url_for( 'contact_url' ),
				'upgrade_url' => kubio_get_site_url_for( 'upgrade_url' ),
			)
		);
	}
}
