import { __ } from '@wordpress/i18n';
import { ElementsEnum } from '../../elements';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import {
	BordersAndRadiusWithPath,
	ColorWithPath,
	GradientColorPickerWithPath,
	RangeWithUnitControl,
	SeparatorHorizontalLine,
	ToggleGroup,
	KubioPanelBody,
} from '@kubio/controls';
import { useState } from '@wordpress/element';

// eslint-disable-next-line no-undef
const Panel_ = ({ computed, styledElement = ElementsEnum.INNER } = props) => {
	const { spacing } = computed;
	const commonOptions = {
		type: WithDataPathTypes.STYLE,
		style: styledElement,
	};
	const stateValues = {
		NORMAL: 'normal',
		HOVER: 'hover',
	};
	const stateOptions = [
		{ value: stateValues.NORMAL, label: __('Normal', 'kubio') },
		{ value: stateValues.HOVER, label: __('Hover', 'kubio') },
	];
	const [state, setState] = useState(stateValues.NORMAL);

	const onStateChange = (event) => {
		setState(event);
	};

	return (
		<KubioPanelBody
			title={__('Background and border', 'kubio')}
			initialOpen={false}
		>
			<ToggleGroup
				options={stateOptions}
				value={state}
				onChange={onStateChange}
			/>
			<GradientColorPickerWithPath
				label={__('Icon background', 'kubio')}
				path={'background'}
				state={state}
				{...commonOptions}
			/>
			<ColorWithPath
				label={__('Border color', 'kubio')}
				path={[
					'border.top.color',
					'border.bottom.color',
					'border.left.color',
					'border.right.color',
				]}
				state={state}
				{...commonOptions}
			/>

			<SeparatorHorizontalLine />

			<RangeWithUnitControl label={__('Spacing', 'kubio')} {...spacing} />
			<SeparatorHorizontalLine />

			<BordersAndRadiusWithPath
				path={'border'}
				{...commonOptions}
				withColor={false}
			/>
		</KubioPanelBody>
	);
};

const computed = (dataHelper, ownProps) => {
	const { styledElement = ElementsEnum.INNER } = ownProps;
	const onChangeSpacing = (event) => {
		const storeOptions = { styledComponent: styledElement };
		dataHelper.setStyle('padding.top', event, storeOptions);
		dataHelper.setStyle('padding.bottom', event, storeOptions);
		dataHelper.setStyle('padding.left', event, storeOptions);
		dataHelper.setStyle('padding.right', event, storeOptions);
	};

	const spacing = {
		value: dataHelper.getStyle('padding.top', null, {
			styledComponent: styledElement,
		}),
		onChange: onChangeSpacing,
	};
	return { spacing };
};
const Panel = withComputedData(computed)(Panel_);
export default Panel;
