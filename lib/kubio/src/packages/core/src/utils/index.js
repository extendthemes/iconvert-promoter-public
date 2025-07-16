import { ParserUtils } from '@kubio/style-manager';
import { getBlockSupport, getBlockType } from '@wordpress/blocks';
import _, { findIndex, get, map, merge } from 'lodash';
import memize from 'memize';
import shortid from 'shortid';
import {
	asyncSilentDispatch,
	markLastChangeAsAutomatic,
	markLastChangeAsPersistent,
	markNextChangeAsNotPersistent,
	silentDispatch,
	useGroupDispatch,
	useResetUndoStack,
	useUndoTrapDispatch,
	useUnloadStoreEntities,
	waitStoreChanges,
} from './dispatch-marks';
import * as $ from 'jquery';
import { fetchLinkSuggestions } from './fetch-link-suggestions';
import { onBlockVariationRegistered } from './on-block-variation-registerd';
import { addQueryArgs } from '@wordpress/url';

const getBlockAncestor = ( name ) => {
	const styles = getBlockStyledElements( name );
	const withAncestor = styles.find( ( item ) => item?.ancestor );
	return withAncestor ? withAncestor.ancestor : '';
};
const getBlockSeparatorElementName = ( name ) => {
	return getBlockSeparatorElement( name )?.name;
};

const getWrapperElement = ( styles ) => {
	const wrapper = styles.find( ( item ) => item?.wrapper );
	return wrapper;
};

const getBlockWrapperElement = ( name ) => {
	const styles = getBlockStyledElements( name );
	return getWrapperElement( styles );
};

const getBlockInnerElement = ( name ) => {
	const styles = getBlockStyledElements( name );
	const innerBlocks = styles.find( ( item ) => item?.supports?.innerBlocks );
	return innerBlocks;
};

/**
 *
 * @param  name
 * @return {Array}
 */
const getBlockStyledElements = memize( ( blockName ) => {
	const blockColibri = getBlockSupport( blockName, 'kubio', {} );
	const stylesElements = get( blockColibri, 'elementsByName', [] );

	const items = [];
	map( stylesElements, ( item, name ) => {
		items.push( { name, ...item } );
	} );

	return items;
} );

/**
 *
 * @param  name
 * @return {Array}
 */
const getBlockStyledElementsGroups = memize( ( blockName ) => {
	const blockColibri = getBlockSupport( blockName, 'kubio', {} );
	const groups = get( blockColibri, 'elementsGroups', [] );

	return groups;
} );

const getBlockStyledElementsWithClass = memize( ( name ) => {
	const styles = getBlockStyledElements( name );
	const withClasses = styles.filter( ( item ) => ! item?.selector );
	return withClasses;
} );

/**
 *
 * @param  name
 * @return {Array}
 */
const getBlockDefault = memize( ( name ) => {
	const blockColibri = getBlockSupport( name, 'kubio' );
	const defaultValue = get( blockColibri, 'default', {} );
	return merge(
		{
			style: { local: {}, shared: {} },
			props: { local: {}, shared: {} },
		},
		{
			style: { local: defaultValue._style, shared: defaultValue.style },
			props: { local: defaultValue._props, shared: defaultValue.props },
		}
	);
} );

const getBlockElements = memize(
	( name, includeInternal = true, grouped = false ) => {
		const styles = getBlockStyledElements( name );

		const elements = styles
			.filter(
				( item ) => includeInternal || ( ! item.internal && item.label )
			)
			.map( ( item ) => {
				return {
					...item,
					label: item.label,
					value: item.name,
				};
			} );

		if ( grouped ) {
			const groups = getBlockStyledElementsGroups( name );
			const groupsResults = groups.map( ( { items, label } ) => ( {
				label,
				items: items
					.map( ( value ) => {
						const itemIndex = findIndex( elements, { value } );
						if ( itemIndex >= 0 ) {
							return elements.splice( itemIndex, 1 )[ 0 ];
						}

						return false;
					} )
					.filter( Boolean ),
			} ) );

			return [ ...elements, ...groupsResults ];
		}

		return elements;
	}
);

const getBlockElementWithName = memize( ( blockName, elementName ) => {
	const elements = getBlockStyledElements( blockName );
	return elements.find( ( item ) => item.name === elementName );
} );

const getBlockSeparatorElement = ( blockName ) => {
	const elements = getBlockStyledElements( blockName );
	const found = elements.find( ( item ) => item?.supports?.separator );
	return found;
};

const getBlockDefaultElement = ( blockName ) => {
	if ( ! blockName ) {
		return '';
	}
	const elements = getBlockStyledElements( blockName );
	let found = elements.find( ( item ) => item?.default );
	if ( ! found ) {
		found = elements[ 0 ];
	}
	return found;
};

