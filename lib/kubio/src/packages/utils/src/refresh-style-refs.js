import { isArray, get, set, unset } from 'lodash';
import generateShortID from 'shortid';
import { isGutentagPrefixed } from './is-gutentag-prefixed';
import { applyFilters } from '@wordpress/hooks';

const isKubioEditor = () => {
	return applyFilters( 'kubio.is-kubio-editor', !! top.isKubioBlockEditor );
};

const walker = ( block, options = {}, linkedRefs ) => {
	const { keepLinkedStyleRefs = true, onlyHashes = false } = options;
	let name, attributes, innerBlocks;

	if ( isArray( block ) ) {
		[ name, attributes, innerBlocks ] = block;
	} else {
		attributes = block?.attributes;
		innerBlocks = block?.innerBlocks;
	}

	name = name || block?.name;

	if ( ! isGutentagPrefixed( name ) ) {
		if ( isArray( block ) ) {
			return [ name, attributes, innerBlocks ];
		}
		return block;
	}

	const currentStyleRef = get( attributes, 'kubio.styleRef', null );
	let nextStyleRef = generateShortID();

	if ( currentStyleRef && keepLinkedStyleRefs ) {
		nextStyleRef = get(
			linkedRefs,
			`${ currentStyleRef }.value`,
			generateShortID()
		);

		const hits = get( linkedRefs, `${ currentStyleRef }.hits`, 0 );

		linkedRefs = set( linkedRefs, currentStyleRef, {
			value: nextStyleRef,
			hits: hits + 1, // this is for debug only
		} );
	}

	const newAttributes = {
		...attributes,
		kubio: {
			...attributes?.kubio,
			styleRef: onlyHashes ? currentStyleRef : nextStyleRef,
			hash: generateShortID(),
		},
	};

	const newInnerBlocks = ( innerBlocks || [] ).map( ( innerBlock ) =>
		walker( innerBlock, keepLinkedStyleRefs, linkedRefs )
	);

	if ( isArray( block ) ) {
		return [ name, newAttributes, newInnerBlocks ];
	}
	return {
		...block,
		attributes: newAttributes,
		innerBlocks: newInnerBlocks,
	};
};

const refreshBlockStyleRefs = (
	block,
	{ keepLinkedStyleRefs = true, onlyHashes = false } = {}
) => {
	const linkedRefs = {};
	return walker( block, { keepLinkedStyleRefs, onlyHashes }, linkedRefs );
};

const walkTemplateInnerBlocks = ( blocks, callback ) => {
	blocks = ! isArray( blocks ) ? [ blocks ] : blocks;

	blocks.forEach( ( block ) => {
		if ( ! block ) {
			return;
		}
		callback( block );
		walkTemplateInnerBlocks( block[ 2 ] || [], callback );
	} );
};

const variationRemoveRefs = ( variation ) => {
	unset( variation, `attributes.kubio.styleRef` );
	unset( variation, `attributes.kubio.hash` );

	walkTemplateInnerBlocks( variation.innerBlocks, ( block ) => {
		unset( block, `1.kubio.styleRef` );
		unset( block, `1.kubio.hash` );
	} );

	return variation;
};

const normalizeVariation = ( variation ) => {
	let _variation;
	if ( ! isKubioEditor() ) {
		_variation = variationRemoveRefs( variation );
	} else {
		_variation = refreshBlockStyleRefs( variation );
	}

	return _variation;
};

export { refreshBlockStyleRefs, normalizeVariation };
