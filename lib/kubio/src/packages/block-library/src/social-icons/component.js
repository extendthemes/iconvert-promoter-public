import { compose } from '@wordpress/compose';
import { withColibriDataAutoSave, withStyledElements } from '@kubio/core';
import { useEffect } from '@wordpress/element';
import { withSelect, useDispatch } from '@wordpress/data';
import { noop } from 'lodash';
import NamesOfBlocks from '../blocks-list';
import { useKubioInnerBlockProps } from '../common/hooks/use-kubio-inner-block-props';

const ALLOWED_BLOCKS = [NamesOfBlocks.SOCIAL_ICON];

const ComponentEdit = (props) => {
	const { StyledElements, hasInnerBlocks, clientId } = props;
	const { removeBlock } = useDispatch('core/block-editor');

	useEffect(() => {
		if (!hasInnerBlocks) {
			removeBlock(clientId);
		}
	}, [hasInnerBlocks]);

	const innerBlocksProps = useKubioInnerBlockProps(
		{},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			orientation: 'vertical',
			renderAppender: false,
		}
	);

	return <StyledElements.Outer {...innerBlocksProps} />;
};

const SocialIconsCompose = compose(
	withSelect((select, ownProps) => {
		const { getBlocks } = select('core/block-editor');
		const innerBlocks = getBlocks(ownProps.clientId);
		return {
			hasInnerBlocks: !!innerBlocks.length,
		};
	}),
	withColibriDataAutoSave(noop),
	withStyledElements(noop)
);

const LinkGroup = SocialIconsCompose(ComponentEdit);

export { LinkGroup };
