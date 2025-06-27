<?php

namespace KPromo;

require_once __DIR__ . '/save-template-parts-filter.php';
require_once __DIR__ . '/page-templates.php';
require_once __DIR__ . '/entity.php';
require_once __DIR__ . '/typekit.php';
require_once __DIR__ . '/get-page-query.php';
require_once __DIR__ . '/get-post-content.php';
require_once __DIR__ . '/get-post-styles.php';
require_once __DIR__ . '/get-classic-page-template.php';


if ( ! defined( 'KUBIO_VERSION' ) ) {
	require_once __DIR__ . '/get-page-title.php';
	require_once __DIR__ . '/get-body-class.php';
}
