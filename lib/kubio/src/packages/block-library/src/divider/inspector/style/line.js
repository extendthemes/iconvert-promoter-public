import { __ } from '@wordpress/i18n';
import {
	SeparatorHorizontalLine,
	ColorWithPath,
	RangeWithUnitControl,
	RangeWithUnitWithPath,
	SelectControlWithPath,
	KubioPanelBody,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { ElementsEnum } from '../../elements';
import { lineTypes } from '../../config';

const commonOptions = {
	type: WithDataPathTypes.STYLE,
	style: ElementsEnum.LINE,
};

const widthUnitsOptions = [
	{ label: 'PX', value: 'px' },
	{ label: '%', value: '%' },
];

const widthUnitsConfig = {
	px: {
		min: 0,
		max: 500,
		step: 1,
	},
	'%': {
		min: 0,
		max: 100,
		step: 1,
	},
};

const THICKNESS_RESET_VALUE = 3;

const widthOptions = {
	units: widthUnitsOptions,
	optionsByUnit: widthUnitsConfig,
};

const Panel_ = ({ computed } = props) => {
	const { spacing } = computed;

	return (
		<KubioPanelBody title={__('Line', 'kubio')}>
			<ColorWithPath
				label={__('Color', 'kubio')}
				path={'border.bottom.color'}
				{...commonOptions}
			/>
			<SelectControlWithPath
				label={__('Line type', 'kubio')}
				type={WithDataPathTypes.ATTRIBUTE}
				path={'border.bottom.style'}
				className={'line-type'}
				options={lineTypes}
				{...commonOptions}
			/>

			<SeparatorHorizontalLine />

			<RangeWithUnitWithPath
				label={__('Thickness', 'kubio')}
				min={1}
				max={10}
				path={'border.bottom.width'}
				resetValue={THICKNESS_RESET_VALUE}
				{...commonOptions}
			/>
			<RangeWithUnitWithPath
				label={__('Width', 'kubio')}
				path={'width'}
				{...widthOptions}
				type={WithDataPathTypes.STYLE}
				style={ElementsEnum.WIDTH_CONTAINER}
			/>
			<RangeWithUnitControl
				label={__('Vertical spacing', 'kubio')}
				max={100}
				min={0}
				{...spacing}
			/>
		</KubioPanelBody>
	);
};

const computed = (dataHelper) => {
	const onChangeSpacing = (event) => {
		const storeOptions = { styledComponent: ElementsEnum.OUTER };
		dataHelper.setStyle('padding.top', event, storeOptions);
		dataHelper.setStyle('padding.bottom', event, storeOptions);
	};

	const spacing = {
		value: dataHelper.getStyle('padding.top', null, {
			styledComponent: ElementsEnum.OUTER,
		}),
		onChange: onChangeSpacing,
	};
	return { spacing };
};

const Panel = withComputedData(computed)(Panel_);

export default Panel;
