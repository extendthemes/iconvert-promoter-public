import { metadata } from './metadata';
import { mergeNoArrays } from '@kubio/utils';
import { getBlocksMap } from '@kubio/block-library';

const ElementsEnum = metadata.supports.kubio.elementsEnum;
const BlocksMap = getBlocksMap();
const buttonGroup = BlocksMap?.buttonGroup;
const buttonElementsByName = buttonGroup?.elementsByName;

const elementsByName = mergeNoArrays( {}, buttonElementsByName, {} );

export { ElementsEnum, elementsByName };
