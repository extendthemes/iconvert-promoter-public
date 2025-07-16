import { normalizeVariation } from '@kubio/utils';
import {
	registerBlockType,
	unregisterBlockType,
	unstable__bootstrapServerSideBlockDefinitions as bootstrapServerSideBlockDefinitions,
} from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { isFunction, set } from 'lodash';

const registerBlockWithStyle = ( block ) => {
	if ( ! block ) {
		return;
	}
	const { metadata, settings } = block;
	const { name } = metadata;
	// set html support false by default on all blocks
	if ( settings?.supports?.html === undefined ) {
		set( settings, 'supports.html', false );
	}

	if ( settings.variations ) {
		settings.variations.map( ( variation ) =>
			normalizeVariation( variation )
		);
	}

	if ( metadata ) {
		bootstrapServerSideBlockDefinitions( { [ name ]: metadata } );
	}

	if ( isFunction( settings.edit ) ) {
		settings.edit.displayName = `@BlockEdit:${ name }`;
	}

	registerBlockType( name, settings );
};

const replacedBlocks = {};
const replaceBlock = ( newBlock, global = false ) => {
	if ( ! global ) {
		if ( ! window.isKubioBlockEditor ) {
			return;
		}
	}
	const blockName = newBlock.metadata.name;
	const replaceFunction = ( settings, name ) => {
		if ( name === blockName && ! replacedBlocks[ blockName ] ) {
			replacedBlocks[ blockName ] = true;
			setTimeout( () => {
				unregisterBlockType( blockName );
				registerBlockWithStyle( newBlock );
			} );
		}

		return settings;
	};

	addFilter(
		'blocks.registerBlockType',
		`kubio/replace-lock/${ blockName }`,
		replaceFunction
	);
};

export { replaceBlock, registerBlockWithStyle };
