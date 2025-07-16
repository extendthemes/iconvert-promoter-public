import isEqual from 'react-fast-compare';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { PRESETS } from './presets-list';

const getInnerClasses = (isActive) => {
	const classes = ['text-shadow-preset__item'];
	if (isActive) {
		classes.push('active');
	}
	return classes.join(' ');
};
const getInnerPresetStyle = (textShadow) => {
	const computedStyle = {};
	computedStyle.textShadow = `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px  ${textShadow.color} `;

	return computedStyle;
};

const textShadowPreset = ({ preset, isActive, onSelect, index }) => {
	return (
		<div className={getInnerClasses(isActive)} key={index}>
			<div
				onClick={() => onSelect(preset)}
				style={getInnerPresetStyle(preset)}
				className={'text-shadow-preset__item__inner'}
			>
				T
			</div>
		</div>
	);
};

const TextShadowPresetsControl = (props) => {
	const { value, onChange } = props;
	const { enabled, normalEnabled, ...newValue } = value;
	return (
		<div className="text-shadow-preset__container">
			<PerfectScrollbar className={'text-shadow-preset__scroll-area'}>
				{PRESETS.map((layerPreset, index) =>
					textShadowPreset({
						...props,
						preset: layerPreset[0],
						index,
						onSelect: (preset) => {
							// const newValue = mergeValue(value, null, preset);
							onChange(preset);
						},
						isActive: isEqual(
							{ color: layerPreset[0].color, ...newValue },
							layerPreset[0]
						),
					})
				)}
			</PerfectScrollbar>
		</div>
	);
};

export { TextShadowPresetsControl };
