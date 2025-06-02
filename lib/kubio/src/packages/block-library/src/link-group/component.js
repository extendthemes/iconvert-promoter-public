import {
	withColibriData,
	withDynamicStyles,
	withRemoveOnEmptyInnerBlocks,
	withStyledElements,
} from '@kubio/core';
import { dynamicStylesTransforms } from '@kubio/style-manager';
import { compose, createHigherOrderComponent } from '@wordpress/compose';
import _ from 'lodash';
import NamesOfBlocks from '../blocks-list';
import { useKubioInnerBlockProps } from '../common/hooks/use-kubio-inner-block-props';
import { ElementsEnum } from './elements';

const ALLOWED_BLOCKS = [NamesOfBlocks.LINK];

const ComponentEdit = (props) => {
	const { StyledElements, innerBlocksPropsOverwrite } = props;

	const innerBlocksProps = useKubioInnerBlockProps(
		{},
		{
			renderAppender: false,
			orientation: 'horizontal',
			...innerBlocksPropsOverwrite,
		}
	);

	return (
		<StyledElements.Outer>
			<StyledElements.Spacing {...innerBlocksProps} />
		</StyledElements.Outer>
	);
};

const getHSpacingDynamicStyle = () => {
	return (dataHelper) => {
		const spaceByMedia = dataHelper.getPropByMedia('layout.hSpace', {});
		return {
			[ElementsEnum.H_SPACE]: dynamicStylesTransforms.hSpace(
				spaceByMedia
			),
			[ElementsEnum.H_SPACE_GROUP]: dynamicStylesTransforms.hSpaceParent(
				spaceByMedia
			),
		};
	};
};
const dynamicStyle = getHSpacingDynamicStyle();

const LinkGroupCompose = compose(
	withRemoveOnEmptyInnerBlocks(),
	withColibriData(_.noop),
	withDynamicStyles(dynamicStyle),
	withStyledElements(_.noop)
);

const ComponentFactory = (innerBlocksProps) => {
	return createHigherOrderComponent((WrappedComponent) => (ownProps) => {
		return (
			<WrappedComponent
				{...ownProps}
				innerBlocksPropsOverwrite={innerBlocksProps}
			/>
		);
	})(ComponentEdit);
};

const Component = ComponentFactory({
	allowedBlocks: ALLOWED_BLOCKS,
	// template: BLOCKS_TEMPLATE,
});

const LinkGroup = LinkGroupCompose(Component);

export { LinkGroup, ComponentFactory, getHSpacingDynamicStyle };
