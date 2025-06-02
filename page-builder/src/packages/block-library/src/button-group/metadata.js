import { extendBlockMeta } from '@kubio/colibri';
import { getBlocksMap } from '@kubio/block-library';
import csPromoButtonGroup from './block.json';
import _ from 'lodash';

const BlocksMap = getBlocksMap();
const buttonGroup = BlocksMap?.buttonGroup;
const buttonGroupMetadata = _.cloneDeep( buttonGroup?.metadata );
const metadata = extendBlockMeta( buttonGroupMetadata, csPromoButtonGroup );

export { metadata };
