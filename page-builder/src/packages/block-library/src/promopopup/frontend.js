( function ( $, Colibri ) {
	const className = 'promopopup';

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
			if ( this.opts.inEditor === false ) {
			}
		},
		stop() {},
		restart() {},
	};

	Component.inherits( Colibri );
	Colibri[ className ] = Component;
	Colibri.Plugin.create( className );
	Colibri.Plugin.autoload( className );
} )( jQuery, CSPROMO );
