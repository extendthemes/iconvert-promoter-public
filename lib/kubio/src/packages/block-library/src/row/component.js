import {
	normalizeTemplateLock,
	withColibriDataAutoSave,
	withContainerBase,
	withRemoveOnEmptyInnerBlocks,
	withStyledElements,
} from '@kubio/core';
import { LayoutHelper } from '@kubio/style-manager';
import { compose } from '@wordpress/compose';
import { isFunction } from 'lodash';
import NamesOfBlocks from '../blocks-list';
import { useKubioInnerBlockProps } from '../common/hooks/use-kubio-inner-block-props';
import { StylesEnum } from './elements';
import { Toolbar } from './toolbar';
import { BlockSettingsControls } from './toolbar/block-settings-controls';
import { ReorderBlocksControls } from './toolbar/reorder-blocks-controls';

const ALLOWED_BLOCKS = [NamesOfBlocks.COLUMN];

const Component = (props) => {
	const {
		StyledElements,
		Separators,
		Background,
		allowedBlocks = ALLOWED_BLOCKS,
		innerBlocks = undefined,
		onInnerBlocksChange,
		onInnerBlocksInput,
		templateLock: templateLockProp = false,
		dataHelper,
		isSelected,
		customContainerProps = {},
		customInnerStyledElement = null,
	} = props;
	const templateLock = normalizeTemplateLock(
		props.dataHelper.getAttribute('templateLock', templateLockProp)
	);

	// const blockProps = useBlockProps();
	const innerBlocksProps = useKubioInnerBlockProps(
		{},
		{
			allowedBlocks,
			orientation: 'horizontal',
			value: innerBlocks,
			templateLock,
			renderAppender: false,
			onChange: onInnerBlocksChange,
			oninput: onInnerBlocksInput,
		}
	);
	return (
		<>
			{isSelected && (
				<>
					<ReorderBlocksControls dataHelper={dataHelper} />
					<Toolbar {...props} />
					<BlockSettingsControls dataHelper={dataHelper} />
				</>
			)}
			<StyledElements.Container {...customContainerProps}>
				<Background />
				<Separators />
				{!customInnerStyledElement && (
					<StyledElements.Inner {...innerBlocksProps} />
				)}
				{!!customInnerStyledElement &&
				isFunction(customInnerStyledElement)
					? customInnerStyledElement(StyledElements, innerBlocksProps)
					: customInnerStyledElement}
			</StyledElements.Container>
		</>
	);
};

const StylesMapper = (props) => {
	const { computed = {} } = props;
	const { layoutByMedia } = computed;
	const layoutHelper = new LayoutHelper(layoutByMedia);
	return {
		[StylesEnum.CONTAINER]: {
			className: () =>
				[
					computed.containerClass,
					...layoutHelper.getRowGapClasses(),
				].filter(Boolean),
		},
		[StylesEnum.INNER]: {
			className: () => {
				let classes = [];
				classes = classes.concat(
					layoutHelper.getRowAlignClasses(),
					layoutHelper.getRowGapInnerClasses()
				);

				return classes;
			},
		},
	};
};

const computed = (dataHelper, ownProps) => {
	return {
		layoutByMedia: dataHelper.getPropByMedia('layout'),
		containerClass: ownProps.containerClass,
	};
};

const RowCompose = compose(
	withRemoveOnEmptyInnerBlocks(),
	withColibriDataAutoSave(computed),
	withStyledElements(StylesMapper),
	withContainerBase()
);

const Row = RowCompose(Component);

export { Row };
