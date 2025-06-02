import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import {
	RangeWithUnitControl,
	BorderControl,
	ToggleControlWithPath,
	KubioPanelBody,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { ElementsEnum } from '../../blocks/icon-list/elements';
import { compose } from '@wordpress/compose';

import { listLayoutValues } from '../../config';

const itemEnum = {
	styledComponent: ElementsEnum.ITEM,
};

const textWrapperEnum = {
	styledComponent: ElementsEnum.TEXTWRAPPER,
};

const ListPanel_ = ({ computed }) => {
	const {
		divider,
		spacingData,
		border,
		borderFilters,
		dividerSize,
	} = computed;

	return (
		<KubioPanelBody title={__('List', 'kubio')}>
			<RangeWithUnitControl
				label={__('Item spacing', 'kubio')}
				{...spacingData}
			/>

			<ToggleControlWithPath
				label={__('Divider', 'kubio')}
				type={WithDataPathTypes.PROP}
				path="divider.enabled"
			/>

			{divider.enabled && (
				<>
					<BorderControl
						{...border}
						showLabel={false}
						showIcon={false}
						filters={borderFilters}
					/>
					<RangeWithUnitControl
						defaultUnit={'%'}
						min={0}
						max={100}
						capMax={true}
						capMin={true}
						{...dividerSize}
					/>
				</>
			)}
		</KubioPanelBody>
	);
};

const useComputed = (dataHelper) => {
	const divider = dataHelper.getProp('divider');

	const layout = dataHelper.getStyle('flexDirection', null, {
		styledComponent: ElementsEnum.OUTER,
	});
	const layoutIsHorizontal = layout === listLayoutValues.HORIZONTAL;
	const layoutIsVertical = layout === listLayoutValues.VERTICAL;

	const getSpacingData = () => {
		const spacingOptions = {
			styledComponent: ElementsEnum.DIVIDERWRAPPER,
		};
		const spacingPath = layoutIsHorizontal ? 'padding.left' : 'padding.top';
		const spacingValue = dataHelper.getStyle(
			spacingPath,
			null,
			spacingOptions
		);

		const onChange = (newValue) => {
			const sides = ['top', 'bottom', 'left', 'right'];
			let padding = sides.reduce((accumulator, side) => {
				_.set(accumulator, [side, 'value'], 0);
			}, {});
			if (layoutIsHorizontal) {
				padding = _.merge(padding, {
					left: newValue,
					right: newValue,
				});
			} else {
				padding = _.merge(padding, {
					top: newValue,
					bottom: newValue,
				});
			}
			dataHelper.setStyle('padding', padding, spacingOptions);
		};

		return {
			value: spacingValue,
			onChange,
			onReset: () => {
				onChange({ unit: 'px', value: 10 });
			},
		};
	};

	const spacingData = getSpacingData();

	const borderSide = layoutIsHorizontal ? 'left' : 'bottom';
	const mirrorBorderSide = layoutIsHorizontal ? 'bottom' : 'left';
	const borderFilters = { sides: [borderSide] };
	const getBorder = () => {
		const storeOptions = {
			styledComponent: ElementsEnum.DIVIDER,
		};
		const value = dataHelper.getStyle('border', {}, storeOptions);
		const onChange = (newValue) => {
			//copy all border changes from the border side used for current layout to the border side used for the
			//other layout. Copy everything except width value, that will remain 0;
			const layoutBorderSideValue = _.get(newValue, borderSide);
			const mirrorBorderSideValue = _.cloneDeep(layoutBorderSideValue);
			_.set(mirrorBorderSideValue, ['width', 'value'], 0);
			_.set(newValue, mirrorBorderSide, mirrorBorderSideValue);
			dataHelper.setStyle('border', newValue, storeOptions);
		};

		const onReset = () => {
			const defaultStyle = {
				style: 'solid',
				color: 'rgb(0,0,0)',
				width: {
					value: 1,
					unit: 'px',
				},
			};

			const sides = ['bottom'];

			const border = {};
			sides.forEach((side) => {
				_.set(border, side, defaultStyle);
			});
			dataHelper.setStyle('border', border, {
				...storeOptions,
				mergeData: false,
			});
		};

		return {
			value,
			onChange,
			onReset,
		};
	};

	const border = getBorder();

	const getDividerSize = () => {
		const label = layoutIsHorizontal
			? __('Height', 'kubio')
			: __('Width', 'kubio');
		const property = layoutIsHorizontal ? 'height' : 'width';
		const storeOptions = {
			styledComponent: ElementsEnum.DIVIDER,
		};
		return {
			label,
			value: dataHelper.getStyle(property, null, storeOptions),
			onChange: (newValue) => {
				dataHelper.setStyle(property, newValue, storeOptions);
			},
			onReset: () => {
				dataHelper.setStyle(
					property,
					{ value: 100, unit: '%' },
					storeOptions
				);
			},
		};
	};

	const dividerSize = getDividerSize();
	return {
		border,
		dividerSize,
		borderFilters,
		spacingData,
		divider,
	};
};

const ListPanel = compose(withComputedData(useComputed))(ListPanel_);

export { ListPanel };
