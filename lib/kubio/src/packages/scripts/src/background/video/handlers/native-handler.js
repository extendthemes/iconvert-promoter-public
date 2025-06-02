import BaseHandler from './base-handler';

export default class NativeHandler extends BaseHandler {
	constructor(element, settings) {
		super(element, settings);
		return this;
	}

	static test(settings) {
		const video = document.createElement('video');
		return video.canPlayType(settings.mimeType);
	}

	isPaused() {
		return this.video.paused;
	}

	ready() {
		if (this.settings.poster) {
			this.element.style.backgroundImage = `url("${this.settings.poster}")`;
		}

		if (!this.settings.videoUrl) {
			return;
		}

		const video = document.createElement('video');

		video.id = this.settings.id || '';

		// video.autoplay = 'autoplay';
		video.loop = 'loop';
		video.muted = 'muted';
		video.autoplay = 'autoplay';
		video.setAttribute('playsinline', true);

		if (this.settings.width) {
			video.width = this.settings.width;
		}

		if (this.settings.height) {
			video.height = this.settings.height;
		}

		video.addEventListener('play', () => {
			this.trigger('play');
		});

		video.addEventListener('pause', () => {
			this.trigger('pause');
		});

		video.addEventListener('loadeddata', () => {
			this.loaded();
		});

		this.video = video;
		this.setVideo(video);
		video.src = this.settings.videoUrl;
	}

	pause() {
		this.video.pause();
	}
	stopVideo() {
		this.video.pause();
		this.video.currentTime = 0;
	}
	play() {
		this.video.play();
	}
}
