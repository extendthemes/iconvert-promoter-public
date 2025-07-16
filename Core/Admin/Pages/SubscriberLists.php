<?php

namespace CSPromo\Core\Admin\Pages;

use CSPromo\Core\PostTypes\PromoPopups;
use CSPromo\Core\Traits\HasTemplate;

class SubscriberLists {
	use HasTemplate;

	public function __construct() {
		self::$_layout = '_layout_subscribers';
	}


	public function render() {

		self::templateWithLayout( 'pages/subscriber-lists/list', array( 'popups' => PromoPopups::all() ) );
	}
}
