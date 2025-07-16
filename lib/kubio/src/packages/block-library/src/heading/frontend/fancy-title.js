(function ($, Colibri) {
	const className = 'fancy-title';

	const Component = function (element, options) {
		this.namespace = className;
		this.defaults = {
			typeAnimationDurationIn: 0.1,
			typeAnimationDurationOut: 0.1,
			animationDuration: 1,
		};
		// Parent Constructor
		Colibri.apply(this, arguments);

		// Initialization
		this.start();
	};

	Component.prototype = {
		start() {
			if (this.opts.typeAnimation !== 'type') {
				jQuery(this.$element).animatedHeadline({
					animationType: this.opts.typeAnimation,
					animationDelay: this.opts.animationDuration * 1000,
				});
			} else if (!this.isIE()) {
				const id = jQuery(this.$element).attr('fancy-id');
				const strings = this.opts.rotatingWords.split('\n');
				strings.unshift(this.opts.word);
				const inDuration = this.opts.typeAnimationDurationIn * 1000;
				const outDuration = this.opts.typeAnimationDurationOut * 1000;
				const options = {
					strings,
					typeSpeed: inDuration,
					backSpeed: outDuration,
					contentType: 'html',
					smartBackspace: false,
					loop: true,
				};

				// empty the element before starting animation
				this.$element.empty();
				const typed = new Typed(this.$element[0], options);
			}
		},
		isIE() {
			const ua = navigator.userAgent;
			/* MSIE used to detect old browsers and Trident used to newer ones*/
			const is_ie =
				ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
			return is_ie;
		},
	};

	Component.inherits(Colibri);
	Colibri[className] = Component;
	Colibri.Plugin.create(className);
	Colibri.Plugin.autoload(className);
})(jQuery, CSPROMO);
