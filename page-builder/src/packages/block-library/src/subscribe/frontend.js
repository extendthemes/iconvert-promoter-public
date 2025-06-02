( function ( $, Colibri ) {
	const className = 'subscribe';

	const Component = function () {
		this.namespace = className;
		this.defaults = {
			inEditor: false,
		};
		// Parent Constructor
		Colibri.apply( this, arguments );

		if ( this.opts.inEditor === false ) {
			this.start();
		}
	};

	Component.prototype = {
		start() {
			if (
				this.opts.inEditor === false &&
				this.isPreviewPage() === false
			) {
				const subscribeForm = this.$element.find( 'form' );
				const self = this;
				const promoContainer = this.$element.parents(
					'.cs-popup-container'
				);

				subscribeForm.submit( function ( e ) {
					e.preventDefault();
					// if in the preview/single page don't allow submitting the form
					if (
						self.$element
							.parents( 'body' )
							.hasClass( 'single-cs-promo-popups' )
					) {
						return false;
					}
					//Use serialize for premium form, with unlimited fields

					const onSuccessAction = subscribeForm.attr(
						'data-success-action'
					);

					const formID = subscribeForm.attr( 'data-formid' );
					const popupID = promoContainer.data( 'cs-promoid' );

					$.ajax( {
						url: cs_promo_settings.ajax_url,
						type: 'POST',
						data: {
							fields: {
								email: subscribeForm
									.find( 'input[name="email"]' )
									.val(),
								name: subscribeForm
									.find( 'input[name="name"]' )
									.val(),
								first_name: subscribeForm
									.find( '[name="first-name"]' )
									.val(),
								popupID,
							},
							cspromo_wpnonce:
								window.icPromoPopupsData?.subscribe_nonces?.[
									popupID
								]?.[ formID ] || '',
							listID: formID,
							action: 'cs_subscribe_email_to_list',
							visitor_id:
								window.icPromoPopupsData?.visitorId || '',
						},
						success( response ) {
							const returnCode = response.data.status;
							subscribeForm.find( '.subscribenotices' ).hide();

							//
							if ( returnCode === 'success' ) {
								const popupID =
									promoContainer.data( 'cs-promoid' );

								$( document ).trigger(
									'iconvert_email_subscribed',
									{
										popupID,
									}
								);

								switch ( onSuccessAction ) {
									case 'closePopup':
										self.closePopup( popupID );
										break;

									case 'openPopup':
										const openID =
											subscribeForm.attr(
												'data-open-popup'
											);
										self.closePopup( popupID );
										self.openPopup( openID );
										break;

									case 'redirect':
										const redirectURL = decodeURIComponent(
											subscribeForm.attr(
												'data-redirect'
											)
										);
										const windowOpen =
											subscribeForm.attr( 'data-window' );
										self.redirectTo(
											redirectURL,
											windowOpen
										);

										break;

									case 'customContent':
										subscribeForm.slideUp();
										subscribeForm
											.siblings(
												'.wp-block-cspromo-subscribe__successContainer'
											)
											.slideDown();
										break;

									case 'showNotice':
									default:
										self.showNotice( subscribeForm );
										self.hideFormInputs( subscribeForm );
										break;
								}
							}

							if ( returnCode === 'error' ) {
								subscribeForm
									.find(
										'.subscribenotices[data-fieldtype="error"]'
									)
									.show();
							}
							if ( returnCode === 'info' ) {
								subscribeForm
									.find(
										'.subscribenotices[data-fieldtype="info"]'
									)
									.show();
							}
						},
					} );
				} );
			} else {
				const subscribeForm = this.$element.find( 'form' );
				subscribeForm.submit( function ( e ) {
					e.preventDefault();
				} );
			}
		},

		hideFormInputs( subscribeForm ) {
			subscribeForm.find( '.iconvert-subscribe-field' ).fadeOut();
		},
		showNotice( subscribeForm ) {
			subscribeForm
				.find( '.subscribenotices[data-fieldtype="success"]' )
				.show();
			subscribeForm.trigger( 'reset' );
		},
		closePopup( popupID ) {
			const event = new CustomEvent( 'closePopup', {
				detail: { popupID },
			} );
			document.body.dispatchEvent( event );
		},
		openPopup( popupID ) {
			const event = new CustomEvent( 'openPopup', {
				detail: { popupID },
			} );
			document.body.dispatchEvent( event );
		},
		redirectTo( redirectURL, windowOpen ) {
			if ( windowOpen === 'sameWindow' ) {
				window.location.href = redirectURL;
			} else {
				window.open( redirectURL, '_blank' );
			}
		},
		stop() {},
		restart() {
			if ( this.opts.inEditor === true ) {
			}
		},
		isPreviewPage() {
			const searchQuery = window.location.search;

			if ( searchQuery.includes( '__iconvert-promoter-preview=' ) ) {
				return true;
			}
			return false;
		},
	};

	Component.inherits( Colibri );
	Colibri[ className ] = Component;
	Colibri.Plugin.create( className );
	Colibri.Plugin.autoload( className );
} )( jQuery, CSPROMO );
