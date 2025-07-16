import { CanvasResizeControl } from '@kubio/controls';
import {
	normalizeTemplateLock,
	refreshOnParentChange,
	useDataHelperDefaultOptionsContext,
	withColibriDataAutoSave,
	withContainerBase,
	withDynamicStyles,
	withStyledElements,
} from '@kubio/core';
import { dynamicStylesTransforms, LayoutHelper } from '@kubio/style-manager';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { useKubioInnerBlockProps } from '../common/hooks/use-kubio-inner-block-props';
import { Toolbar } from '../row/toolbar';
import { ReorderBlocksControls } from '../row/toolbar/reorder-blocks-controls';
import { ColumnElementsEnum } from './elements';
import { BlockSettingsControls } from './toolbar/block-settings-controls';
import { useOnResizeChange } from './use-canvas-resize-hook';
import { renderToString } from '@wordpress/element';
const SNAP_PERCENTS = [
	{
		label: __('A quarter', 'kubio'),
		value: 25,
	},
	{
		label: __('A third', 'kubio'),
		value: 33.3333,
	},
	{
		label: __('Half', 'kubio'),
		value: 50,
	},
	{
		label: __('Two thirds', 'kubio'),
		value: 66.6666,
	},
	{
		label: __('Three quarters', 'kubio'),
		value: 75,
	},
];

const Component = (props) => {
	const {
		StyledElements,
		Separators,
		Background,
		dataHelper,
		isSelected,
		computed,
		afterInnerBlocks = null,
	} = props;

	const templateLock = useMemo(
		normalizeTemplateLock(() =>
			dataHelper.getAttribute('templateLock', false)
		),
		[dataHelper]
	);

	const innerBlocksProps = useKubioInnerBlockProps(
		{},
		{
			templateLock,
		}
	);

	useFixCustomHeight(dataHelper, computed);

	const { rowLayoutByMedia } = computed;
	const equalWidth = rowLayoutByMedia?.desktop?.equalWidth;

	const {
		containerRef,
		onChange: onResizeChange,
		referance,
		unit,
	} = useOnResizeChange(dataHelper);

	return (
		<>
			{isSelected && (
				<>
					<ReorderBlocksControls dataHelper={dataHelper} />
					<Toolbar dataHelper={dataHelper.withParent()} />
					<BlockSettingsControls dataHelper={dataHelper} />
				</>
			)}
			<StyledElements.Container ref={containerRef}>
				<StyledElements.Inner>
					<Background />
					<Separators />
					<StyledElements.Align {...innerBlocksProps} />
					{afterInnerBlocks}
				</StyledElements.Inner>
				<CanvasResizeControl
					containerRef={containerRef}
					enabled={!equalWidth}
					onChange={onResizeChange}
					maxToContainer={true}
					clientId={dataHelper.clientId}
					referance={referance}
					affectNext={true}
					forceVisible={isSelected}
					snapPoints={SNAP_PERCENTS}
					tooltipUnit={unit}
				/>
			</StyledElements.Container>
		</>
	);
};

const StyledElementsMapper = ({ computed = {} } = {}) => {
	const {
		isEmpty,
		layoutByMedia,
		rowLayoutByMedia,
		columnWidthByMedia,
		canUseHtml,
		containerClass,
	} = computed;

	const layoutHelper = new LayoutHelper(layoutByMedia, rowLayoutByMedia);

	return {
		[ColumnElementsEnum.CONTAINER]: {
			className: () => {
				let classes = [];

				classes = classes.concat(
					layoutHelper.getColumnLayoutClasses(
						columnWidthByMedia,
						canUseHtml
					),
					layoutHelper.getInheritedColumnVAlignClasses(),
					[containerClass]
				);

				return classes.filter(Boolean);
			},
		},

		[ColumnElementsEnum.INNER]: {
			className: () => {
				let classes = [];

				if (isEmpty) {
					classes.push('h-ui-empty-state-container');
				}

				classes = classes.concat(
					layoutHelper.getColumnInnerGapsClasses()
				);

				return classes;
			},
		},

		[ColumnElementsEnum.ALIGN]: {
			className: () => {
				let classes = [];

				//TODO: this seems wrong as it's not used by media
				const columnWidth = columnWidthByMedia?.desktop;
				const equalWidth = rowLayoutByMedia?.desktop?.equalWidth;
				classes = classes.concat(
					layoutHelper.getColumnContentFlexBasis(
						equalWidth,
						columnWidth
					)
				);

				if (!isEmpty) {
					classes = classes.concat(
						layoutHelper.getSelfVAlignClasses()
					);
				} else {
					classes.push('min-height-100');
				}
				return classes;
			},
		},
	};
};

const useComputed = (dataHelper, ownProps) => {
	const { isEmpty } = ownProps;

	const { defaultOptions } = useDataHelperDefaultOptionsContext();
	const canUseHtml = !defaultOptions?.inheritedAncestor;

	const rowDataHelper = dataHelper.withParent();

	const rowLayoutByMedia = rowDataHelper.getPropByMedia('layout');
	const layoutByMedia = dataHelper.getPropByMedia(`layout`);

	const columnWidthByMedia = dataHelper.getStyleByMedia(
		'columnWidth',
		{},
		{ styledComponent: ColumnElementsEnum.CONTAINER, local: true }
	);

	const customHeightOnContainerPerMedia = dataHelper.getStyleByMedia(
		'customHeight',
		null,
		{
			styledComponent: ColumnElementsEnum.CONTAINER,
			fromRoot: true,
		}
	);

	const isCustomWidth = dataHelper.getStyle('columnWidth.type') === 'custom';
	return {
		rowLayoutByMedia,
		layoutByMedia,
		columnWidthByMedia,
		columnWidthType: dataHelper.getStyle('columnWidth.type'),
		isCustomWidth,
		isEmpty,
		canUseHtml,
		containerClass: ownProps.containerClass,
		customHeightOnContainerPerMedia,
	};
};

function useFixCustomHeight(dataHelper, computed) {
	const { customHeightOnContainerPerMedia } = computed;
	useEffect(() => {
		_.each(customHeightOnContainerPerMedia, (value, media) => {
			if (!value) {
				return;
			}
			dataHelper.setStyle('customHeight', null, {
				styledComponent: ColumnElementsEnum.CONTAINER,
				unset: true,
				media,
			});
			dataHelper.setStyle('customHeight', value, {
				styledComponent: ColumnElementsEnum.INNER,
				media,
			});
		});
	}, []);
}

const ColumnCompose = compose(
	refreshOnParentChange(),
	withSelect((select, ownProps) => {
		const { clientId } = ownProps;
		const { getBlockOrder } = select('core/block-editor');

		return {
			isEmpty: getBlockOrder(clientId).length === 0,
		};
	}),
	withColibriDataAutoSave(useComputed),
	withDynamicStyles((dataHelper) => {
		const spaceByMedia = dataHelper.getPropByMedia('layout.vSpace', {});
		return {
			[ColumnElementsEnum.VSPACE]: dynamicStylesTransforms.vSpace(
				spaceByMedia
			),
		};
	}),
	withStyledElements(StyledElementsMapper),
	withContainerBase()
);

const Column = ColumnCompose(Component);

export { Column };
