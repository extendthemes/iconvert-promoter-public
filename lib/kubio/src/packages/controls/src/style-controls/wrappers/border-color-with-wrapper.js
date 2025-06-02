import { setSidesData, unsetSidesData } from '@kubio/utils';
import { UNSET_VALUE } from '@kubio/constants';
import { withComputedData } from '@kubio/core';
import { ColorIndicatorPopover } from '../../components';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';

const BorderColor_ = (props) => {
	const {
		computed,
		showReset = true,
		label = __('Border color', 'kubio'),
	} = props;
	const { borderColor } = computed;
	return (
		<ColorIndicatorPopover
			label={label}
			{...borderColor}
			showReset={showReset}
		/>
	);
};

const useComputed = (dataHelper, ownProps) => {
	const { storeOptions = {} } = ownProps;

	const setBorderColor = (newValue) => {
		const newBorder = setSidesData('color', newValue);
		dataHelper.setStyle('border', newBorder, storeOptions);
	};
	const borderColor = {
		value: dataHelper.getStyle('border.top.color', undefined, storeOptions),
		onChange: setBorderColor,
		onReset: () => {
			const sides = ['top', 'bottom', 'left', 'right'];
			sides.forEach((side) => {
				const path = `border.${side}.color`;
				dataHelper.setStyle(path, null, {
					...storeOptions,
					unset: true,
				});
			});
		},
	};

	return {
		borderColor,
	};
};

const BorderColorWithData = withComputedData(useComputed)(BorderColor_);

export { BorderColorWithData };
