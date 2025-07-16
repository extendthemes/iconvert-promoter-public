import { columnGapTypesOptions, columnInnerGapTypesOptions } from '../ui-utils';
import { ToggleGroupWithPath } from './toggle-group-wrapper';
import { ToggleGroup } from '../../components/toggle-group/toggle-group';

const SpacingSelect = (props) => {
	const { ...rest } = props;
	return <ToggleGroup {...rest} options={columnGapTypesOptions} />;
};

const InnerSpacingSelect = (props) => {
	const { ...rest } = props;
	return <ToggleGroup {...rest} options={columnInnerGapTypesOptions} />;
};

const InnerSpacingWithPath = (props) => {
	const { ...rest } = props;
	return (
		<ToggleGroupWithPath {...rest} options={columnInnerGapTypesOptions} />
	);
};

const SpacingWithPath = (props) => {
	const { ...rest } = props;
	return <ToggleGroupWithPath {...rest} options={columnGapTypesOptions} />;
};

export {
	SpacingWithPath,
	SpacingSelect,
	InnerSpacingWithPath,
	InnerSpacingSelect,
};
