import { withColibriPath } from '@kubio/core';
import { URLInput } from '../../components';
import { BaseControl, Button } from '@wordpress/components';
import { cog } from '@wordpress/icons';

const URLInputWithPath_ = ({
	value,
	onChange,
	label,
	allowSettings,
	autoFocus,
	onClick,
}) => {
	return (
		<>
			<URLInput
				label={label}
				value={value}
				onChange={onChange}
				allowSettings={allowSettings}
				onClick={onClick}
				autoFocus={autoFocus}
			/>
		</>
	);
};

const URLInputWithPath = withColibriPath(URLInputWithPath_);
export { URLInputWithPath };
