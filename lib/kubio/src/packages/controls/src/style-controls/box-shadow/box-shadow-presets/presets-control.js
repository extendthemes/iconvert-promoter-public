import { useState } from '@wordpress/element';
import _ from 'lodash';
import isEqual from 'react-fast-compare';
import { mergeValue } from '../utils';
import { PRESETS } from './presets-list';

const getInnerClasses = (isActive) => {
	let classes = ['box-shadow-preset__item'];
	if (isActive) {
		classes = 'box-shadow-preset__item active';
	}
	return classes;
};
const getInnerPresetStyle = (boxShadow) => {
	const computedStyle = {};
	computedStyle.boxShadow = `${boxShadow.x}px ${boxShadow.y}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color} ${boxShadow.inset}`;
	return computedStyle;
};

const BoxShadowPreset = ({ preset, isActive, onSelect, index }) => {
	const [isSelected, setIsSelected] = useState(false);
	return (
		<div
			className={getInnerClasses(isActive)}
			key={index}
			onClick={() => {
				onSelect(preset);
				setIsSelected(!isSelected);
			}}
		>
			<div
				style={getInnerPresetStyle(preset)}
				className={'box-shadow-preset__item__inner'}
			/>
		</div>
	);
};

const BoxShadowPresetsControl = (props) => {
	const { value, onChange } = props;
	return (
		<div className="box-shadow-preset__container">
			<div className={'box-shadow-preset__scroll-area'}>
				{PRESETS.map((layerPreset, index) =>
					BoxShadowPreset({
						...props,
						preset: layerPreset[0],
						index,
						onSelect: (preset) => {
							const newValue = mergeValue(value, null, {
								...preset,
								color: preset.color,
							});

							onChange(newValue);
						},
						isActive: isEqual(
							_.get(value, 'layers', null),
							layerPreset
						),
					})
				)}
			</div>
		</div>
	);
};

export { BoxShadowPresetsControl };
