import { compose } from '@wordpress/compose';

import { withColibriData, withStyledElements } from '@kubio/core';
import { CanvasIcon } from '@kubio/controls';
import { ElementsEnum } from './elements';
import { dividerTypes } from './config';

const Component = (props) => {
	const { computed, StyledElements } = props;
	const { type, icon } = computed;

	return (
		<StyledElements.Outer>
			<StyledElements.WidthContainer>
				<StyledElements.Line />
				{type === dividerTypes.ICON ? (
					<>
						<StyledElements.Inner tag={CanvasIcon} name={icon} />
						<StyledElements.Line />
					</>
				) : null}
			</StyledElements.WidthContainer>
		</StyledElements.Outer>
	);
};

const stylesMapper = ({ computed } = {}) => {
	return {
		[ElementsEnum.OUTER]: {
			className: () => {
				return [];
			},
		},
		[ElementsEnum.LINE]: {
			className: () => {
				return [];
			},
		},
		[ElementsEnum.INNER]: {
			className: () => {
				return [];
			},
		},
	};
};

const computed = (dataHelper) => {
	return {
		type: dataHelper.getProp('type'),
		icon: dataHelper.getAttribute('iconName', ''),
	};
};

const DividerCompose = compose(
	withColibriData(computed),
	withStyledElements(stylesMapper)
);

const Divider = DividerCompose(Component);

export { Divider };
