import { doAction, addAction, applyFilters } from '@wordpress/hooks';
import _ from 'lodash';

import storeDataInitializer from './store-data-initializer';
import { monitorBlockInsertion } from './common/hooks/monitor-block-insertion';
import * as postContent from './post-content';
import { addAppearanceEffectFilter } from './common/filters/appearance-effect';
import '@kubio/scripts';
import { registerBlockWithStyle, replaceBlock } from './register';
//import frontend scripts
import './frontend';
import _NamesOfBlocks from './blocks-list';

import { blocksMap as _blockMap } from './blocks-map';

import { KubioBlockAppender } from './common/components/kubio-block-appender';

// Firefox warnings triggered by react to use this polyfills
import 'raf-polyfill';
import { blockParts } from './block-parts';

storeDataInitializer();

let blocksMap = _blockMap;
let NamesOfBlocks = _NamesOfBlocks;
let blocks = _.toArray( blocksMap );

const initializeBlocks = () => {
	//let kubio children add new blocks or filter out kubio blocks
	blocksMap = applyFilters( 'kubio.block-library.blocksMap', blocksMap );

	NamesOfBlocks = applyFilters(
		'kubio.block-library.NamesOfBlocks',
		NamesOfBlocks
	);
	blocks = _.toArray( blocksMap );
	const blocksWithoutContent = blocks.filter(
		( block ) => block?.metadata?.name !== NamesOfBlocks.CONTENT
	);

	blocksWithoutContent.forEach( registerBlockWithStyle );
	doAction( 'kubio-blocks-registered' );

	addAppearanceEffectFilter();
};
//This is needed for kubio children. The blocks in block library need to be loaded after the editor
//has loaded. But this is only needed for kubio children for kubio we don't need a hook
if ( window?.kubioUtilsData?.kubioLoadBlocksWithHook ) {
	addAction( 'kubio.editor.initialize', 'block-library', () => {
		initializeBlocks();
	} );
} else {
	initializeBlocks();
}

replaceBlock( postContent );

monitorBlockInsertion();

const getNamesOfBlocks = () => {
	return NamesOfBlocks;
};

const getBlocksMap = () => {
	return blocksMap;
};

const getBlocks = () => {
	return blocks;
};

const getProBlocks = () => {
	return blocks
		.filter( ( block ) => block.settings.isPro )
		.map( ( block ) => block.settings.name );
};

const getBlocksByName = () => {
	return _.keyBy( blocks, 'settings.name' );
};

export * from './register';
export * from './common';

export {
	getNamesOfBlocks,
	getBlocks,
	getBlocksMap,
	getBlocksByName,
	KubioBlockAppender,
	blockParts,
	getProBlocks,
};
