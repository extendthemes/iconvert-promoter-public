import './paraxify/paraxify';

(function ($, Colibri) {
	const className = 'parallax';

	const Component = function (element, options) {
		this.namespace = className;
		this.defaults = {};
		// Parent Constructor
		Colibri.apply(this, arguments);
		// Initialization
		this.start();
	};

	Component.prototype = {
		start() {
			this.isEnabled = this.opts.enabled;
			if (!this.isEnabled) {
				this.stop();
				return;
			}
			if (this.isiOS()) {
				this.$element.addClass('paraxify--ios');
				return;
			}
			if (this.$element[0]) {
				this.paraxify = paraxify(this.$element[0]);
			}
			const self = this;
			this.firstRestart = false;
			this.restartScriptDebounce = $.debounce(function () {
				if (self.firstRestart === false) {
					self.firstRestart = true;
					return;
				}
				self.restart();
			}, 100);
			this._addEventListeners();
		},
		stop() {
			this._removeEventListener();
			if (this.paraxify) {
				this.paraxify.destroy();
				this.paraxify = null;
			}
		},
		isiOS() {
			return (
				(/iPad|iPhone|iPod/.test(navigator.platform) ||
					(navigator.platform === 'MacIntel' &&
						navigator.maxTouchPoints > 1)) &&
				!window.MSStream
			);
		},
		restart() {
			this.stop();
			this.start();
		},
		_addEventListeners() {
			window.addResizeListener(
				this.$element[0],
				this.restartScriptDebounce
			);
		},
		_removeEventListener() {
			window.removeResizeListener(
				this.$element[0],
				this.restartScriptDebounce
			);
		},
	};

	Component.inherits(Colibri);
	Colibri[className] = Component;
	Colibri.Plugin.create(className);
	Colibri.Plugin.autoload(className);
})(jQuery, CSPROMO);
