import { withColibriPathWithOptions } from '@kubio/core';
import { BackgroundControl } from '../background-control';

const BackgroundControlWithPath = withColibriPathWithOptions({
	mergeArrays: true,
})(BackgroundControl);

export { BackgroundControlWithPath };
