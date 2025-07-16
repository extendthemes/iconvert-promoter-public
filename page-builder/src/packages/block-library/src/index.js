import _ from 'lodash';
//import frontend scripts
import NamesOfBlocks from './blocks-list';
import { blocksMap } from './blocks-map';
import './frontend';

const blocks = _.toArray( blocksMap );

const getNamesOfBlocks = () => {
	return NamesOfBlocks;
};

const getBlocksMap = () => {
	return blocksMap;
};

const getBlocks = () => {
	return blocks;
};

const getBlocksByName = () => {
	return _.keyBy( blocks, 'settings.name' );
};

export { getNamesOfBlocks, getBlocks, getBlocksMap, getBlocksByName };
