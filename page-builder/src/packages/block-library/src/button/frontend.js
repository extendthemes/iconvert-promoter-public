import { isPreviewPage } from '../promopopup/helpers';

( function ( $, Colibri ) {
	const className = 'button';

	const Component = function () {
		this.namespace = className;
		this.defaults = {
			inEditor: false,
		};
		// Parent Constructor
		Colibri.apply( this, arguments );

		this.start();
	};

	Component.prototype = {
		start() {
			const self = this;
			$( '.cs-popup-coupon' ).on( 'click', function ( e ) {
				e.preventDefault();
				if ( self.opts.inEditor === true || isPreviewPage() ) {
					return false;
				}
				const button = $( this );
				const code = button.attr( 'data-coupon' );
				if ( code ) {
					$.ajax( {
						url: cs_promo_settings.ajax_url,
						type: 'POST',
						data: {
							action: 'iconvertpr_apply_coupon',
							coupon_code: code,
						},
						success( response ) {
							if ( response.data.status === 'error' ) {
								console.log(
									'Error code:',
									response.data.code
								);
								if ( response.data.code === 'not_valid' ) {
									button.html( 'Coupon code not valid' );
								} else {
									button.html( 'Error' );
								}
							} else if ( response.data.code === 'applied' ) {
								$( "[name='update_cart']" )
									.prop( 'disabled', false )
									.trigger( 'click' );
								$( document.body ).trigger( 'update_checkout' );
								if ( response.data.checkout_url ) {
									window.location.replace(
										response.data.checkout_url
									);
								}
							} else if (
								response.data.code === 'already_applied'
							) {
								button.html(
									'Coupon #' + code + ' already applied'
								);
							}
						},
					} );
				} else {
					console.log( 'Missing coupon code' );
				}
			} );
		},
		stop() {},
		restart() {},
	};

	Component.inherits( Colibri );
	Colibri[ className ] = Component;
	Colibri.Plugin.create( className );
	Colibri.Plugin.autoload( className );
} )( jQuery, CSPROMO );
