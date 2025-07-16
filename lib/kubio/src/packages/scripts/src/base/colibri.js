import { kubioPrefix } from './constants';

function CSPromoBase() {
	const $ = jQuery;
	if ( typeof jQuery === 'undefined' ) {
		throw new Error( 'CSPromo requires jQuery' );
	}

	( function () {
		const version = $.fn.jquery.split( '.' );
		if ( version[ 0 ] === 1 && version[ 1 ] < 8 ) {
			throw new Error( 'CSPromo requires at least jQuery v1.8' );
		}
	} )();

	function debounce( func, timeout = 300 ) {
		let timer;
		return ( ...args ) => {
			clearTimeout( timer );
			timer = setTimeout( () => {
				func.apply( this, args );
			}, timeout );
		};
	}

	let Base;

	const libName = kubioPrefix;
	const libPrefix = libName + '.';
	const settingsAttr = libName + '-settings';

	( function () {
		// Inherits
		Function.prototype.inherits = function ( parent ) {
			const F = function () {};
			F.prototype = parent.prototype;
			const f = new F();

			for ( const prop in this.prototype ) {
				f[ prop ] = this.prototype[ prop ];
			}
			this.prototype = f;
			this.prototype.super = parent.prototype;
		};

		// Core Class
		Base = function ( element, options ) {
			options = typeof options === 'object' ? options : {};

			this.$element = $( element );
			const elementData = this.$element.data();
			this.settings = this.$element.data( settingsAttr ) || {};
			this.opts = $.extend(
				true,
				{},
				this.defaults,
				$.fn[ libPrefix + this.namespace ].options,
				elementData,
				this.settings,
				options
			);
			this.$target =
				typeof this.opts.target === 'string'
					? $( this.opts.target )
					: null;
		};

		Base.getScrollingElement = function () {
			let element = window;
			if ( this.isBlockEditor() && top === window ) {
				element = document.querySelector(
					'.interface-interface-skeleton__content'
				);
			}

			return element;
		};

		Base.isCustomizerPreview = function () {
			return !! window.colibriCustomizerPreviewData;
		};

		Base.isBlockEditor = function () {
			return !! top?.wp?.blockEditor;
		};

		// Core Functionality
		Base.prototype = {
			updateOpts( updatedData ) {
				const newSetting = this.$element.attr( 'data-' + settingsAttr );
				if ( newSetting ) {
					this.settings = JSON.parse( newSetting );
				}

				const instanceData = $.extend(
					true,
					{},
					this.defaults,
					this.settings
				);
				const updatedDataWithDefault = updatedData ? updatedData : {};
				this.opts = $.extend(
					true,
					this.opts,
					instanceData,
					updatedDataWithDefault
				);
			},
			getInstance() {
				return this.$element.data( 'fn.' + this.namespace );
			},
			hasTarget() {
				return ! ( this.$target === null );
			},
			callback( type ) {
				let args = [].slice.call( arguments ).splice( 1 );

				// on element callback
				if ( this.$element ) {
					args = this._fireCallback(
						$._data( this.$element[ 0 ], 'events' ),
						type,
						this.namespace,
						args
					);
				}

				// on target callback
				if ( this.$target ) {
					args = this._fireCallback(
						$._data( this.$target[ 0 ], 'events' ),
						type,
						this.namespace,
						args
					);
				}

				// opts callback
				if (
					this.opts &&
					this.opts.callbacks &&
					typeof this.opts.callbacks[ type ] === 'function'
				) {
					return this.opts.callbacks[ type ].apply( this, args );
				}

				return args;
			},
			_fireCallback( events, type, eventNamespace, args ) {
				let value;

				if ( events && typeof events[ type ] !== 'undefined' ) {
					const len = events[ type ].length;
					for ( let i = 0; i < len; i++ ) {
						const namespace = events[ type ][ i ].namespace;
						if ( namespace === eventNamespace ) {
							value = events[ type ][ i ].handler.apply(
								this,
								args
							);
						}
					}
				}

				return typeof value === 'undefined' ? args : value;
			},
		};
	} )();

	( function ( Base_ ) {
		Base_.Plugin = {
			create( classname, pluginname ) {
				pluginname =
					typeof pluginname === 'undefined'
						? classname.toLowerCase()
						: pluginname;
				pluginname = libPrefix + pluginname;

				$.fn[ pluginname ] = function ( method, options ) {
					const args = Array.prototype.slice.call( arguments, 1 );
					const name = 'fn.' + pluginname;
					const val = [];

					this.each( function () {
						const $this = $( this );
						let data = $this.data( name );
						options = typeof method === 'object' ? method : options;

						if ( ! data ) {
							// Initialization
							$this.data( name, {} );
							data = new Base_[ classname ]( this, options );
							$this.data( name, data );
						}

						// Call methods
						if ( typeof method === 'string' ) {
							if ( $.isFunction( data[ method ] ) ) {
								const methodVal = data[ method ].apply(
									data,
									args
								);
								if ( methodVal !== undefined ) {
									val.push( methodVal );
								}
							} else {
								$.error(
									'No such method "' +
										method +
										'" for ' +
										classname
								);
							}
						}
					} );

					// eslint-disable-next-line no-nested-ternary
					return val.length === 0 || val.length === 1
						? val.length === 0
							? this
							: val[ 0 ]
						: val;
				};

				$.fn[ pluginname ].options = {};

				return this;
			},
			autoload( pluginname ) {
				const arr = pluginname.split( ',' );
				const len = arr.length;

				for ( let i = 0; i < len; i++ ) {
					const name = arr[ i ]
						.toLowerCase()
						.split( ',' )
						.map( function ( s ) {
							return libPrefix + s.trim();
						} )
						.join( ',' );
					this.autoloadQueue.push( name );
				}

				return this;
			},
			autoloadQueue: [],
			startAutoload() {
				if (
					! window.MutationObserver ||
					this.autoloadQueue.length === 0
				) {
					return;
				}
				if ( this.observer ) {
					this.observer.disconnect();
				}
				const self = this;
				const observer = new MutationObserver( function ( mutations ) {
					mutations.forEach( function ( mutation ) {
						const newNodes = mutation.addedNodes;
						if (
							newNodes.length === 0 ||
							( newNodes.length === 1 && newNodes.nodeType === 3 )
						) {
							return;
						}
						self.startAutoloadOnceDebounced();
					} );
				} );
				this.observer = observer;
				// pass in the target node, as well as the observer options
				let observedElement = document.querySelector(
					'.editor-styles-wrapper .is-root-container.block-editor-block-list__layout'
				);

				if ( ! observedElement ) {
					observedElement = document;
				}

				observer.observe( observedElement, {
					subtree: true,
					childList: true,
				} );
			},

			startAutoloadOnceDebounced: debounce( () => {
				Base.Plugin.startAutoloadOnce();
			}, 300 ),
			startAutoloadOnce() {
				const self = this;
				const attrName = libName + '-component';
				const $nodes = $( '[data-' + attrName + ']' )
					.not( '[data-loaded]' )
					.not( '[data-disabled]' );
				$nodes.each( function () {
					const $el = $( this );
					const pluginname = libPrefix + $el.data( attrName );

					if ( self.autoloadQueue.indexOf( pluginname ) !== -1 ) {
						$el.attr( 'data-loaded', true );
						try {
							$el[ pluginname ]();
						} catch ( e ) {
							// eslint-disable-next-line no-console
							console.error( e );
						}
					}
				} );
			},

			stopWatcher() {
				this.observer?.disconnect?.();
			},

			watch() {
				Base_.Plugin.startAutoloadOnce();
				Base_.Plugin.startAutoload();
			},

			init() {
				if ( window.isKubioBlockEditor && ! window.isInsideIframe ) {
					return;
				}
				if ( $.isReady ) {
					Base_.Plugin.watch();
				} else {
					$( document ).ready( Base_.Plugin.watch );
				}
			},
		};

		Base_.Plugin.init();
	} )( Base );

	( function ( Base_ ) {
		Base_.Animation = function ( element, effect, callback ) {
			this.namespace = 'animation';
			this.defaults = {};

			// Parent Constructor
			Base_.apply( this, arguments );

			// Initialization
			this.effect = effect;
			this.completeCallback =
				typeof callback === 'undefined' ? false : callback;
			this.prefixes = [ '', '-moz-', '-o-animation-', '-webkit-' ];
			this.queue = [];

			this.start();
		};

		Base_.Animation.prototype = {
			start() {
				if ( this.isSlideEffect() ) {
					this.setElementHeight();
				}

				this.addToQueue();
				this.clean();
				this.animate();
			},
			addToQueue() {
				this.queue.push( this.effect );
			},
			setElementHeight() {
				this.$element.height( this.$element.outerHeight() );
			},
			removeElementHeight() {
				this.$element.css( 'height', '' );
			},
			isSlideEffect() {
				return this.effect === 'slideDown' || this.effect === 'slideUp';
			},
			isHideableEffect() {
				const effects = [
					'fadeOut',
					'slideUp',
					'flipOut',
					'zoomOut',
					'slideOutUp',
					'slideOutRight',
					'slideOutLeft',
				];

				return $.inArray( this.effect, effects ) !== -1;
			},
			isToggleEffect() {
				return this.effect === 'show' || this.effect === 'hide';
			},
			storeHideClasses() {
				if ( this.$element.hasClass( 'hide-sm' ) ) {
					this.$element.data( 'hide-sm-class', true );
				} else if ( this.$element.hasClass( 'hide-md' ) ) {
					this.$element.data( 'hide-md-class', true );
				}
			},
			revertHideClasses() {
				if ( this.$element.data( 'hide-sm-class' ) ) {
					this.$element
						.addClass( 'hide-sm' )
						.removeData( 'hide-sm-class' );
				} else if ( this.$element.data( 'hide-md-class' ) ) {
					this.$element
						.addClass( 'hide-md' )
						.removeData( 'hide-md-class' );
				} else {
					this.$element.addClass( 'hide' );
				}
			},
			removeHideClass() {
				if ( this.$element.data( 'hide-sm-class' ) ) {
					this.$element.removeClass( 'hide-sm' );
				} else if ( this.$element.data( 'hide-md-class' ) ) {
					this.$element.removeClass( 'hide-md' );
				} else {
					this.$element.removeClass( 'hide' );
					this.$element.removeClass( 'force-hide' );
				}
			},
			animate() {
				this.storeHideClasses();
				if ( this.isToggleEffect() ) {
					return this.makeSimpleEffects();
				}

				this.$element.addClass( 'kubio-animated' );
				this.$element.addClass( this.queue[ 0 ] );
				this.removeHideClass();

				const _callback =
					this.queue.length > 1 ? null : this.completeCallback;
				this.complete(
					'AnimationEnd',
					$.proxy( this.makeComplete, this ),
					_callback
				);
			},
			makeSimpleEffects() {
				if ( this.effect === 'show' ) {
					this.removeHideClass();
				} else if ( this.effect === 'hide' ) {
					this.revertHideClasses();
				}

				if ( typeof this.completeCallback === 'function' ) {
					this.completeCallback( this );
				}
			},
			makeComplete() {
				if ( this.$element.hasClass( this.queue[ 0 ] ) ) {
					this.clean();
					this.queue.shift();

					if ( this.queue.length ) {
						this.animate();
					}
				}
			},
			complete( type, make, callback ) {
				const events = type.split( ' ' ).map( function ( type_ ) {
					return (
						type_.toLowerCase() +
						' webkit' +
						type_ +
						' o' +
						type_ +
						' MS' +
						type_
					);
				} );

				this.$element.one(
					events.join( ' ' ),
					$.proxy( function () {
						if ( typeof make === 'function' ) {
							make();
						}
						if ( this.isHideableEffect() ) {
							this.revertHideClasses();
						}
						if ( this.isSlideEffect() ) {
							this.removeElementHeight();
						}
						if ( typeof callback === 'function' ) {
							callback( this );
						}

						this.$element.off( events.join( ' ' ) );
					}, this )
				);
			},
			clean() {
				this.$element
					.removeClass( 'kubio-animated' )
					.removeClass( this.queue[ 0 ] );
			},
		};

		// Inheritance
		Base_.Animation.inherits( Base_ );
	} )( Base );

	( function () {
		const animationName = libPrefix + 'animation';
		$.fn[ animationName ] = function ( effect, callback ) {
			const name = 'fn.animation';

			return this.each( function () {
				const $this = $( this );
				$this.data( name, {} );
				$this.data(
					name,
					new Base.Animation( this, effect, callback )
				);
			} );
		};

		$.fn[ animationName ].options = {};

		Base.animate = function ( $target, effect, callback ) {
			$target[ animationName ]( effect, callback );
			return $target;
		};
	} )();

	( function ( Base_ ) {
		Base_.Detect = function () {};

		Base_.Detect.prototype = {
			isMobile() {
				return /(iPhone|iPod|BlackBerry|Android)/.test(
					navigator.userAgent
				);
			},
			isDesktop() {
				return ! /(iPhone|iPod|iPad|BlackBerry|Android)/.test(
					navigator.userAgent
				);
			},
			isMobileScreen() {
				return $( window ).width() <= 768;
			},
			isTabletScreen() {
				return (
					$( window ).width() >= 768 && $( window ).width() <= 1024
				);
			},
			isDesktopScreen() {
				return $( window ).width() > 1024;
			},
		};
	} )( Base );

	( function ( Base_ ) {
		Base_.Utils = function () {};

		Base_.Utils.prototype = {
			disableBodyScroll() {
				const $body = $( 'html' );
				let windowWidth = window.innerWidth;

				if ( ! windowWidth ) {
					const documentElementRect =
						document.documentElement.getBoundingClientRect();
					windowWidth =
						documentElementRect.right -
						Math.abs( documentElementRect.left );
				}

				const isOverflowing = document.body.clientWidth < windowWidth;
				const scrollbarWidth = this.measureScrollbar();

				$body.css( 'overflow', 'hidden' );
				if ( isOverflowing ) {
					$body.css( 'padding-right', scrollbarWidth );
				}
			},
			measureScrollbar() {
				const $body = $( 'body' );
				const scrollDiv = document.createElement( 'div' );
				scrollDiv.className = 'scrollbar-measure';

				$body.append( scrollDiv );
				const scrollbarWidth =
					scrollDiv.offsetWidth - scrollDiv.clientWidth;
				$body[ 0 ].removeChild( scrollDiv );
				return scrollbarWidth;
			},
			enableBodyScroll() {
				$( 'html' ).css( { overflow: '', 'padding-right': '' } );
			},
		};
	} )( Base );

	return Base;
}

const Base = CSPromoBase();
window.CSPROMO = Base;
export default Base;
