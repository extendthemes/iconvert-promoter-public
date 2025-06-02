import Colibri from './colibri';

export default class ColibriFrontComponent {
	static componentName() {
		throw new TypeError('name getter should be implemented');
	}

	constructor(element, options) {
		this.$ = jQuery;
		this.namespace = this.constructor.componentName();
		this.utils = new Colibri.Utils();
		this.detect = new Colibri.Detect();
		this.init();
		Colibri.apply(this, arguments);
		this.start();

		if (this.isCustomizerPreview()) {
			this.wpCustomize(wp.customize);
		}
		return this;
	}

	init() {}

	isCustomizerPreview() {
		return Colibri.isCustomizerPreview();
	}

	wpCustomize(api) {}

	wpSettingBind(setting_id, callback) {
		window.wp.customize(setting_id, function (setting) {
			setting.bind(callback);
		});
	}

	updateData(data) {
		this.opts = jQuery.extend({}, this.opts, data);
		this.restart();
	}
	restart() {}
	start() {}
}
