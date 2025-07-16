<?php

use CSPromo\Core\Admin\Pages\ListPromos;
use CSPromo\Core\Admin\Pages\EmailLists;
use CSPromo\Core\Admin\Pages\Promos;
use CSPromo\Core\Admin\Pages\TemplatesPage;
use CSPromo\Core\Admin\Pages\EmailListContactsPage;
use CSPromo\Core\Admin\Pages\IntegrationsPage;
use CSPromo\Core\Admin\Pages\UpgradePage;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

$routes = array(
	ICONVERTPR_PAGE_ID           => array(
		'promos.list'  => array( ListPromos::class, 'render' ), // default route
		'promo.create' => array( Promos::class, 'create' ),
		'promo.edit'   => array( Promos::class, 'edit' ),
		'templates'    => array( TemplatesPage::class, 'index' ),
	),
	ICONVERTPR_PAGE_SUBSCRIBERS  => array(
		'subscribers.lists'          => array( EmailLists::class, 'index' ),  // default route
		'subscribers.lists.emails'   => array( EmailListContactsPage::class, 'index' ),
		'subscribers.lists.edit'     => array( EmailLists::class, 'update' ),
		'subscribers.lists.create'   => array( EmailLists::class, 'create' ),
		'subscribers.lists.download' => array( EmailListContactsPage::class, 'download' ),
	),
	ICONVERTPR_PAGE_INTEGRATIONS => array(
		'integrations.index' => array( IntegrationsPage::class, 'index' ),
	),

	ICONVERTPR_PAGE_UPGRADE => array(
		'upgrade.index' => array( UpgradePage::class, 'index' ),
	),
);

iconvertpr_registry_set( 'admin.routes.web', $routes );
