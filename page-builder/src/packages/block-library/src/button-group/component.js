import { getBlocksMap } from '@kubio/block-library';
import { compose } from '@wordpress/compose';

import {
	withColibriData,
	withDynamicStyles,
	withRemoveOnEmptyInnerBlocks,
	withStyledElements,
} from '@kubio/core';

import _ from 'lodash';

const BlocksMap = getBlocksMap();
const buttonGroup = BlocksMap?.buttonGroup;
const { ComponentFactory, getHSpacingDynamicStyle } =
	buttonGroup?.Components?.ComponentParts || {};

const ALLOWED_BLOCKS = [ 'cspromo/button' ];
const dynamicStyle = getHSpacingDynamicStyle();

const LinkGroupCompose = compose(
	withRemoveOnEmptyInnerBlocks(),
	withColibriData( _.noop ),
	withDynamicStyles( dynamicStyle ),
	withStyledElements( _.noop )
);

const Component = ComponentFactory( {
	allowedBlocks: ALLOWED_BLOCKS,
} );

const ButtonGroup = LinkGroupCompose( Component );

export { ButtonGroup };
