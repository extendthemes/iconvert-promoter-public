import * as $ from 'jquery';
export * from './forms';

// // Change Get started menu items
// const menu = $('#adminmenu .toplevel_page_cspromo');
// if (menu.length) {
// 	const queryString = window.location.search;
// 	const urlParams = new URLSearchParams(queryString);
// 	const page = urlParams.get('page');

// 	if (page === 'kubio-get-started') {
// 		const tab = urlParams.get('tab');

// 		if (tab !== null) {
// 			menu.find('li.current').removeClass('current');

// 			if (menu.find("a[href*='tab=" + tab + "']").length) {
// 				menu.find("a[href*='tab=" + tab + "']")
// 					.closest('li')
// 					.addClass('current');
// 			} else {
// 				menu.find('li.wp-first-item').next().addClass('current');
// 			}
// 		}
// 	}

// 	if (menu.find("a[href*='tab=pro-upgrade']").length) {
// 		menu.find("a[href*='tab=pro-upgrade']")
// 			.closest('li')
// 			.addClass('li-pro-upgrade');
// 	}
// }
