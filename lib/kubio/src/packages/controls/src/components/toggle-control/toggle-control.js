import { ToggleControl as ToggleControl_ } from '@wordpress/components';
import classNames from 'classnames';
const ToggleControl = (props) => {
	const { value = null, onChange, ...rest } = props;
	return (
		<>
			<ToggleControl_
				className={classNames('kubio-toggle-control', 'kubio-control')}
				{...rest}
				checked={value}
				onChange={onChange}
			/>
		</>
	);
};

export { ToggleControl };
