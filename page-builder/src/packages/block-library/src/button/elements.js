import { metadata } from './metadata';
import { mergeNoArrays } from '@kubio/utils';
import { getBlocksMap } from '@kubio/block-library';

const ElementsEnum = metadata.supports.kubio.elementsEnum;
const BlocksMap = getBlocksMap();
const button = BlocksMap?.button;
const buttonElementsByName = button?.elementsByName;

const elementsByName = mergeNoArrays( {}, buttonElementsByName, {
	[ ElementsEnum.SPACING ]: {
		internal: true,
	},
} );

export { ElementsEnum, elementsByName };
