import { RangeControl } from '@wordpress/components';
import { withColibriPath } from '@kubio/core';
import GutentagRangeControl from '../../../components/range-control/range-control';

const RangeWithPath = withColibriPath((props) => {
	const { onChange, ...rest } = props;
	return (
		<GutentagRangeControl
			className={'kubio-range-control'}
			allowReset
			{...rest}
			onChange={onChange}
		/>
	);
});

export { RangeWithPath };
