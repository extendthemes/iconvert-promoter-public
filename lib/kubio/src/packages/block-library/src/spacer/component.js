import { ElementsEnum } from './elements';
import { compose } from '@wordpress/compose';
import { withColibriData, withStyledElements } from '@kubio/core';

const Component = (props) => {
	const { StyledElements } = props;
	return <StyledElements.Container />;
};

const SpacerCompose = compose(withColibriData(), withStyledElements());

const Spacer = SpacerCompose(Component);
const SpacerSave = SpacerCompose(Component);

export { Spacer, SpacerSave };
