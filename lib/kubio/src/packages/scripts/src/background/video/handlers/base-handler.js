export default class BaseHandler {
	constructor(element, settings) {
		this.settings = settings;
		this.element = element;
		this.isPlaying = false;

		this.ready();
	}

	ready() {}

	play() {}

	pause() {}

	isPaused() {}

	setVideo(node) {
		node.className = 'kubio-video-background-item';
		this.element.innerHTML = '';
		this.element.appendChild(node);
		this.addResizeBind();
	}

	static test() {
		return false;
	}

	trigger(name) {
		let evt;

		if ('function' === typeof window.Event) {
			evt = new Event(name);
		} else {
			evt = document.createEvent('Event');
			evt.initEvent(name, true, true);
		}

		this.element.dispatchEvent(evt);
	}

	loaded() {
		this.trigger('video-bg-loaded');
	}

	addResizeBind() {
		this.trigger('video-bg-resize');
		this.onResize(() => {
			this.trigger('video-bg-resize');
		});
	}

	onLoad(callback) {
		jQuery(this.element).on('video-bg-loaded', callback);
	}

	onResize(callback, debounce = 100) {
		callback = jQuery.debounce(callback, debounce);
		jQuery(window).resize(callback);
		jQuery(window).on('orientationchange', callback);
	}
}
