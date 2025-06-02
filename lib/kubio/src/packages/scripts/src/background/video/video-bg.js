import Handlers from './handlers/handlers';
import { ColibriFrontComponent } from '../../base';

export default class VideoBackground extends ColibriFrontComponent {
	static componentName() {
		return 'video-background';
	}

	init() {
		this.videoData = {};
		this.handler = false;
		// eslint-disable-next-line no-undef
		this.debouncedSetPosition = jQuery.debounce(
			this.updateVideoBackground.bind(this),
			100
		);

		this.resizeObserve = (e) => {
			this.debouncedSetPosition();
		};

		this.resizeObserver = new window.ResizeObserver(this.resizeObserve);
	}

	generateVideo() {
		for (const handle in Handlers) {
			if (
				Handlers.hasOwnProperty(handle) &&
				Handlers[handle].test(this.videoData)
			) {
				this.$element.empty();
				this.handler = new Handlers[handle](
					this.$element[0],
					this.videoData
				);
				break;
			}
		}

		if (!this.handler) {
			return;
		}

		this.handler.onLoad(() => {
			this.$element.children('iframe,video').addClass('h-hide-sm-force');
			this.debouncedSetPosition();
			this.handler.onResize(() => this.debouncedSetPosition());

			this.resizeObserver.observe(this.handler.element);
		});

		if (window.hop) {
			window.addResizeListener(
				this.$element.closest('.background-wrapper').parent()[0],
				this.debouncedSetPosition
			);
			this.debouncedSetPosition();
		}
	}
	stopVideo() {
		if (this.handler.stopVideo) {
			this.handler.stopVideo();
		}
	}
	play() {
		if (this.handler.play) {
			this.handler.play();
		}
	}

	updateVideoBackground() {
		if (this.handler.updateVideoSize) {
			this.handler.updateVideoSize();
		}
		this.setPosition();
	}
	setPosition() {
		this.handler.pause();
		if (
			this.$element.children('iframe,video').eq(0).css('display') ===
			'none'
		) {
			return;
		}

		const $video = this.$element.children('iframe,video').eq(0),
			posX = $video.is('iframe') ? 50 : this.opts.positionX,
			posY = $video.is('iframe') ? 50 : this.opts.positionY,
			x =
				(Math.max($video.width() - this.$element.width(), 0) *
					parseFloat(posX)) /
				100,
			y =
				(Math.max($video.height() - this.$element.height(), 0) *
					parseFloat(posY)) /
				100;

		$video.css({
			transform: `translate(-${x}px,-${y}px)`,
			'-webkit-transform': `translate(-${x}px,-${y}px)`,
		});

		this.$element.addClass('visible');

		setTimeout(() => {
			this.handler.play();
		}, 100);
	}
	start() {
		this.videoData = {
			mimeType: this.opts.mimeType,
			videoUrl: this.opts.video,
		};

		if (typeof this.opts.poster === 'string') {
			this.poster = this.opts.poster;
		}

		this.generateVideo();
	}
	stop() {
		window.removeResizeListener(
			this.$element.closest('.background-wrapper').parent()[0],
			this.debouncedSetPosition
		);
	}
	restart() {
		this.stop();
		this.start();
	}
}
