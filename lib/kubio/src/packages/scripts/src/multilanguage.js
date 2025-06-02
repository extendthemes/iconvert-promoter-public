(function ($, Colibri) {
	$(function () {
		const $flagsSwitcher = $('.kubio-language-switcher__flags');
		const $currentLanguage = $flagsSwitcher.find('li a');
		if ($flagsSwitcher.length === 0) {
			return;
		}
		const debounceClick = $.throttle((event) => {
			if (!$flagsSwitcher.hasClass('hover')) {
				event.preventDefault();
				event.stopImmediatePropagation();
				$flagsSwitcher.addClass('hover');
			} else {
				event.stopImmediatePropagation();
			}
		}, 500);

		$(window).on('tap', () => {
			if ($flagsSwitcher.hasClass('hover')) {
				$flagsSwitcher.removeClass('hover');
			}
		});
		$currentLanguage.on('tap', debounceClick);
	});
})(jQuery, CSPROMO);
