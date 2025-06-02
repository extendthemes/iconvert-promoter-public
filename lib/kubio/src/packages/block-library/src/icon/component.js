import { compose } from '@wordpress/compose';
import {
	withColibriData,
	withStyledElements,
	withRedirectSelectionToParentCondition,
} from '@kubio/core';
import { ElementsEnum } from './elements';
import { LinkWrapper, CanvasIcon } from '@kubio/controls';
import NamesOfBlocks from '../blocks-list';

const Component = (props) => {
	const { computed, StyledElements } = props;
	const { name, link } = computed;
	return (
		<StyledElements.Outer>
			<LinkWrapper link={link}>
				<StyledElements.Inner tag={CanvasIcon} name={name} />
			</LinkWrapper>
		</StyledElements.Outer>
	);
};

const stylesMapper = ({ computed } = {}) => {
	return {
		[ElementsEnum.OUTER]: {},
		[ElementsEnum.INNER]: {},
	};
};

const computed = (dataHelper, ownProps) => {
	return {
		name: dataHelper.getAttribute('name'),
		link: dataHelper.getAttribute('link'),
	};
};

const IconCompose = compose(
	withColibriData(computed),
	withStyledElements(stylesMapper),
	withRedirectSelectionToParentCondition([NamesOfBlocks.DOWN_ARROW])
);

const Icon = IconCompose(Component);
const IconSave = IconCompose(Component);

export { Icon, IconSave };
