import { withColibriPath } from '@kubio/core';
import { URLInput } from '../components';

const URLInputWithPath_ = ({ value, onChange, label }) => {
	return <URLInput label={label} value={value} onChange={onChange} />;
};

const URLInputWithPath = withColibriPath(URLInputWithPath_);
export { URLInputWithPath };
