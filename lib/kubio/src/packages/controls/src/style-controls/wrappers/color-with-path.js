import { withColibriPath } from '@kubio/core';
import { __ } from '@wordpress/i18n';
import { ColorIndicatorPopover } from '../../components';

const Color = (props) => {
	return (
		<ColorIndicatorPopover
			showReset={true}
			label={__('Color', 'kubio')}
			{...props}
		/>
	);
};
const ColorWithPath = withColibriPath(Color);
export default ColorWithPath;
