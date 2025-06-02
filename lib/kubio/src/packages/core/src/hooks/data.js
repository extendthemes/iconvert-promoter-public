import { queueCall, kubioCloneDeep } from '@kubio/utils';
import { useBlockEditContext } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import {
	dispatch,
	dispatch as storeDispatch,
	select,
	select as storeSelect,
	useRegistry,
} from '@wordpress/data';
import { addAction } from '@wordpress/hooks';
import { cloneDeep, flatten, get, set } from 'lodash';
import isEqual from 'react-fast-compare';
import shortid from 'shortid';
import { useBlockContext } from '../common/hocs';
import { useDataHelperDefaultOptionsContext } from '../context/data-helper-default-options-context';
import { withColibri } from '../data-wrapper/access';
import { findAllBlocksWithStyleRef } from '../utils/shared-style';
import { useDeepMemo } from './use-deep-memo';

const getClientId = ( clientId, hooks ) => {
	if ( ! clientId && typeof hooks !== 'undefined' ) {
		const { blockEditorContext } = hooks;
		if ( blockEditorContext?.clientId ) {
			clientId = blockEditorContext?.clientId;
		}
	}
	return clientId;
};

const prepareColibriData = ( options, hooks ) => {
	const mergedOptions = {
		loadColibriData: false,
		useClientData: false,
		autoSave: false,
		clientId: null,
		clientsList: [],
		ownProps: {},
		contextProps: {
			default: {},
			data: {},
		},
		rootClientId: null,
		parentDataHelper: null,
		...options,
	};

	if ( ! mergedOptions.blockType ) {
		mergedOptions.blockType = getBlockType( mergedOptions?.ownProps?.name );
	}

	const blockHooks =
		mergedOptions?.autoSave || mergedOptions?.loadColibriData ? hooks : {};
	return getColibriData( mergedOptions, blockHooks );
};

const useColibriDataHooks = () => {
	const registry = useRegistry();
	const {
		getBlockAttributes,
		getBlockRootClientId,
		getBlockOrder,
		getBlockName,
		getBlockParents,
	} = registry.select( 'core/block-editor' );

	const {
		updateBlockAttributes,
		__unstableMarkLastChangeAsPersistent,
		duplicateBlocks,
		selectBlock,
	} = registry.dispatch( 'core/block-editor' );

	const blockEditorContext = useBlockEditContext();
	const dataHelperDefaultOptionsContext =
		useDataHelperDefaultOptionsContext();
	const blockContext = useBlockContext();
	return useDeepMemo(
		() => ( {
			getBlockAttributes,
			getBlockRootClientId,
			getBlockOrder,
			getBlockName,
			getBlockParents,
			getBlockType,

			updateBlockAttributes,
			duplicateBlocks,
			__unstableMarkLastChangeAsPersistent,
			blockEditorContext,
			dataHelperDefaultOptionsContext,
			selectBlock,
			blockContext,
		} ),
		[ blockContext, blockEditorContext, dataHelperDefaultOptionsContext ]
	);
};

const instancesMap = new Map();

const instancesMapCleanup = queueCall( ( queue = [] ) => {
	flatten( queue ).forEach( ( clientId ) => instancesMap.delete( clientId ) );
}, 100 );

addAction(
	'kubio.block-removed',
	'kubio/clear/clibri-data-cache',
	instancesMapCleanup
);

const getColibriData = ( options, hooks ) => {
	let {
		loadColibriData,
		forceLoadStoreData,
		autoSave,
		clientId,
		ownProps,
		blockType,
		contextProps,
		rootClientId,
		parentDataHelper,
		block = null,
		invalidateCache = false,
	} = options;

	let data = null;

	if ( invalidateCache ) {
		instancesMap.delete( clientId );
	}

	if ( clientId && instancesMap.has( clientId ) ) {
		return instancesMap.get( clientId );
	}

	if ( loadColibriData ) {
		if ( block ) {
			data = getDataFromAttributes( block.attributes );
		} else {
			clientId = getClientId( clientId, hooks );
			const clientData = getClientColibriData( clientId, hooks );
			data = clientData.data;
			// null data is when the block is in another registry ( like a block preview )
			if ( data === null ) {
				data = getDataFromAttributes(
					ownProps?.attributes ||
						ownProps?.item?.attributes ||
						ownProps?.block?.attributes
				);
			}
		}
	} else {
		data = getDataFromAttributes( ownProps?.attributes );
	}

	let colibriDataOptions = {
		blockType,
		contextProps,
		rootClientId,
		parentDataHelper,
	};

	if ( autoSave || forceLoadStoreData ) {
		colibriDataOptions = {
			...colibriDataOptions,
			_updateStoreFunction: getUpdateStoreFunction,
			autoSave,
			forceLoadStoreData,
			clientId,
			hooks,
		};
	}

	const colibriData = withColibri.init( data, {}, '', colibriDataOptions );
	colibriData.getSessionProp = ( prop, fallback ) => {
		return storeSelect( 'kubio/session-store' ).getProp(
			clientId,
			prop,
			fallback
		);
	};

	colibriData.setSessionProp = ( prop, value ) => {
		return storeDispatch( 'kubio/session-store' ).setProp(
			clientId,
			prop,
			value
		);
	};

	if ( clientId ) {
		instancesMap.set( clientId, colibriData );
	}

	return colibriData;
};

