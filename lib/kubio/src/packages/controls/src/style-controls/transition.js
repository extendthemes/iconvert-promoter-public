import { RangeWithUnitControl } from '../components';
import { useGlobalDataStyle } from '@kubio/global-data';
import _, { isEmpty } from 'lodash';
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '../components/toggle-control/toggle-control';

const TransitionControl = (props) => {
	const { globalStyleData } = useGlobalDataStyle();
	const {
		onChange = _.noop,
		onReset = _.noop,
		value: currentValue = {},
		filters = {},
	} = props;

	const defaultValue = _.get(
		globalStyleData,
		'style.descendants.transition.duration'
	);

	const value = currentValue?.duration || defaultValue;
	const updateDuration = (duration) => {
		onChange(
			{
				duration,
			},
			null,
			{
				state: 'normal',
			}
		);
	};

	const { manuallyEnabled } = filters;

	const onResetDuration = () => {
		if (manuallyEnabled) {
			return updateDuration(defaultValue);
		}

		onReset('duration', {
			state: 'normal',
		});
	};

	const showEnabledToggle = isEmpty(currentValue) && manuallyEnabled;

	const hasHoverValue = !isEmpty(currentValue);
	const toggleHoverTransition = (nextValue) => {
		if (nextValue) {
			updateDuration(defaultValue);
		} else {
			onReset('duration', {
				state: 'normal',
			});
		}
	};

	return (
		<>
			{manuallyEnabled && (
				<ToggleControl
					label={__('Enable hover transition', 'kubio')}
					value={hasHoverValue}
					onChange={toggleHoverTransition}
				/>
			)}
			{!showEnabledToggle && (
				<RangeWithUnitControl
					value={value}
					onChange={updateDuration}
					onReset={onResetDuration}
					label={'Transition duration'}
					min={0}
					max={5}
					step={0.01}
					defaultUnit={'s'}
				/>
			)}
		</>
	);
};

export { TransitionControl };
