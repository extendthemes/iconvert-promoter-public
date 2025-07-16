import debounce from 'lodash.debounce';
(function ($) {
	if (!$.throttle) {
		$.throttle = function (fn, threshhold, scope) {
			threshhold || (threshhold = 250);
			let last, deferTimer;
			return function () {
				const context = scope || this;

				const now = +new Date(),
					args = arguments;
				if (last && now < last + threshhold) {
					// hold on to it
					clearTimeout(deferTimer);
					deferTimer = setTimeout(function () {
						last = now;
						fn.apply(context, args);
					}, threshhold);
				} else {
					last = now;
					fn.apply(context, args);
				}
			};
		};
	}

	if (!$.debounce) {
		$.debounce = debounce;
		// $.debounce = function(func, wait, immediate) {
		//   var timeout;
		//   return function() {
		//     var context = this,
		//       args = arguments;
		//     var later = function() {
		//       timeout = null;
		//       if (!immediate) {
		//         func.apply(context, args);
		//       }
		//     };
		//     var callNow = immediate && !timeout;
		//     clearTimeout(timeout);
		//     timeout = setTimeout(later, wait);
		//     if (callNow) {
		//       func.apply(context, args);
		//     }
		//   };
		// };
	}
	if (!$.event.special.tap) {
		$.event.special.tap = {
			setup(data, namespaces) {
				const $elem = $(this);
				$elem
					.on('touchstart', $.event.special.tap.handler)
					.on('touchmove', $.event.special.tap.handler)
					.on('touchend', $.event.special.tap.handler);
			},

			teardown(namespaces) {
				const $elem = $(this);
				$elem
					.off('touchstart', $.event.special.tap.handler)
					.off('touchmove', $.event.special.tap.handler)
					.off('touchend', $.event.special.tap.handler);
			},

			handler(event) {
				const $elem = $(this);
				$elem.data(event.type, 1);
				if (event.type === 'touchend' && !$elem.data('touchmove')) {
					event.type = 'tap';
					$.event.dispatch.call(this, event);
				} else if ($elem.data('touchend')) {
					$elem.removeData('touchstart touchmove touchend');
				}
			},
		};
	}

	//is not supported on ie
	if (!$.fn.respondToVisibility) {
		$.fn.respondToVisibility = function (callback) {
			//check for ie
			if (
				!('IntersectionObserver' in window) ||
				!('IntersectionObserverEntry' in window) ||
				!(
					'intersectionRatio' in
					window.IntersectionObserverEntry.prototype
				)
			) {
				return null;
			}

			const observer = new IntersectionObserver((entries, observer) => {
				entries.forEach((entry) => {
					callback(entry.intersectionRatio > 0);
				});
			});
			observer.observe(this.get(0));
			return observer;
		};
	}
})(window.jQuery);
