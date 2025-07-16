import {
	CustomHeightControl,
	CustomWidthControl,
	HorizontalTextAlignControlWithPath,
	ToggleGroup,
	UIUtils,
	VerticalAlignControlWithPath,
	KubioPanelBody,
} from '@kubio/controls';
import {
	useGroupDispatch,
	withComputedData,
	useDataHelperPathForStyle,
} from '@kubio/core';
import { columnWidth as columnWidthType } from '@kubio/style-manager';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { ColumnElementsEnum } from '../../elements';
import { getConvertedColumnWidthByMedia } from '../../utils';

const ColumnWidthTypes = columnWidthType.ColumnWidthTypes;

const LayoutSection_ = ({ computed, onlyEqualWidth = false }) => {
	return (
		<KubioPanelBody title={__('Layout', 'kubio')}>
			{!onlyEqualWidth && (
				<CustomWidthControl
					{...computed?.widthProps}
					label={__('Column width', 'kubio')}
				/>
			)}

			{(computed?.widthProps?.equalWidth || onlyEqualWidth) && (
				<ToggleGroup
					options={UIUtils.itemsPerRowOptions}
					label={__('Columns per row', 'kubio')}
					{...computed?.row}
				/>
			)}

			<CustomHeightControl
				label={__('Column height', 'kubio')}
				{...computed?.heightProps}
			/>

			<VerticalAlignControlWithPath
				path="layout.verticalAlign"
				type="prop"
				media={'current'}
				label={__('Content vertical position', 'kubio')}
			/>

			<HorizontalTextAlignControlWithPath
				path="textAlign"
				type="style"
				style={ColumnElementsEnum.INNER}
				label={__('Horizontal align', 'kubio')}
			/>
		</KubioPanelBody>
	);
};

const LayoutSection = compose([
	withComputedData((dataHelper) => {
		const applyGroupDispatch = useGroupDispatch();

		const rowDataHelper = dataHelper.withParent();

		const columnWidth = useDataHelperPathForStyle(
			dataHelper,
			'columnWidth',
			{
				local: true,
				styledComponent: ColumnElementsEnum.CONTAINER,
			}
		);

		const widthProps = useMemo(
			() => ({
				equalWidth: rowDataHelper.getProp('layout.equalWidth'),
				onEqualWidthChange: (newValue, newType) => {
					const newWidths = getConvertedColumnWidthByMedia(
						rowDataHelper.getPropByMedia('layout'),
						newValue
					);

					applyGroupDispatch(async () => {
						dataHelper.withSiblings().forEach((childDataHelper) => {
							Object.keys(newWidths).forEach((media) => {
								let newWidth = newWidths[media];
								if (
									!newValue &&
									childDataHelper.clientId ===
										dataHelper.clientId &&
									newType !== ColumnWidthTypes.CUSTOM
								) {
									newWidth = {
										type: newType,
									};
								}
								childDataHelper.setLocalStyle(
									'columnWidth',
									newWidth,
									{
										styledComponent:
											ColumnElementsEnum.CONTAINER,
										media,
									}
								);
							});
						});

						rowDataHelper.setProp('layout.equalWidth', newValue);
					}, true);
				},
			}),
			[rowDataHelper.getHash()]
		);

		const heightProps = useDataHelperPathForStyle(
			dataHelper,
			'customHeight',
			{
				styledComponent: ColumnElementsEnum.INNER,
			},
			{}
		);

		const row = useMemo(() => {
			return rowDataHelper.usePropPath('layout.itemsPerRow', {
				media: 'current',
			});
		}, [rowDataHelper]);

		return {
			row,
			heightProps,
			widthProps: {
				...columnWidth,
				...widthProps,
			},
		};
	}),
])(LayoutSection_);

export { LayoutSection };
