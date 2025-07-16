(function ($, Colibri) {
	const className = 'link';

	const Component = function (element, options) {
		this.namespace = className;
		this.defaults = {
			href: '',
			target: '_self',
		};
		// Parent Constructor
		Colibri.apply(this, arguments);

		// Initialization
		this.start();
	};

	Component.prototype = {
		start() {
			const self = this;
			if (self.opts.href && !self.opts['data-fancybox']) {
				self.$element.addClass('h-cursor-pointer');
				let eventName = 'mousedown';
				if (self.$element.hasClass('swiper-slide')) {
					eventName = 'click';
				}
				self.$element.on(eventName, function (e) {
					const target = self.opts.target
						? self.opts.target
						: '_self';

					if (e.button === 0) {
						//Left click
						window.open(self.opts.href, target);
					} else if (e.button === 1) {
						//Middle click
						window.open(self.opts.href, '_blank');
					}
				});
			}
		},
		inside() {},
		outside() {},
	};

	Component.inherits(Colibri);
	Colibri[className] = Component;
	Colibri.Plugin.create(className);
	Colibri.Plugin.autoload(className);
})(jQuery, CSPROMO);
