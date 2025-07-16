import { compose } from '@wordpress/compose';

import { withColibriDataAutoSave, withStyledElements } from '@kubio/core';
import { ElementsEnum } from './elements';
import { ShortcodePlaceholder } from '../common/components/shortcode-placeholder';

const Component = (props) => {
	const { computed, StyledElements } = props;
	const { shortcode } = computed;
	return (
		<StyledElements.Outer>
			<ShortcodePlaceholder
				value={shortcode.value}
				onChange={shortcode.onChange}
			/>
		</StyledElements.Outer>
	);
};

const stylesMapper = ({ computed } = {}) => {
	return {
		[ElementsEnum.OUTER]: {},
	};
};

const computed = (dataHelper, ownProps) => {
	const onChange = (event) => {
		dataHelper.setAttribute('shortcode', event);
	};
	const shortcode = {
		value: dataHelper.getAttribute('shortcode'),
		onChange,
	};
	return {
		shortcode,
	};
};

const ShortcodeCompose = compose(
	withColibriDataAutoSave(computed),
	withStyledElements(stylesMapper)
);

const Shortcode = ShortcodeCompose(Component);

export { Shortcode };
