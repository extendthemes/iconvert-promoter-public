import { __ } from '@wordpress/i18n';
import { withColibriDataAutoSave, WithDataPathTypes } from '@kubio/core';
import { ElementsEnum } from '../../elements';
import {
	SeparatorHorizontalLine,
	BordersAndRadiusWithPath,
	BoxShadowWithPath,
	ColorWithPath,
	GradientColorPickerWithPath,
	TypographyControlPopupWithPath,
	ToggleGroup,
	KubioPanelBody,
} from '@kubio/controls';
import { useState } from '@wordpress/element';
import { useInheritedTypographyValue } from '@kubio/global-data';
const commonOptions = {
	type: WithDataPathTypes.STYLE,
	style: ElementsEnum.LINK,
};

const Panel = () => {
	const pickerValues = {
		NORMAL: 'normal',
		HOVER: 'hover',
	};

	const pickerOptions = [
		{ value: pickerValues.NORMAL, label: __('Normal', 'kubio') },
		{ value: pickerValues.HOVER, label: __('Hover', 'kubio') },
	];

	const [state, setState] = useState(pickerValues.NORMAL);

	const defaultTextColors = {
		normal: useInheritedTypographyValue('a', 'color'),
		hover: useInheritedTypographyValue('a', 'states.hover.color'),
	};

	return (
		<KubioPanelBody title={__('Button style', 'kubio')}>
			<ToggleGroup
				options={pickerOptions}
				value={state}
				onChange={(nextState) => setState(nextState)}
			/>

			<GradientColorPickerWithPath
				label={__('Background', 'kubio')}
				path={'background'}
				state={state}
				{...commonOptions}
			/>

			<ColorWithPath
				label={__('Text color', 'kubio')}
				path={'typography.color'}
				state={state}
				{...commonOptions}
				defaultValue={defaultTextColors[state]}
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

			<TypographyControlPopupWithPath
				path={'typography'}
				{...commonOptions}
			/>

			<SeparatorHorizontalLine />

			<BordersAndRadiusWithPath
				path={'border'}
				{...commonOptions}
				withColor={false}
			/>

			<SeparatorHorizontalLine />

			<BoxShadowWithPath path={'boxShadow'} {...commonOptions} />
		</KubioPanelBody>
	);
};

const ButtonStyle = withColibriDataAutoSave()(Panel);

export default ButtonStyle;
