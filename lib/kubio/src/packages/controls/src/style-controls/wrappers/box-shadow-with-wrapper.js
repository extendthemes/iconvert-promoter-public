import { withColibriPathWithOptions } from '@kubio/core';
import { BoxShadowControl } from '../box-shadow';

const BoxShadowWithPath = withColibriPathWithOptions({ mergeArrays: true })(
	BoxShadowControl
);

export { BoxShadowWithPath };