const getBlockCurrentData = ( block ) => {
	const blockSupport = getBlockType( block.name );
	return ParserUtils.normalizeBlockData( block, blockSupport );
};

const normalizeTemplateLock = ( value ) => {
	if ( value === 'false' || value === false || value === undefined ) {
		return false;
	}

	return value;
};
const getUnlinkedBlocks = ( blocks ) => {
	if ( ! blocks ) {
		return blocks;
	}
	const newBlocks = window.structuredClone( blocks );
	return newBlocks.map( ( block ) => {
		const innerBlocks = getUnlinkedBlocks( block.innerBlocks );

		const newBlock = {
			...block,
			innerBlocks,
		};
		if ( _.get( newBlock, 'attributes.kubio.id' ) ) {
			_.set( newBlock, 'attributes.kubio.id', shortid.generate() );
		}
		if ( _.get( newBlock, 'attributes.kubio.styleRef' ) ) {
			_.set( newBlock, 'attributes.kubio.styleRef', shortid.generate() );
		}

		return newBlock;
	} );
};

const generateNewStyleRefsForBlocks = ( blocks, prefix ) => {
	if ( ! blocks ) {
		return blocks;
	}
	const newBlocks = window.structuredClone( blocks );
	return newBlocks.map( ( block ) => {
		const innerBlocks = generateNewStyleRefsForBlocks(
			block.innerBlocks,
			prefix
		);

		const newBlock = {
			...block,
			innerBlocks,
		};
		if ( _.get( newBlock, 'attributes.kubio.id' ) ) {
			_.set( newBlock, 'attributes.kubio.id', shortid.generate() );
		}
		const styleRef = _.get( newBlock, 'attributes.kubio.styleRef' );

		//prefix the styleRef so if any blocks are linked they will remain linked
		if ( styleRef ) {
			_.set(
				newBlock,
				'attributes.kubio.styleRef',
				`${ prefix }${ styleRef }`
			);
		}

		return newBlock;
	} );
};

const getBlocksWithNewRefs = ( blocks ) => {
	//generate a short prefix to add to style the style refs
	const prefix = shortid.generate().substring( 3 );
	return generateNewStyleRefsForBlocks( blocks, prefix );
};

const installPlugin = async ( slug ) =>
	await ajaxCall( {
		action: 'kubio-demo-site-install-plugin',
		slug,
	} );
//Use the demosite logic as it is already implemented and it's not tied to the demosites for install/activate
const activatePlugin = async ( slug ) =>
	await ajaxCall( {
		action: 'kubio-demo-site-activate-plugin',
		slug,
	} );

const installAndActivatePlugin = async ( slug ) => {
	await installPlugin( slug );
	await activatePlugin( slug );
};

const ajaxCall = ( data ) => {
	const { demo_site_ajax_nonce, ajax_url } = window.kubioUtilsData;
	return new Promise( ( resolve, reject ) => {
		const formData =
			data instanceof window.FormData ? data : new window.FormData();

		formData.append( 'nonce', demo_site_ajax_nonce );
		_.each( data, ( value, key ) => formData.append( key, value ) );

		$.ajax( {
			method: 'POST',
			url: addQueryArgs( ajax_url, {
				nonce: demo_site_ajax_nonce,
				action: formData.get( 'action' ),
			} ),
			data: formData,
			contentType: false,
			processData: false,
		} )
			.done( ( response ) => {
				if ( response.success === false ) {
					reject( response );
				} else {
					resolve( response );
				}
			} )
			.fail( ( response ) => {
				reject( response );
			} );
	} );
};
export {
	getBlockAncestor,
	getBlockElements,
	getBlockCurrentData,
	getBlockInnerElement,
	getBlockWrapperElement,
	getBlockSeparatorElementName,
	getBlockElementWithName,
	getUnlinkedBlocks,
	getBlocksWithNewRefs,
	getBlockDefault,
	getWrapperElement,
	getBlockDefaultElement,
	getBlockStyledElementsWithClass,
	fetchLinkSuggestions,
	markNextChangeAsNotPersistent,
	normalizeTemplateLock,
	markLastChangeAsAutomatic,
	markLastChangeAsPersistent,
	onBlockVariationRegistered,
	useUndoTrapDispatch,
	silentDispatch,
	asyncSilentDispatch,
	useGroupDispatch,
	installAndActivatePlugin,
	installPlugin,
	activatePlugin,
	waitStoreChanges,
	useUnloadStoreEntities,
	useResetUndoStack,
	ajaxCall,
};
