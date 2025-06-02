export function observableMap() {
	const map = new Map();
	const listeners = new Map();

	function callListeners( name ) {
		const list = listeners.get( name );
		if ( ! list ) {
			return;
		}
		for ( const listener of list ) {
			listener();
		}
	}

	return {
		get( name ) {
			return map.get( name );
		},
		set( name, value ) {
			map.set( name, value );
			callListeners( name );
		},
		delete( name ) {
			map.delete( name );
			callListeners( name );
		},
		subscribe( name, listener ) {
			let list = listeners.get( name );
			if ( ! list ) {
				list = new Set();
				listeners.set( name, list );
			}
			list.add( listener );

			return () => {
				list.delete( listener );
				if ( list.size === 0 ) {
					listeners.delete( name );
				}
			};
		},
	};
}
export * from './use-observable-value';