const getClientColibriData = ( clientId, hooks ) => {
	const { getBlockAttributes } = hooks;
	const attributes = getBlockAttributes( clientId );
	return {
		attributes,
		data: attributes === null ? null : getDataFromAttributes( attributes ),
	};
};

const getDataFromAttributes = ( attributes = {} ) => {
	if ( ! attributes ) {
		attributes = {};
	}
	const { kubio, ...otherAttributes } = attributes;

	try {
		return window.structuredClone( {
			localData: {
				...otherAttributes,
			},
			kubio,
		} );
	} catch ( e ) {
		return kubioCloneDeep( {
			localData: {
				...otherAttributes,
			},
			kubio,
		} );
	}
};

const {
	updateBlockAttributes,
	__unstableMarkLastChangeAsPersistent,
	__unstableMarkNextChangeAsNotPersistent,
} = dispatch( 'core/block-editor' );

const { getBlock } = select( 'core/block-editor' );

const updateSharedBlocks = ( blocksAttributes, skipUpdateSharedStyle ) => {
	const ids = Object.keys( blocksAttributes );
	const clientIds = [ ...ids ];

	ids.forEach( ( id ) => {
		if ( skipUpdateSharedStyle.includes( id ) ) {
			return;
		}

		const styleRef = blocksAttributes[ id ]?.kubio.styleRef;

		if ( ! styleRef ) {
			return;
		}

		const blocks = findAllBlocksWithStyleRef( styleRef, {
			exclude: [ id ],
		} );

		const newStyle = get( blocksAttributes[ id ], 'kubio.style', {} );
		const newProps = get( blocksAttributes[ id ], 'kubio.props', {} );

		blocks.forEach( ( block ) => {
			const { clientId: blockClientId } = block;
			const attributes =
				blocksAttributes[ blockClientId ] ?? block.attributes;

			if (
				isEqual( newStyle, get( attributes, 'kubio.style', {} ) ) &&
				isEqual( newProps, get( attributes, 'kubio.props', {} ) )
			) {
				return;
			}

			// add block to clientIds list if not already there
			if ( ! clientIds.includes( blockClientId ) ) {
				clientIds.push( blockClientId );
			}

			const newBlockAttributes = window.structuredClone( attributes );
			set( newBlockAttributes, 'kubio.style', newStyle );
			set( newBlockAttributes, 'kubio.props', newProps );

			const newHash = shortid.generate();
			set( newBlockAttributes, 'kubio.hash', newHash );

			blocksAttributes[ blockClientId ] = newBlockAttributes;
		} );
	} );

	return [ clientIds, blocksAttributes ];
};

const processSettAttributesQueue = ( queue = [] ) => {
	const clientIds = [];
	const skipUpdateSharedStyle = [];
	const newAttributes = {};
	let silent = true;

	queue.forEach(
		( [
			clientId,
			attributes,
			maybeSilent = false,
			skipSharedStyle = false,
		] ) => {
			silent = silent && maybeSilent;

			if ( ! getBlock( clientId ) ) {
				return;
			}

			if ( ! clientIds.includes( clientId ) ) {
				clientIds.push( clientId );
			}
			newAttributes[ clientId ] = attributes;

			if ( skipSharedStyle ) {
				skipUpdateSharedStyle.push( clientId );
			}
		}
	);

	if ( ! clientIds.length ) {
		return;
	}

	const [ ids, attributes ] = updateSharedBlocks(
		newAttributes,
		skipUpdateSharedStyle
	);

	if ( silent ) {
		__unstableMarkNextChangeAsNotPersistent();
	} else {
		__unstableMarkLastChangeAsPersistent();
	}

	return updateBlockAttributes(
		ids,
		window.structuredClone( attributes ),
		true
	);
};

/**
 * @param {string} clientId
 * @param {Object} attributes
 */
const queueBlocksAttributesUpdate = queueCall( ( queue = [] ) => {
	processSettAttributesQueue( queue );
}, 30 );

/**
 * @param {string} clientId
 * @param {Object} attributes
 */
const queueSilentlyBlocksAttributesUpdate = ( clientId, attributes ) => {
	queueBlocksAttributesUpdate( clientId, attributes, true );
};

const getUpdateStoreFunction = (
	clientId,
	hooks,
	exportedAttributes,
	dataHelper,
	{ silentDispatch = false, skipSharedStyle = false }
) => {
	clientId = getClientId( clientId, hooks );

	const { kubio, localData } = exportedAttributes;

	let newData = localData;
	if ( kubio ) {
		newData = {
			...newData,
			kubio,
		};
	}

	queueBlocksAttributesUpdate(
		clientId,
		newData,
		silentDispatch,
		skipSharedStyle
	);
};

export {
	useColibriDataHooks,
	getClientColibriData,
	getUpdateStoreFunction,
	getClientId,
	getDataFromAttributes,
	getColibriData,
	prepareColibriData,
	queueBlocksAttributesUpdate,
	queueSilentlyBlocksAttributesUpdate,
};
