import { subscribe } from '@wordpress/i18n';

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
			if ( this.opts.inEditor === false ) {
				const subscribeForm = this.$element.find( 'form' );
				const self = this;
				const promoContainer = this.$element.parents(
					'.cs-popup-container'
				);

				const isPreviewingThePopup = this.isPreviewPage();

				subscribeForm.submit( function ( e ) {
					e.preventDefault();

					const onSuccessAction = subscribeForm.attr(
						'data-success-action'
					);

					const popupID = promoContainer.data( 'cs-promoid' );

					const onSuccessCallback = () => {
						switch ( onSuccessAction ) {
							case 'closePopup':
								if ( isPreviewingThePopup ) {
									$( window ).trigger(
										'iconvert-promo-box-message',
										{
											message: `This popup is set to close after subscribing,<br/>but in preview mode the functionality is disabled.`,
										}
									);
									return;
								}

								self.closePopup( popupID );
								break;

							case 'openPopup':
								if ( isPreviewingThePopup ) {
									$( window ).trigger(
										'iconvert-promo-box-message',
										{
											message: `This popup is set to open another popup after subscribing,<br/>but in preview mode the functionality is disabled.`,
										}
									);
									return;
								}

								const openID =
									subscribeForm.attr( 'data-open-popup' );
								self.closePopup( popupID );
								self.openPopup( openID );
								break;

							case 'redirect':
								const redirectURL = decodeURIComponent(
									subscribeForm.attr( 'data-redirect' )
								);

								if ( isPreviewingThePopup ) {
									$( window ).trigger(
										'iconvert-promo-box-message',
										{
											message: `Normally the popup will redirect to <strong style="font-weight:700;color:#2271b1">${ redirectURL }</strong>,<br/>but in preview mode, the redirects are blocked.`,
										}
									);
									return;
								}

								const windowOpen =
									subscribeForm.attr( 'data-window' );
								self.redirectTo( redirectURL, windowOpen );

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

								if ( isPreviewingThePopup ) {
									$( window ).trigger(
										'iconvert-promo-box-message',
										{
											message: `This popup is in preview mode, so the form will not submit.<br/>The success message is shown for demonstration purposes.`,
										}
									);
								}
								break;
						}
					};

					if ( subscribeForm.attr( 'data-form-preview' ) ) {
						return onSuccessCallback();
					}

					const formID = subscribeForm.attr( 'data-formid' );

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
							action: 'iconvertpr_subscribe_email_to_list',
							visitor_id:
								window.icPromoPopupsData?.visitorId || '',
						},
						success( response ) {
							const returnCode = response.data.status;
							subscribeForm.find( '.subscribenotices' ).hide();

							if ( returnCode === 'success' ) {
								$( document ).trigger(
									'iconvert_email_subscribed',
									{
										popupID,
									}
								);

								onSuccessCallback();
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
