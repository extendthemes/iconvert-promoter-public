import { withColibriPath } from '@kubio/core';
import GutentagRangeControl from '../../components/range-control/range-control';

const GutentagRangeControlWithPath = withColibriPath((props) => {
	return <GutentagRangeControl allowReset {...props} />;
});

export { GutentagRangeControlWithPath };
