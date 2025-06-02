// TOGGLE THE STYLE WORKS
const STYLE_WORKERS_ENABLED = true;

const isInWindow =
	typeof WorkerGlobalScope === 'undefined' ||
	// eslint-disable-next-line no-undef
	! ( self instanceof WorkerGlobalScope );

const canCreateWorker =
	STYLE_WORKERS_ENABLED &&
	isInWindow &&
	window.Worker &&
	window._kubioStyleManagerWorkerURL;

const uniqueId = ( length = 16 ) => {
	return parseInt(
		// eslint-disable-next-line no-restricted-syntax
		Math.ceil( Math.random() * Date.now() )
			.toPrecision( length )
			.toString()
			.replace( '.', '' )
	);
};

const namedWorkerPromises = {};
const createWorkerPromise = ( promiseName = null ) => {
	if ( promiseName && namedWorkerPromises[ promiseName ] ) {
		if ( namedWorkerPromises[ promiseName ].worker ) {
			return namedWorkerPromises[ promiseName ].workerPromise;
		}
		return null;
	}

	if ( ! canCreateWorker ) {
		return null;
	}

	let worker;
	try {
		worker = canCreateWorker
			? new window.Worker( window._kubioStyleManagerWorkerURL )
			: false;
	} catch ( e ) {
		worker = null;
	}

	let loaded = false;

	const onLoad = ( event ) => {
		if ( event.data === 'WORKER_LOADED' ) {
			loaded = true;
		}

		worker.removeEventListener( 'message', onLoad );
	};

	if ( worker ) {
		worker.addEventListener( 'message', onLoad );

		worker.onerror = () => {
			worker = null;
		};
	} else {
		return null;
	}

	const createPromise = ( action, payload ) => {
		const hash = `${ action }_` + uniqueId();
		return new Promise( ( resolve, reject ) => {
			if ( ! worker ) {
				reject( 'WORKER_FAILED' );
			}

			worker.postMessage( {
				hash,
				action,
				payload: JSON.stringify( payload ),
			} );
			const onMessage = ( event ) => {
				if ( event.data === 'WORKER_LOADED' ) {
					return;
				}

				const { hash: responseHash, payload: responsePayload } =
					event.data;

				if ( hash === responseHash ) {
					worker.removeEventListener( 'message', onMessage );
					resolve( responsePayload );
				}
			};

			worker.addEventListener( 'message', onMessage );
		} );
	};

	const workerPromise_ = ( action, payload = {} ) => {
		if ( ! loaded ) {
			return new Promise( ( resolve ) => {
				const promiseOnLoad = ( event ) => {
					if ( event.data === 'WORKER_LOADED' ) {
						createPromise( action, payload ).then( ( response ) =>
							resolve( response )
						);
						worker.removeEventListener( 'message', promiseOnLoad );
					}
				};
				worker.addEventListener( 'message', promiseOnLoad );
			} );
		}
		return createPromise( action, payload );
	};

	workerPromise_.isLoaded = () => loaded;

	if ( promiseName ) {
		namedWorkerPromises[ promiseName ] = {
			worker,
			workerPromise: workerPromise_,
		};
	}

	return workerPromise_;
};

export { createWorkerPromise };
