import debounce from 'lodash.debounce';
import { ColibriFrontComponent } from '../../base';

export default class Slideshow extends ColibriFrontComponent {
	static componentName() {
		return 'slideshow';
	}

	init() {
		this.currentIndex = 0;
		this.interval = -1;

		this.debouncedRestart = debounce(() => {
			this.stop();
			this.start();
		}, 500);
	}

	addImageEffect(image, index) {
		const duration = this.opts.duration.replace('ms', '');
		const speed = this.opts.speed.replace('ms', '');

		let delay = parseInt(duration) - parseInt(speed);
		if (delay < 0) {
			delay = 0;
		}

		this.$(image).css({
			transition: `opacity ${speed}ms ease ${delay}ms`,
			zIndex: this.$images.length - index,
		});
	}

	slideImage() {
		this.$images.eq(this.currentIndex).removeClass('current');

		const nextIndex =
			this.currentIndex + 1 === this.$images.length
				? 0
				: this.currentIndex + 1;

		this.$images.eq(nextIndex).addClass('current').removeClass('next');

		this.currentIndex = nextIndex;
		const futureIndex =
			this.currentIndex + 1 === this.$images.length
				? 0
				: this.currentIndex + 1;

		this.$images.eq(futureIndex).addClass('next');
	}

	restart() {
		this.debouncedRestart();
	}

	start() {
		this.$images = this.$element.find('.slideshow-image');
		this.$images.removeClass('current');

		if (this.$images.length <= 1) {
			return;
		}

		this.$images.eq(0).addClass('current');
		this.currentIndex = 0;

		this.$images.each((index, image) => {
			this.addImageEffect(image, index);
		});

		this.interval = setInterval(() => {
			this.slideImage();
		}, parseInt(this.opts.duration));
	}

	stop() {
		clearInterval(this.interval);
		this.$images.css({
			transition: '',
			opacity: '',
		});
		this.$images.removeClass('current next');
		this.$images.eq(0).addClass('current');
		this.currentIndex = 0;
	}
}
