import { ToggleGroupWithPath } from './toggle-group-wrapper';
import { verticalAlignOptions } from '../ui-utils';

const VerticalAlignControlWithPath = (props) => {
	const { ...rest } = props;
	return (
		<ToggleGroupWithPath
			{...rest}
			allowReset
			options={verticalAlignOptions}
		/>
	);
};

export { VerticalAlignControlWithPath };
