import { withKubioBlockContext, withObserveOtherBlocks } from '@kubio/core';
import { compose } from '@wordpress/compose';

const DataHelperContextFromClientId_ = ({ children }) => {
	return children;
};

const DataHelperContextFromClientId = compose([
	withObserveOtherBlocks((select, { clientId }) => clientId),
	withKubioBlockContext,
])(DataHelperContextFromClientId_);

export { DataHelperContextFromClientId };
