const linksDefineSamePage = (
	link1,
	link2,
	{ compareQuery = false, compareHash = false } = {}
) => {
	if (!link1 || !link2) {
		return true;
	}
	let url1 = null;
	let url2 = null;
	try {
		url1 = new URL(link1);
		url2 = new URL(link2);
	} catch (e) {
		return false;
	}
	let result = url1.origin === url2.origin && url1.pathname === url2.pathname;

	if (compareQuery) {
		result = result && url1.search === url2.search;
	}

	if (compareHash) {
		result = result && url1.hash === url2.hash;
	}

	return result;
};

(function ($) {
	function isInsideKubioEditor() {
		return window.isKubioBlockEditor || top?.wp?.blockEditor;
	}

	if (window.location.hash === '#page-top') {
		changeUrlHash('', 5);
	}

	const __toCheckOnScroll = {
		items: {},
		eachCategory(callback) {
			for (const id in this.items) {
				if (!this.items.hasOwnProperty(id)) {
					continue;
				}

				callback(this.items[id]);
			}
		},
		addItem(id, item) {
			if (!this.items[id]) {
				this.items[id] = [];
			}

			this.items[id].push(item);
		},
		all() {
			let result = [];

			for (const id in this.items) {
				if (!this.items.hasOwnProperty(id)) {
					continue;
				}

				result = result.concat(this.items[id]);
			}

			return result;
		},
	};
	let __alreadyScrolling = false;

	function getScrollToValue(elData) {
		const offset = !isNaN(parseFloat(elData.options.offset))
			? elData.options.offset
			: elData.options.offset.call(elData.target);
		const scrollToValue =
			elData.target.offset().top - offset - $('body').offset().top;

		return scrollToValue;
	}

	function changeUrlHash(hash, timeout) {
		if (
			hash === location.hash.replace('#', '') ||
			(hash === 'page-top' && '' === location.hash.replace('#', ''))
		) {
			return;
		}

		setTimeout(function () {
			if (hash) {
				if (hash === 'page-top') {
					hash = ' ';
				} else {
					hash = '#' + hash;
				}
			} else {
				hash = ' ';
			}
			if (history && history.replaceState) {
				history.replaceState({}, '', hash);
			}
		}, timeout || 100);
		/* safari issue fixed by throtteling the event */
	}

	function scrollItem(elData) {
		if (__alreadyScrolling) {
			return;
		}

		__alreadyScrolling = true;
		const scrollToValue = getScrollToValue(elData);

		$('html, body').animate(
			{ scrollTop: scrollToValue },
			{
				easing: 'linear',
				complete() {
					// check for any updates
					const scrollToValue = getScrollToValue(elData);
					$('html, body').animate(
						{ scrollTop: scrollToValue },
						{
							easing: 'linear',
							duration: 100,
							complete() {
								__alreadyScrolling = false;
								changeUrlHash(elData.id, 5);
							},
						}
					);
				},
			}
		);
	}

	function getPageBaseUrl() {
		return [location.protocol, '//', location.host, location.pathname].join(
			''
		);
	}

	function fallbackUrlParse(url) {
		return url.split('?')[0].split('#')[0];
	}

	function getABaseUrl(element) {
		const href = jQuery(element)[0].href || '';
		let url = '#';

		try {
			const _url = new window.URL(href);
			url = [_url.protocol, '//', _url.host, _url.pathname].join('');
		} catch (e) {
			url = fallbackUrlParse(href);
		}

		return url;
	}

	function getTargetForEl(element) {
		let targetId = (element.attr('href') || '').split('#').pop(),
			hrefBase = getABaseUrl(element),
			target = null,
			pageURL = getPageBaseUrl();

		if (hrefBase.length && hrefBase !== pageURL) {
			return target;
		}

		if (targetId.trim().length) {
			try {
				target = $('[id="' + targetId + '"]');
			} catch (e) {}
		}

		if (target && target.length) {
			return target;
		}

		return null;
	}

	$.fn.smoothScrollAnchor = function (options) {
		if (isInsideKubioEditor()) {
			return;
		}

		const elements = $(this);

		options = jQuery.extend(
			{
				offset() {
					const $fixed = $('.h-navigation_sticky');
					if ($fixed.length) {
						return $fixed[0].getBoundingClientRect().height;
					}

					return 0;
				},
			},
			options
		);

		elements.each(function () {
			const element = $(this);

			//if the target options is not set or the href is not for the same page don't add smoothscroll
			if (
				!options.target &&
				!linksDefineSamePage(document.location.href, this.href)
			) {
				return;
			}

			const target = options.target || getTargetForEl(element);
			if (target && target.length && !target.attr('skip-smooth-scroll')) {
				const targetId = target.attr('id');
				let targetSel = null;
				if (targetId) {
					targetSel = '[id="' + targetId.trim() + '"]';
				}
				const elData = {
					element,
					options,
					target,
					targetSel: options.targetSel || targetSel,
					id: (target.attr('id') || '').trim(),
				};

				element
					.off('click.smooth-scroll tap.smooth-scroll')
					.on('click.smooth-scroll tap.smooth-scroll', function (
						event
					) {
						if (
							$(this).data('skip-smooth-scroll') ||
							$(event.target).data('skip-smooth-scroll')
						) {
							return;
						}

						event.preventDefault();

						if (!$(this).data('allow-propagation')) {
							event.stopPropagation();
						}

						scrollItem(elData);

						if (elData.options.clickCallback) {
							elData.options.clickCallback.call(this, event);
						}
					});
			}
		});
	};

	$.fn.kubioScrollSpy = function (options) {
		if (isInsideKubioEditor()) {
			return;
		}

		const elements = $(this);
		const id = 'spy-' + parseInt(Date.now() * Math.random());

		elements.each(function () {
			const element = $(this);
			const settings = jQuery.extend(
				{
					onChange() {},
					onLeave() {},
					clickCallback() {},
					smoothScrollAnchor: false,
					offset: 0,
				},
				options
			);

			if (
				element.is('a') &&
				(element.attr('href') || '').indexOf('#') !== -1 &&
				(element.attr('href') || '').replace('#', '').length
			) {
				const target = getTargetForEl(element);

				if (target && !target.attr('skip-scroll-spy')) {
					const elData = {
						element,
						options: settings,
						target,
						targetSel: '[id="' + target.attr('id').trim() + '"]',
						id: target.attr('id').trim(),
					};
					__toCheckOnScroll.addItem(id, elData);
					element.data('scrollSpy', elData);

					if (options.smoothScrollAnchor) {
						element.smoothScrollAnchor(options);
					}
				}
			}
		});
	};

	function update() {
		__toCheckOnScroll.eachCategory(function (items) {
			const ordered = items.sort(function (itemA, itemB) {
				return itemA.target.offset().top - itemB.target.offset().top;
			});
			const lastItem = ordered
				.filter(function (item) {
					const scrollY =
						window.pageYOffset !== undefined
							? window.pageYOffset
							: (
									document.documentElement ||
									document.body.parentNode ||
									document.body
							  ).scrollTop;
					return (
						item.target.offset().top <=
						scrollY + window.innerHeight * 0.5
					);
				})
				.pop();
			ordered.forEach(function (item) {
				if (lastItem && item.element.is(lastItem.element)) {
					changeUrlHash(item.id, 5);
					item.options.onChange.call(item.element);
				} else {
					item.options.onLeave.call(item.element);
				}
			});
		});
	}

	function goToCurrentHash() {
		const hash = window.location.hash.replace('#', '');
		const currentItem = __toCheckOnScroll.all().filter(function (item) {
			return (
				item.targetSel ===
				'[id="' + decodeURIComponent(hash).trim() + '"]'
			);
		});

		if (
			!(
				document.readyState === 'complete' ||
				document.readyState === 'interactive'
			)
		) {
			$(window).on('load', function () {
				if (currentItem.length) {
					scrollItem(currentItem[0]);
				}
				update();
			});
		}
	}

	if (!isInsideKubioEditor()) {
		$(window).on('scroll', update);

		$(window).on('smoothscroll.update', update);

		$(window).on('smoothscroll.update', goToCurrentHash);

		$(goToCurrentHash);
	}
})(jQuery);
