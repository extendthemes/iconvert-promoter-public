import { ToggleControl } from '@wordpress/components';
import { withColibriPath } from '@kubio/core';
import { useProModal, isFreeVersion } from '@kubio/pro';

const ToggleControlWithPath_ = (props) => {
	const {
		value,
		onChange,
		isProOnly = false,
		upgradeUrlArgs = {},
		...rest
	} = props;
	const [ProModal, showModal] = useProModal();

	const changeHandler = (newValue) => {
		if (isProOnly && isFreeVersion()) {
			showModal(true);
			return;
		}
		onChange(newValue);
	};
	return (
		<>
			<ToggleControl
				className={'kubio-toggle-control'}
				{...rest}
				checked={value}
				onChange={changeHandler}
			/>
			<ProModal urlArgs={upgradeUrlArgs} />
		</>
	);
};

const ToggleControlWithPath = withColibriPath(ToggleControlWithPath_);
export { ToggleControlWithPath };
