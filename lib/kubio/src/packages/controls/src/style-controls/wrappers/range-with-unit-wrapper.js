import { withColibriPath } from '@kubio/core';
import { RangeWithUnitControl } from '../../components/range-with-unit/range-with-unit';

const RangeWithUnitWithPath = withColibriPath((props) => {
	return <RangeWithUnitControl allowReset {...props} />;
});

export { RangeWithUnitWithPath };
