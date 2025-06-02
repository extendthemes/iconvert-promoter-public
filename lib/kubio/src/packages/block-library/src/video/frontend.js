( function ( $, Colibri ) {
	const className = 'video';

	class BaseHandler {
		constructor( $element, data = {} ) {
			this.$element = $element;
			this.data = data;
		}
		play() {}
		stop() {}
		pause() {}
		startIfAutoplay() {
			if ( this.data.autoPlay ) {
				this.play();
			}
		}
		getContentWindow() {
			const $iframe = this.$element.find( 'iframe' );
			if ( $iframe.length < 1 ) {
				return;
			}
			return $iframe.get( 0 ).contentWindow;
		}
	}
	class YoutubeHandler extends BaseHandler {
		play() {
			this.runCommand( 'playVideo' );
		}
		pause() {
			this.runCommand( 'pauseVideo' );
		}
		stop() {
			this.runCommand( 'stopVideo' );
		}
		runCommand( funcName ) {
			const contentWindow = this.getContentWindow();
			if ( ! contentWindow ) {
				return;
			}

			const youtubeCommand = JSON.stringify( {
				event: 'command',
				func: funcName,
			} );

			contentWindow.postMessage(
				youtubeCommand,
				'https://www.youtube.com'
			);
		}
	}
	class VimeoHandler extends BaseHandler {
		play() {
			this.runCommand( 'play' );
		}
		pause() {
			this.runCommand( 'pause' );
		}
		stop() {
			this.runCommand( 'pause' );
			this.runCommand( 'setCurrentTime', '0' );
		}
		runCommand( method, args ) {
			const contentWindow = this.getContentWindow();
			if ( ! contentWindow ) {
				return;
			}

			const vimeoCommand = JSON.stringify( {
				method,
				value: args,
			} );
			contentWindow.postMessage( vimeoCommand, '*' );
		}
	}

	class InternalVideoHandler extends BaseHandler {
		constructor( $element, data ) {
			super( $element, data );
			this.video = this.$element.find( 'video' ).get( 0 );
			if ( this.video.loop && data.startTime && data.endTime ) {
				this.video.addEventListener( 'timeupdate', () => {
					if ( this.video.currentTime >= data.endTime ) {
						this.video.currentTime = data.startTime;
						this.play();
					}
				} );
			}
		}

		play() {
			this.video.play().catch( ( e ) => {
				this.video.muted = true;
			} );
		}
		pause() {
			this.video.pause();
		}
		stop() {
			this.pause();
			this.video.currentTime = 0;
		}
	}

	const Component = function ( element, options ) {
		this.namespace = className;
		this.defaults = {
			data: {},
		};
		// Parent Constructor
		Colibri.apply( this, arguments );

		// Initialization
		this.start();
	};

	Component.prototype = {
		start() {
			const data = this.opts || {};
			const displayAs = data.displayAs;
			switch ( displayAs ) {
				case 'posterImage':
					this.addPosterImageLogic();
					break;
				case 'iconWithLightbox':
					this.addIconWithLightBoxLogic();
					break;
			}
			this.addVideoHandler();

			//the interaction observer callback is called when the observer is initiated so we have to ignore that call
			let interactionObserverFirstCallbackCall = false;
			this.intersectionObserver = this.$element.respondToVisibility(
				( visible ) => {
					if ( ! visible ) {
						//this.handler.pause();
					} else {
						//don't start autoplay from the observer when its initiated
						// eslint-disable-next-line no-lonely-if
						if ( interactionObserverFirstCallbackCall ) {
							this.handler.startIfAutoplay();
						}
					}
					if ( ! interactionObserverFirstCallbackCall ) {
						interactionObserverFirstCallbackCall = true;
					}
				}
			);
		},
		stop() {
			if ( this.intersectionObserver ) {
				this.intersectionObserver.disconnect();
				this.intersectionObserver = null;
			}
		},
		addVideoHandler() {
			switch ( this.opts.videoCategory ) {
				case 'internal':
					this.handler = new InternalVideoHandler(
						this.$element,
						this.opts
					);
					break;
				case 'youtube':
					this.handler = new YoutubeHandler(
						this.$element,
						this.opts
					);
					break;
				case 'vimeo':
					this.handler = new VimeoHandler( this.$element, this.opts );
					break;
			}
		},
		addPosterImageLogic() {
			const data = this.opts;
			const $poster = this.$element.find(
				'.wp-block-cspromo-video__poster'
			);
			if ( $poster.length !== 0 ) {
				const $buttonContainer = $poster.find( 'a' );
				const $iconContainer = $poster.find( '.h-svg-icon' );
				if ( $buttonContainer.length !== 0 ) {
					$buttonContainer.removeAttr( 'href' );
					$buttonContainer.click(
						{ element: this.$element, data },
						this.startVideo.bind( this )
					);
				}
				if ( $iconContainer.length !== 0 ) {
					$iconContainer.click(
						{ element: this.$element, data },
						this.startVideo.bind( this )
					);
				}
			}
		},
		addIconWithLightBoxLogic() {
			const data = this.opts;
			const lightboxElement = this.$element.find(
				'.wp-block-cspromo-video__lightbox'
			);
			if ( lightboxElement.length !== 0 ) {
				const iconContainer = lightboxElement.find( '.h-svg-icon ' );
				iconContainer.click(
					{ element: this.$element, data },
					this.startVideo
				);
			}
		},
		startVideo( event ) {
			const element = event.data.element;
			const lightBox = event.data.data.lightBox;

			if ( ! lightBox ) {
				element.find( '.wp-block-cspromo-video__poster' ).hide();
			}
			if ( event.data.data.videoCategory !== 'internal' ) {
				const iframe = element.find( 'iframe' );

				if ( lightBox ) {
					let url = iframe.attr( 'src' );
					url = url.replace( 'autoplay=0', 'autoplay=1' );
					url = url.replace( 'autopause=0', '' );
					$.fancybox.open( {
						src: url,
						opts: {
							beforeClose( instance, current ) {
								element
									.find( '.wp-block-cspromo-video__poster' )
									.show();
							},
							baseClass: 'cspromo-video-lightbox',
						},
					} );
				} else {
					this.handler.play();
				}
			} else if ( lightBox ) {
				const videoContainer = element.find(
					'.wp-block-cspromo-video__video'
				);
				$.fancybox.open( {
					src: element.find( 'video' ),
					type: 'inline',
					modal: false,
					touch: false,
					showCloseButton: true,
					opts: {
						afterLoad( instance, current ) {
							const $video = current.$content.find( 'video' );
							if ( $video.length === 0 ) {
								return;
							}
							$video.removeClass( 'h-video-main' );
							// $video.get(0).play();
						},
						beforeClose( instance, current ) {
							element
								.find( '.wp-block-cspromo-video__poster' )
								.show();
						},
						baseClass: 'cspromo-video-lightbox',
					},
				} );
			} else {
				this.handler.play();
			}
		},
	};

	Component.inherits( Colibri );
	Colibri[ className ] = Component;
	Colibri.Plugin.create( className );
	Colibri.Plugin.autoload( className );
	// eslint-disable-next-line no-undef
} )( jQuery, CSPROMO );
