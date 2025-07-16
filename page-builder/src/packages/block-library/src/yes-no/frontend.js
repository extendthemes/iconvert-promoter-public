( function ( $, Colibri ) {
	const className = 'yesno';

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
			const actionButtons = this.$element.find(
				'.cspromo-yes-no-button[data-action]'
			);
			const self = this;
			actionButtons.on( 'click', function ( e ) {
				const button = $( this );
				const action = button.data( 'action' );
				const type = button.data( 'content-type' );

				const parentPopup = button.closest( '.cs-popup-container' );

				if ( parentPopup ) {
					const popupID = parentPopup.data( 'csPromoid' );
					if ( popupID ) {
						self.sendAnalytics( popupID, type );
					}
				}

				switch ( action ) {
					case 'content':
						e.preventDefault();
						e.stopPropagation();
						button
							.closest( '[data-current-action]' )
							.attr( 'data-current-action', type );
						break;
					case 'close':
						e.preventDefault();
						// e.stopPropagation();
						break;
				}
			} );
		},

		sendAnalytics( popupID, type ) {
			const event = new CustomEvent( 'icPromoAnalyticsPopup', {
				detail: { popupID, event: `${ type }-action` },
			} );
			document.body.dispatchEvent( event );
		},
		stop() {},
		restart() {},
	};

	Component.inherits( Colibri );
	Colibri[ className ] = Component;
	Colibri.Plugin.create( className );
	Colibri.Plugin.autoload( className );
} )( jQuery, CSPROMO );
