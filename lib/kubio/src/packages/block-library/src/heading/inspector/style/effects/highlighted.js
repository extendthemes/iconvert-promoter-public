import {
	ColorWithPath,
	InputControlWithPath,
	RangeWithUnitWithPath,
	SelectControlWithPath,
	SeparatorHorizontalLine,
	ToggleControl,
	ToggleControlWithPath,
} from '@kubio/controls';
import { withComputedData, WithDataPathTypes } from '@kubio/core';
import { properties } from '../../../config';
import { ElementsEnum } from '../../../elements';
import { __ } from '@wordpress/i18n';

const Component_ = ({ computed }) => {
	const { useRoundEdges } = computed;

	return (
		<>
			<SelectControlWithPath
				label={__('Type shape', 'kubio')}
				type={WithDataPathTypes.PROP}
				path="fancy.typeShape"
				options={properties.typeHighlightedOptions}
			/>

			<SeparatorHorizontalLine />

			<InputControlWithPath
				label={__('Highlighted Word', 'kubio')}
				type={WithDataPathTypes.PROP}
				path="fancy.fancyWord"
			/>
			<ColorWithPath
				label={__('Color', 'kubio')}
				path={'stroke.color'}
				style={ElementsEnum.SVG}
				type={WithDataPathTypes.STYLE}
			/>
			<RangeWithUnitWithPath
				label={__('Width', 'kubio')}
				path={'stroke.width'}
				style={ElementsEnum.SVG}
				type={WithDataPathTypes.STYLE}
				{...properties.offsetStrokeWidthOptions}
			/>
			<ToggleControlWithPath
				label={__('Bring to front', 'kubio')}
				type={WithDataPathTypes.PROP}
				path="fancy.bringToFront"
			/>
			<ToggleControl
				label={__('Rounded edges', 'kubio')}
				type={WithDataPathTypes.PROP}
				{...useRoundEdges}
			/>
		</>
	);
};
const computed = (dataHelper) => {
	const useRoundEdgesOnChange = (value) => {
		const options = {
			styledComponent: ElementsEnum.SVG,
		};

		if (value) {
			dataHelper.setStyle('stroke.linejoin', 'round', options);
			dataHelper.setStyle('stroke.linecap', 'round', options);
		} else {
			dataHelper.setStyle('stroke.linejoin', 'initial', options);
			dataHelper.setStyle('stroke.linecap', 'initial', options);
		}

		dataHelper.setProp('fancy.useSmallHeader', value);
	};

	const useRoundEdges = {
		value: dataHelper.getProp('fancy.useSmallHeader'),
		onChange: useRoundEdgesOnChange,
	};
	return { useRoundEdges };
};
const Component = withComputedData(computed)(Component_);
export default Component;
