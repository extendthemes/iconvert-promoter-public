(function ($, Colibri) {
	const className = 'masonry';

	const Component = function (element, options) {
		this.namespace = className;
		this.defaults = {};
		// Parent Constructor
		Colibri.apply(this, arguments);
		this.addResizeObserver();
		this.bindedRestart = $.debounce(this.restart.bind(this), 50);
		if (this.showMasonry()) {
			this.start();
		}
	};

	function attributeExistsAndFalse($node, attrName) {
		if (
			$node[0].hasAttribute(attrName) &&
			$node.attr(attrName) !== 'true'
		) {
			return true;
		}
	}

	Component.prototype = {
		start() {
			this.stop();
			let masonry = this.$element;

			if (!this.$element.parent().length) {
				this.stop(); // stop for elements not attached to dom
			}

			if (this.settings.targetSelector) {
				masonry = this.$element
					.find(this.settings.targetSelector)
					.first();
			}

			this.$masonry = masonry;

			if (!this.$masonry.masonry) {
				return;
			}

			this.$masonry.masonry({
				itemSelector: this.settings.itemSelector,
				columnWidth: this.settings.columnWidth,
				percentPosition: true,
			});
			this.addEventListeners();
			(function () {
				const images = masonry.find('img');
				let loadedImages = 0;
				let completed = 0;

				function imageLoaded() {
					loadedImages++;
					if (images.length === loadedImages) {
						try {
							masonry.data().masonry.layout();
						} catch (e) {
							console.error(e);
						}
					}
				}

				images.each(function () {
					if (this.complete) {
						completed++;
						imageLoaded();
					} else {
						$(this).on('load', imageLoaded);
						$(this).on('error', imageLoaded);
					}
				});
				if (images.length !== completed) {
					if (document.readyState == 'complete') {
						setTimeout(function () {
							masonry.data().masonry.layout();
						}, 10);
					}
				}

				$(window).on('load', function () {
					masonry.data().masonry.layout();
				});
			})();
		},

		showMasonry() {
			if (
				attributeExistsAndFalse(this.$element, 'data-show-masonry') ||
				attributeExistsAndFalse(this.$element, 'show-masonry')
			) {
				return false;
			}
			return this.settings.enabled;
		},

		stop() {
			this.removeEventListeners();
			try {
				if (this.$masonry.data().masonry) {
					this.$masonry.masonry('destroy');
				}
			} catch (e) {}
		},
		restart() {
			this.stop();
			this.start();
		},
		addEventListeners() {
			this.addResizeListener();
			this.$element.on('colibriContainerOpened', this.bindedRestart);
		},
		removeEventListeners() {
			this.removeResizeListener();
			this.$element.off('colibriContainerOpened', this.bindedRestart);
		},
		addResizeListener() {
			this.resizeCount = 0;

			try {
				this.resizeObserver.observe(this.$masonry.children().get(0));
			} catch (e) {}
		},
		removeResizeListener() {
			this?.resizeObserver?.disconnect();
		},
		addResizeObserver() {
			const self = this;
			this.resizeObserver = new ResizeObserver((entries) => {
				if (self.resizeCount === 0) {
					self.resizeCount++;
					return;
				}
				self.restart();
			});
		},
		loadImages() {},
	};

	Component.inherits(Colibri);
	Colibri[className] = Component;
	Colibri.Plugin.create(className);
	Colibri.Plugin.autoload(className);
})(jQuery, CSPROMO);
