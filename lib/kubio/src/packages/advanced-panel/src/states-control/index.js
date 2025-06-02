import { get, find, isEmpty, upperFirst } from 'lodash';

import {
	__experimentalRadio as Radio,
	__experimentalRadioGroup as RadioGroup,
} from '@wordpress/components';
import { statesById } from '@kubio/style-manager';

const getAvailableElementStates = ({ selectedElement }) => {
	let states = [];
	if (selectedElement) {
		states = get(selectedElement, 'supports.states', ['normal', 'hover']);
	}
	return states;
};

const StatesControl = ({
	activeState,
	setActiveState,
	availableStates = [],
	selectedElement = null,
	label = null,
}) => {
	const states = isEmpty(availableStates)
		? getAvailableElementStates({ selectedElement })
		: availableStates;

	const onStateChange = (state) => setActiveState(statesById[state]?.value);

	const activeStateSlug = find(statesById, { value: activeState })?.id;

	if (states.length <= 1) {
		return false;
	}

	return (
		<>
			<div className={'kubio-states-control-label'}>{label}</div>

			<RadioGroup
				id={'kubio-states-control'}
				className={'kubio-states-control-radio-group'}
				defaultChecked={activeState}
				checked={activeStateSlug}
				onChange={onStateChange}
			>
				{states.map((state) => {
					return (
						<Radio key={state} value={statesById[state]?.id}>
							{statesById[state]?.label ?? upperFirst(state)}
						</Radio>
					);
				})}
			</RadioGroup>
		</>
	);
};

export { StatesControl, getAvailableElementStates };
