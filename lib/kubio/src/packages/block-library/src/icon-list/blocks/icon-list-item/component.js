import { compose } from '@wordpress/compose';
import {
	withColibriDataAutoSave,
	withStyledElements,
	withRedirectSelectionToParent,
	refreshOnParentChange,
} from '@kubio/core';
import _ from 'lodash';
import { ElementsEnum } from './elements';
import { CanvasIcon, LinkWrapper } from '@kubio/controls';
import { withSelect } from '@wordpress/data';

const Component = (props) => {
	const { StyledElements, computed, parentData } = props;
	const { isLastChild, isFirstChild, text, link, dividerEnabled } = computed;

	return (
		<StyledElements.Item>
			{isFirstChild && (
				<StyledElements.DividerWrapper className={'first-el-spacer'} />
			)}
			<LinkWrapper link={link}>
				<StyledElements.TextWrapper>
					<StyledElements.Icon tag={CanvasIcon} />
					<StyledElements.Text
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				</StyledElements.TextWrapper>
			</LinkWrapper>

			{isLastChild && (
				<StyledElements.DividerWrapper className={'last-el-spacer'} />
			)}
			<StyledElements.DividerWrapper>
				{dividerEnabled && <StyledElements.Divider />}
			</StyledElements.DividerWrapper>
		</StyledElements.Item>
	);
};

const stylesMapper = ({ computed } = {}) => {
	const { icon } = computed;

	return {
		[ElementsEnum.ICON]: {
			name: icon,
		},
	};
};

const computed = (dataHelper, ownProps) => {
	const parentDataHelper = dataHelper.withParent();
	const dividerEnabled = parentDataHelper.getProp('divider.enabled');
	const siblings = dataHelper.withSiblings();
	const isFirstChild =
		_.get(siblings, [0, 'clientId']) === dataHelper.clientId;
	const isLastChild =
		_.get(siblings, [siblings.length - 1, 'clientId']) ===
		dataHelper.clientId;
	let text = dataHelper.getAttribute('text');
	text = text.replace(/\r?\n/g, '<br />');
	return {
		isLastChild,
		isFirstChild,
		icon: dataHelper.getAttribute('icon'),
		link: dataHelper.getAttribute('link'),
		text,
		dividerEnabled,
	};
};

const IconListItemCompose = compose(
	//this is needed for when items are added/deleted or the order changes. We need to refresh the use computed to see
	//if the item is first or last.
	withSelect((select, { clientId }) => {
		const parentClientId = select('core/block-editor').getBlockRootClientId(
			clientId
		);
		const siblings = select('core/block-editor').getBlocks(parentClientId);
		return {
			siblings,
		};
	}),
	refreshOnParentChange(true),
	withColibriDataAutoSave(computed),
	withStyledElements(stylesMapper),
	withRedirectSelectionToParent()
);

const IconListItem = IconListItemCompose(Component);

export { IconListItem };
