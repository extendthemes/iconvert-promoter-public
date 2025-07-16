import { compose } from '@wordpress/compose';

import {
	withColibriData,
	withStyledElements,
	withDynamicStyles,
	withRemoveOnEmptyInnerBlocks,
} from '@kubio/core';

import NamesOfBlocks from '../blocks-list';
import {
	getHSpacingDynamicStyle,
	ComponentFactory,
} from '../link-group/component';
import { LinkGroupProperties } from '../link-group/inspector/content/group-propeties';

import _ from 'lodash';

const ALLOWED_BLOCKS = [NamesOfBlocks.BUTTON];

const dynamicStyle = getHSpacingDynamicStyle();

const LinkGroupCompose = compose(
	withRemoveOnEmptyInnerBlocks(),
	withColibriData(_.noop),
	withDynamicStyles(dynamicStyle),
	withStyledElements(_.noop)
);
 
const Component = ComponentFactory({
	allowedBlocks: ALLOWED_BLOCKS,
});

const ButtonGroup = LinkGroupCompose(Component);
const ComponentParts = {getHSpacingDynamicStyle, ComponentFactory, LinkGroupProperties};
export { ButtonGroup, ComponentParts };
