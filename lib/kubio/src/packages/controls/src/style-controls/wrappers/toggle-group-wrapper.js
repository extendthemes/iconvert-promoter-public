import { withColibriPath } from '@kubio/core';
import { ToggleGroup } from '../../components/toggle-group/toggle-group';

const ToggleGroupWithPath_ = (props) => {
	return <ToggleGroup {...props} />;
};

const ToggleGroupWithPath = withColibriPath(ToggleGroupWithPath_);

export { ToggleGroupWithPath };
