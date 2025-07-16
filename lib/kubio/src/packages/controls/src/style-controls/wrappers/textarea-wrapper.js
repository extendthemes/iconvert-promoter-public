import { TextareaControl, BaseControl } from '@wordpress/components';
import { withColibriPath } from '@kubio/core';

const TextareaControlWithPath_ = (props) => {
	const { value, onChange, ...rest } = props;
	return (
		<>
			<BaseControl className="kubio-control">
				<TextareaControl {...rest} value={value} onChange={onChange} />
			</BaseControl>
		</>
	);
};

const TextareaControlWithPath = withColibriPath(TextareaControlWithPath_);
export { TextareaControlWithPath };
