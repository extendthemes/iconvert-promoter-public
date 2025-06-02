import { withColibriDataAutoSave, withStyledElements } from '@kubio/core';
import { compose } from '@wordpress/compose';
import _ from 'lodash';
import NamesOfBlocks from '../../../blocks-list';
import { useKubioInnerBlockProps } from '../../../common/hooks/use-kubio-inner-block-props';
import { ElementsEnum } from './elements';
import { ToolbarControl } from './toolbar';

const ALLOWED_BLOCKS = [NamesOfBlocks.ICON_LIST_ITEM];
const iconListComponentEnum = {
	styledComponent: ElementsEnum.OUTER,
};

const Component = (props) => {
	const { StyledElements, clientId, isSelected } = props;

	const innerBlocksProps = useKubioInnerBlockProps(
		{},
		{
			templateLock: false,
			renderAppender: false,
			allowedBlocks: ALLOWED_BLOCKS,
			__experimentalAppenderTagName: 'li',
			//	template,
		}
	);

	return (
		<>
			<ToolbarControl isSelected={isSelected} clientId={clientId} />
			<StyledElements.Outer {...innerBlocksProps} />
		</>
	);
};

const useStylesMapper = ({ computed }) => {
	const { listLayoutByMedia } = computed;

	return {
		[ElementsEnum.OUTER]: () => {
			const layoutMapper = {
				column: 'vertical',
				row: 'horizontal',
			};
			const layoutClasses = [];
			_.each(listLayoutByMedia, (listLayout, media) => {
				const direction = layoutMapper[listLayout];
				layoutClasses.push(`list-type-${direction}-on-${media}`);
			});
			return {
				className: layoutClasses,
			};
		},
	};
};

const computed = (dataHelper) => {
	const listLayoutByMedia = dataHelper.getStyleByMedia(
		'flexDirection',
		'',
		iconListComponentEnum
	);

	return {
		listLayoutByMedia,
	};
};

const IconListCompose = compose(
	withColibriDataAutoSave(computed),
	withStyledElements(useStylesMapper)
);

const IconList = IconListCompose(Component);

export { IconList };
