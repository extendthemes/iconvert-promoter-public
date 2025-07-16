import { __ } from '@wordpress/i18n';

import {
	BordersAndRadiusWithPath,
	GradientColorPickerWithPath,
	KubioPanelBody,
	RangeWithUnitControl,
	SeparatorHorizontalLine,
} from '@kubio/controls';

import { withComputedData, WithDataPathTypes } from '@kubio/core';

import { ElementsEnum } from '../../elements';

const Panel_ = ({ computed } = props) => {
	const { spacing } = computed;
	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: ElementsEnum.INNER,
	};
	return (
		<KubioPanelBody title={__('Background and border', 'kubio')}>
			<GradientColorPickerWithPath
				label={__('Icon background', 'kubio')}
				path={'background'}
				{...commonOptions}
			/>
			<GradientColorPickerWithPath
				label={__('Hover Background', 'kubio')}
				path={'background'}
				state={'hover'}
				{...commonOptions}
			/>

			<SeparatorHorizontalLine fit={true} />

			<RangeWithUnitControl label={__('Spacing', 'kubio')} {...spacing} />
			<SeparatorHorizontalLine fit={true} />

			<BordersAndRadiusWithPath path={'border'} {...commonOptions} />
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
