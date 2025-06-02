import _ from 'lodash';
import { PRESETS } from './presets';
import { getTransformValueWithPerspectiveScaled } from './config';

import isEqual from 'react-fast-compare';

const TransformPresetsControl = (props) => {
	const { parser, onSelect, currentValues } = props;
	const selectedIndex = _.findIndex(PRESETS, (preset) => {
		return isEqual(currentValues, preset);
	});

	return (
		<>
			<div className="box-shadow-preset__container">
				<div className={'box-shadow-preset__scroll-area'}>
					{PRESETS.map((preset, index) => {
						return (
							<PresetPreview
								key={index}
								preset={preset}
								onSelect={onSelect}
								parser={parser}
								selected={
									selectedIndex === index ? true : false
								}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
};

const PresetPreview = ({ preset, onSelect, parser, selected = false }) => {
	const scaledPreset = getTransformValueWithPerspectiveScaled(preset);
	return (
		<button
			className={
				selected
					? 'box-shadow-preset__item active'
					: 'box-shadow-preset__item'
			}
			onClick={() => onSelect(preset)}
		>
			<div className="kubio-transform-preview" />
			<div
				className="kubio-transform-preview"
				style={parser(scaledPreset)}
			/>
		</button>
	);
};

export { TransformPresetsControl };
