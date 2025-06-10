<?php

/**
 * Plugin Name: @@plugin-name@@
 * Description: A powerful and dynamic WordPress popup toolkit to grow your email list, retain customers, and boost conversions.
 * Version: @@buildversion@@
 * Author: ExtendThemes
 * Text Domain: iconvert-promoter
 * License: GPL-3.0+
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Requires PHP: 7.4
 * Requires at least: 6.5
 */

use CSPromo\Core\Activation;
use CSPromo\Core\Frontend\Application;
use CSPromo\Core\Frontend\API\CampaignsAPI;
use CSPromo\Core\Frontend\API\EmailListsAPI;
use CSPromo\Core\PostTypes\PromoPopupsSetup;
use CSPromo\Core\PostTypes\PromoPopupTemplate;
use CSPromo\Core\Admin\Application as AdminApplication;
use CSPromo\Core\Frontend\Actions\Ajax\AnalyticsAjaxActions;
use CSPromo\Core\Frontend\Actions\Ajax\FrontendPromoLoadActions;




// skip loading free version if the iConvert Promoter PRO is active
if (! function_exists('iconvert_promoter_is_free_and_pro_already_active')) {

	function iconvert_promoter_is_free_and_pro_already_active($base_path)
	{
		$free_plugin_base_name = "iconvert-promoter/iconvert-promo-plugin.php";
		$pro_plugin_base_name = "iconvert-promoter-pro/iconvert-promo-plugin.php";
		
		$current_basename = plugin_basename($base_path);
		$is_free     = $current_basename === $free_plugin_base_name;

		$pro_is_active = false;
		if ($is_free) {
			$active_plugins        = get_option('active_plugins');
			$pro_is_active = in_array($pro_plugin_base_name, $active_plugins);
		}

		return $is_free && $pro_is_active;
	}
}

if (iconvert_promoter_is_free_and_pro_already_active(__FILE__)) {
	return;
}

if ( defined( 'IC_PROMO_VERSION' ) ) {
	return;
}

define('IC_PROMO_VERSION', '1.0');


$GLOBALS['ic_promo_autoloader'] = require_once __DIR__ . '/vendor/autoload.php';

define('IC_PROMO_PATH', plugin_dir_path(__FILE__));
define('IC_PROMO_URL', plugin_dir_url(__FILE__));
define('IC_PROMO_PAGE_FILE', __FILE__);
define('IC_PROMO_PLUGIN_NAME', 'iConvert Promoter');
define( 'IC_PROMO_BUILD_NUMBER', '7' );

define('IC_PROMO_PAGE_ID', 'promoter');
define('IC_PROMO_PAGE_SUBSCRIBERS', 'promoter-subscribers');
define('IC_PROMO_PAGE_INTEGRATIONS', 'promoter-integrations');
define('IC_PROMO_PAGE_UPGRADE', 'promoter-upgrade');
define('CSPROMO_KUBIO_ROOT_DIR', __DIR__ . '/lib/kubio');

if (!defined('IC_PROMO_SESSION_DURATION')) {
	define('IC_PROMO_SESSION_DURATION', 20 * MINUTE_IN_SECONDS);
}

if(!defined('IC_PROMO_SUBSCRIBE_RATE_LIMIT_REQUEST')) {
	define('IC_PROMO_SUBSCRIBE_RATE_LIMIT_REQUEST', 2);
}

if(!defined('IC_PROMO_ANALYTICS_RATE_LIMIT_REQUEST')) {
	define('IC_PROMO_ANALYTICS_RATE_LIMIT_REQUEST', 10);
}

if(!defined('IC_PROMO_RATE_LIMIT_TIME')) {
	define('IC_PROMO_RATE_LIMIT_TIME', 60);
}


if(!defined('IC_PROMO_RATE_LIMIT_CLEANUP_INTERVAL')) {
	define('IC_PROMO_RATE_LIMIT_CLEANUP_INTERVAL', IC_PROMO_RATE_LIMIT_TIME + 10);
}

if(!defined('IC_USE_UNIQUE_STORAGE_KEY')) {
	define('IC_USE_UNIQUE_STORAGE_KEY', true);
}

require_once __DIR__ . '/page-builder/plugin.php';

//HELPERS
require_once(IC_PROMO_PATH . '/Core/Helpers/FlashMessages.php');
require_once(IC_PROMO_PATH . '/Core/Helpers/Registry.php');
require_once(IC_PROMO_PATH . '/Core/Helpers/URL.php');
require_once(IC_PROMO_PATH . '/Core/Helpers/SinglePopup.php');


new Activation();

//register the post type
new PromoPopupsSetup();



new EmailListsAPI();
new CampaignsAPI();


// ajax actions
new AnalyticsAjaxActions();
new FrontendPromoLoadActions();



if ( ! (defined( 'IC_PROMO_SKIP_PRO' ) && IC_PROMO_SKIP_PRO) && file_exists( IC_PROMO_PATH . '/pro/index.php' ) ) {
	require_once IC_PROMO_PATH . '/pro/index.php';
}

if (is_admin()) {
	// web router for the admin
	require_once(IC_PROMO_PATH . '/admin/routes/web.php');

	//load the admin/private code
	AdminApplication::boot();
} else {
	//load the frontend/public code
	Application::boot();
}

PromoPopupTemplate::load();
