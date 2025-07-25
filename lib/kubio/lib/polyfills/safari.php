<?php
namespace KPromo;

use KPromo\Core\Utils;
use Wolfcast\BrowserDetection;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function kubio_safari_gap_fallback() {
	$browser    = new BrowserDetection();
	$version    = $browser->getVersion();
	$os_version = $browser->getPlatformVersion( true );

	$is_safari_without_gap_support = false;

	// because every browser on iOS is actually Safari we just check for the iOS version
	if ( $browser->getPlatform() === BrowserDetection::PLATFORM_IOS && version_compare( $os_version, '14.5', '<' ) ) {
			$is_safari_without_gap_support = true;
	}

	if ( $browser->getPlatform() === BrowserDetection::PLATFORM_MACINTOSH && $browser->getName() === BrowserDetection::BROWSER_SAFARI && $browser->compareVersions( $version, '14' ) <= 1 ) {
		$is_safari_without_gap_support = true;
	}

	if ( $is_safari_without_gap_support ) {
		// we add this script without enqueuing it, because we want to run it as early as possible
		// to avoid any layout shifts caused by the gap fallback
		add_action(
			'wp_head',
			function () {
				?>
			<script>
				(function(){
					var flex = document.createElement('div');
					flex.style.display = 'flex';
					flex.style.flexDirection = 'column';
					flex.style.rowGap = '1px';

					// create two, elements inside it
					flex.appendChild(document.createElement('div'));
					flex.appendChild(document.createElement('div'));

					// append to the DOM (needed to obtain scrollHeight)
					document.documentElement.appendChild(flex);
					var isSupported = flex.scrollHeight === 1; // flex container should be 1px high from the row-gap
					flex.parentNode.removeChild(flex);

					if(!isSupported){
						// console.warn('KPromo - Browser does not support flex gap ');
						document.documentElement.classList.add('kubio-enable-gap-fallback');
					}
				})();
			</script>
				<?php
			},
			5
		);
	}

	if ( $browser->getPlatform() === BrowserDetection::PLATFORM_IOS || $browser->getPlatform() === BrowserDetection::PLATFORM_MACINTOSH ) {
		add_action(
			'wp_head',
			function () {
				?>
					<script>
						(function(){
							var docEL = document.documentElement;
							var style = docEL.style;
							if (!("backgroundAttachment" in style)) return false;
							var oldValue = style.backgroundAttachment;
							style.backgroundAttachment = "fixed";
							var isSupported = (style.backgroundAttachment === "fixed");
							style.backgroundAttachment = oldValue;

							if(navigator.userAgent.toLowerCase().indexOf('mac') !== -1 && navigator.maxTouchPoints){
								isSupported = false;
							}

							if(!isSupported){
								console.warn('KPromo - Browser does not support attachment fix');
								document.documentElement.classList.add('kubio-attachment-fixed-support-fallback');
							}
						})()
					</script>

				<?php
			},
			5
		);
	}
}
Utils::onlyRunOnceForAllKubio( 'init', 'kubio_safari_gap_fallback' );
add_action( 'init', __NAMESPACE__ . '\\kubio_safari_gap_fallback' );
