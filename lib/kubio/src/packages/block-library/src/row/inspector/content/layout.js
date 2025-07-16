import { __ } from '@wordpress/i18n';
import {
	KubioPanelBody,
	ToggleControl,
	ToggleControlWithPath,
	ToggleGroupWithPath,
	UIUtils,
} from '@kubio/controls';

import { ColumnElementsEnum } from '../../../column/elements';
import { compose } from '@wordpress/compose';
import { getConvertedColumnWidthByMedia } from '../../../column/utils';
import {
	silentDispatch,
	useGroupDispatch,
	withComputedData,
} from '@kubio/core';

const LayoutSection_ = ({
	computed,
	onlyEqualWidth = false,
	supportsEqualHeightColumns = true,
	afterLayoutAndSpacing,
}) => {
	return (
		<KubioPanelBody title={__('Layout', 'kubio')}>
			{!onlyEqualWidth && (
				<ToggleControl
					label={__('Equal width columns', 'kubio')}
					{...computed?.equalWidth}
				/>
			)}

			{(computed?.equalWidth.value || onlyEqualWidth) && (
				<ToggleGroupWithPath
					options={UIUtils.itemsPerRowOptions}
					label={__('Columns per row', 'kubio')}
					type="prop"
					path="layout.itemsPerRow"
					media={'current'}
				/>
			)}

			{supportsEqualHeightColumns && (
				<ToggleControlWithPath
					label={__('Equal height columns', 'kubio')}
					type="prop"
					media={'current'}
					path="layout.equalHeight"
				/>
			)}
			{afterLayoutAndSpacing}
		</KubioPanelBody>
	);
};

const LayoutSection = compose([
	withComputedData((dataHelper) => {
		const applyGroupDispatch = useGroupDispatch();
		return {
			equalWidth: {
				value: dataHelper.getProp('layout.equalWidth'),
				onChange: (newValue) => {
					const newWidths = getConvertedColumnWidthByMedia(
						dataHelper.getPropByMedia('layout'),
						newValue
					);
					applyGroupDispatch(async () => {
						dataHelper.withChildren().forEach((childDataHelper) => {
							Object.keys(newWidths).forEach((media) => {
								const newWidth = newWidths[media];
								silentDispatch(() => {
									childDataHelper.setLocalStyle(
										'columnWidth',
										newWidth,
										{
											styledComponent:
												ColumnElementsEnum.CONTAINER,
											media,
											skipSharedStyle: true,
										}
									);
								}, true);
							});
						});

						dataHelper.setProp('layout.equalWidth', newValue);
					}, true);
				},
			},
		};
	}),
])(LayoutSection_);
export { LayoutSection };
