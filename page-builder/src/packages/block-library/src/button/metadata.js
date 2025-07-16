import { extendBlockMeta } from '@kubio/colibri';
import { getBlocksMap } from '@kubio/block-library';
import csPromoButton from './block.json';
import _ from 'lodash';

const BlocksMap = getBlocksMap();
const button = BlocksMap?.button;
const buttonMetadata = _.cloneDeep( button?.metadata );
const metadata = extendBlockMeta( buttonMetadata, csPromoButton );

export { metadata };
