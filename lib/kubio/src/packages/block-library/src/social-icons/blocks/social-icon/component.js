import { CanvasIcon } from '@kubio/controls';
import { withColibriDataAutoSave, withStyledElements } from '@kubio/core';
import { compose } from '@wordpress/compose';
import { ElementsEnum } from './elements';
import { ToolbarControl } from './toolbar';

const Component = ({ isSelected, StyledElements, clientId, dataHelper }) => {
	return (
		<>
			{isSelected && (
				<ToolbarControl isSelected={isSelected} clientId={clientId} dataHelper={dataHelper}/>
			)}
			<StyledElements.Link>
				<StyledElements.Icon tag={CanvasIcon} shouldRender={true} />
			</StyledElements.Link>
		</>
	);
};

const mapPropsToElements = ({ computed } = {}) => {
	return {
		[ElementsEnum.ICON]: {
			name: computed?.icon?.name,
		},
		[ElementsEnum.LINK]: {},
	};
};

const computed = (dataHelper) => {
	const link = dataHelper.getAttribute('link');
	const icon = dataHelper.getAttribute('icon');

	return {
		link,
		icon,
	};
};

const LinkCompose = compose(
	withColibriDataAutoSave(computed),
	withStyledElements(mapPropsToElements)
);

const Link = LinkCompose(Component);
const LinkSave = LinkCompose(Component);
export { Link, LinkSave, Component };
