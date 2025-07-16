/**
 * @global
 */

import BaseHandler from './base-handler';

const VIDEO_ID_REGEX = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;

export default class YouTubeHandler extends BaseHandler {
	constructor(element, settings) {
		super(element, settings);
		return this;
	}

	static test(settings) {
		return 'video/x-youtube' === settings.mimeType;
	}

	ready() {
		if (this.settings.poster) {
			this.element.style.backgroundImage = `url("${this.settings.poster}")`;
		}

		if ('YT' in window) {
			window.YT.ready(() => {
				this.loadVideo();
			});
		} else {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			tag.onload = () => {
				window.YT.ready(() => {
					this.loadVideo();
				});
			};

			document.getElementsByTagName('head')[0].appendChild(tag);
		}
	}

	getVideoID() {
		const matches = this.settings.videoUrl.match(VIDEO_ID_REGEX);

		if (matches && matches.length >= 2) {
			return matches[1];
		}

		return null;
	}

	getYTOptions() {
		const options = {
			videoId: this.getVideoID(),
			events: {
				onReady: (e) => {
					const ytVideo = e.target;

					//added mute param, not sure if this mute function call is needed anymore.
					ytVideo.mute();
					top.yt1 = ytVideo;
					ytVideo.setPlaybackQuality('auto');
					this.play();
					this.loaded();
				},
				onStateChange: (e) => {
					if (window.YT.PlayerState.PLAYING === e.data) {
						this.trigger('play');
					} else if (window.YT.PlayerState.PAUSED === e.data) {
						this.trigger('pause');
					} else if (window.YT.PlayerState.ENDED === e.data) {
						e.target.playVideo();
					}
				},
				onError: (e) => {
					this.player.getIframe().style.display = 'none';
				},
			},
			playerVars: {
				autoplay: 1,
				controls: 0,
				disablekb: 1,
				fs: 0,
				iv_load_policy: 3,
				loop: 1,
				modestbranding: 1,
				playsinline: 1,
				rel: 0,
				showinfo: 0,

				/**
				 * Sometimes the mute function used in the onRead event did not work, but using this options the videos are
				 * always muted
				 */
				mute: 1,
			},
		};

		if (this.settings.height) {
			options.height = this.settings.height;
		} else {
			options.height = 1080;
		}

		if (this.settings.width) {
			options.width = this.settings.width;
		} else {
			options.width = 1920;
		}
		// height: this.settings.height,
		// width: this.settings.width,

		return options;
	}

	loadVideo() {
		const video = document.createElement('div'),
			YT = window.YT;

		this.setVideo(video);
		this.player = new window.YT.Player(video, this.getYTOptions());
	}

	updateVideoSize() {
		if (!this.player) {
			return;
		}
		const $iframe = jQuery(this.player.getIframe()),
			size = this.calcVideosSize();
		$iframe.css(size);
		$iframe.addClass('ready');
	}

	calcVideosSize() {
		const width = jQuery(this.element).outerWidth(),
			height = jQuery(this.element).outerHeight(),
			aspectRatio = '16:9'.split(':'),
			proportion = aspectRatio[0] / aspectRatio[1],
			keepWidth = width / height > proportion,
			magnifier = 1;

		return {
			width: magnifier * (keepWidth ? width : height * proportion),
			height: magnifier * (keepWidth ? width / proportion : height),
		};
	}

	play() {
		if (!!this.player && !!this.player.playVideo) {
			if (!this.isPlaying) {
				this.isPlaying = true;
				this.player.playVideo();
			}
		}
	}
	stopVideo() {
		if (!!this.player && !!this.player.stopVideo) {
			if (this.isPlaying) {
				this.isPlaying = false;
				this.player.stopVideo();
			}
		}
	}
	pause() {
		if (!!this.player && !!this.player.pauseVideo && !this.isPlaying) {
			this.isPlaying = false;
			this.player.pauseVideo();
		}
	}

	isPaused() {
		return YT.PlayerState.PAUSED === this.player.getPlayerState();
	}

	loaded() {
		this.updateVideoSize();
		super.loaded();
	}

	addResizeBind() {
		this.onResize(() => this.updateVideoSize(), 50);
		super.addResizeBind();
	}
}
