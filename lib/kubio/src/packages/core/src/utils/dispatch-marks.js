import { Log } from '@kubio/log';
import { delayPromise } from '@kubio/utils';
import { dispatch, subscribe, useRegistry, useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import _, { debounce, get, set, unset } from 'lodash';

const markNextChangeAsNotPersistent = () => {
	return dispatch(
		'core/block-editor'
	).__unstableMarkNextChangeAsNotPersistent();
};

const markLastChangeAsPersistent = () => {
	return dispatch(
		'core/block-editor'
	).__unstableMarkLastChangeAsPersistent();
};

const markLastChangeAsAutomatic = () => {
	return dispatch( 'core/block-editor' ).__unstableMarkAutomaticChange();
};

const silentDispatch = ( action, sync = false ) => {
	if ( sync ) {
		markNextChangeAsNotPersistent();
		return action();
	}

	return markNextChangeAsNotPersistent().then( action );
};

const asyncSilentDispatch = ( action ) => {
	return silentDispatch( action, true );
};

const getUndoStackLength = ( coreStore ) => {
	return (
		coreStore?.getState()?.undo?.list?.length ||
		coreStore?.getState()?.undo?.length ||
		0
	);
};

const spliceUndoStackList = ( coreStore, startIndex, removeLength ) => {
	(
		coreStore?.getState()?.undo?.list ||
		coreStore?.getState()?.undo ||
		[]
	).splice( startIndex, removeLength );
};

const useUndoTrapDispatch = () => {
	const registry = useRegistry();
	const coreStore = registry?.stores?.core?.store;
	return useCallback(
		(
			action,
			{ silent = true, grouped = false, silentAsync = false } = {}
		) => {
			return new Promise( ( resolve ) => {
				const initialUndoLength = getUndoStackLength( coreStore );
				const modifyState = () => {
					const currentStatesLength = getUndoStackLength( coreStore );
					const undoLengthDiff =
						currentStatesLength - initialUndoLength;

					const offset = grouped ? 1 : 0;
					let removeLength = Math.max( 0, undoLengthDiff - offset );
					let startIndex = currentStatesLength - undoLengthDiff;

					// if the startIndex is 0 and the dispatches are grouped leave first one
					if ( startIndex <= 0 && grouped ) {
						startIndex = 1;
						removeLength = Math.max( 0, removeLength - 1 );
					}

					if ( undoLengthDiff && undoLengthDiff > 0 ) {
						spliceUndoStackList(
							coreStore,
							startIndex,
							removeLength
						);
					}

					resolve();
				};

				const modifyStateDelayed = () =>
					delayPromise( 500 ).then( modifyState );

				if ( action instanceof Promise ) {
					Log.error(
						`useUndoTrapDispatch`,
						'Do not pass a Promise directly. Wrap it in a function first'
					);
				} else {
					const executed = silent
						? silentDispatch( () => action(), silentAsync )
						: action();

					if ( executed instanceof Promise ) {
						executed.then( modifyStateDelayed );
					} else {
						// eslint-disable-next-line no-console
						Log.warn(
							'useUndoTrapDispatch',
							`It's recommended for the undo trap dispatch to return a promise to allow a consistent store changes flow`
						);

						const unsub = subscribe(
							debounce( () => {
								unsub();
								modifyStateDelayed();
							}, 500 )
						);
					}
				}
			} );
		},
		[ coreStore ]
	);
};

/**
 * @return  {(action: () => Promise, silentAsync: (boolean|undefined)) => Promise} - the returned function
 */
const useGroupDispatch = () => {
	const applyUndoTrap = useUndoTrapDispatch();

	return useCallback(
		( action, silentAsync = false ) =>
			applyUndoTrap( action, {
				silent: false,
				grouped: true,
				silentAsync,
			} ),
		[ applyUndoTrap ]
	);
};

const waitStoreChanges = ( delay = 5 ) => {
	return new Promise( ( resolve ) => {
		const unsub = subscribe(
			debounce( () => {
				unsub();
				resolve();
			}, delay )
		);
	} );
};
const excludedPostTypes = [ 'attachment' ];
const skipCacheBusting = [ 'wp_template', 'wp_template_part' ];

const useUnloadStoreEntities = () => {
	const registry = useRegistry();
	const { getEntityRecord } = useSelect( ( select ) => {
		return { getEntityRecord: select( 'core' ).getEntityRecord };
	} );

	return useCallback(
		( onlyDirty = true ) => {
			const coreStore = registry?.stores?.core?.store;

			//to be backward compatible we will support both versions
			const getDataRoot = ( { kind, name } ) => {
				//pre wp 6.0 entities were stored inside the data object. After wp 6.0 entities are stored inside the record object
				const dataRootPossibilities = [ 'data', 'records' ];
				return dataRootPossibilities.find( ( rootPath ) => {
					return get(
						coreStore.getState(),
						`entities.${ rootPath }.${ kind }.${ name }.edits`
					);
				} );
			};

			let dataRoot;
			if ( onlyDirty ) {
				const dirtyEntities =
					registry.stores.core.selectors.__experimentalGetDirtyEntityRecords();

				const idsMap = {};
				dirtyEntities.forEach( ( { key, name, kind } ) => {
					if ( excludedPostTypes.includes( name ) ) {
						return;
					}
					const currentIds = get( idsMap, [ kind, name ], [] );
					set( idsMap, [ kind, name ], [ ...currentIds, key ] );

					if ( ! dataRoot ) {
						dataRoot = getDataRoot( { kind, name } );
					}
					if ( ! dataRoot ) {
						return;
					}
					set(
						coreStore.getState(),
						`entities.${ dataRoot }.${ kind }.${ name }.edits`,
						{}
					);

					set(
						coreStore.getState(),
						`entities.${ dataRoot }.${ kind }.${ name }.saving`,
						{}
					);

					const itemCompleContexts = get(
						coreStore.getState(),
						`entities.${ dataRoot }.${ kind }.${ name }.queriedData.itemIsComplete`,
						{}
					);

					Object.keys( itemCompleContexts ).forEach( ( context ) => {
						unset(
							coreStore.getState(),
							`entities.${ dataRoot }.${ kind }.${ name }.queriedData.itemIsComplete.${ context }.${ key }`
						);
					} );
				} );

				Object.keys( idsMap ).forEach( ( kind ) => {
					Object.keys( idsMap[ kind ] ).forEach( ( name ) => {
						const itemIds = idsMap[ kind ][ name ];
						coreStore.dispatch( {
							type: 'REMOVE_ITEMS',
							itemIds,
							kind,
							name,
							invalidateCache: true,
						} );
					} );
				} );

				//we do a cache busting to force the core to refresh the data. Without this the kubio global will have
				//no value when we to getEntityRecord. This means if we did a discard changes the general settings will
				//stop working until you refresh the page.
				_.each( idsMap, ( posts, kind ) => {
					_.each( posts, ( ids, postType ) => {
						//templates and template parts are caches busted by the editor. We only need to handle the other post types
						if ( skipCacheBusting.includes( postType ) ) {
							return;
						}
						ids.forEach( ( id ) => {
							getEntityRecord( kind, postType, id, {
								cacheBusting: Math.random(),
							} );
						} );
					} );
				} );
			}
		},
		[ registry, getEntityRecord ]
	);
};

const useResetUndoStack = () => {
	const registry = useRegistry();

	return useCallback( () => {
		const coreStore = registry?.stores?.core?.store;
		const undoStackLength = getUndoStackLength( coreStore );

		if ( coreStore.getState()?.undo?.flattenUndo ) {
			coreStore.getState().undo.flattenUndo = {};
		}
		if ( coreStore.getState()?.undo?.offset ) {
			coreStore.getState().undo.offset = 0;
		}

		spliceUndoStackList( coreStore, 0, undoStackLength );
	}, [ registry ] );
};

export {
	markNextChangeAsNotPersistent,
	markLastChangeAsPersistent,
	markLastChangeAsAutomatic,
	useUndoTrapDispatch,
	silentDispatch,
	asyncSilentDispatch,
	useGroupDispatch,
	waitStoreChanges,
	useUnloadStoreEntities,
	useResetUndoStack,
};
