import { forwardRef } from '@wordpress/element';

const InnerBlocksNoWrapper = forwardRef((props, ref) => {
	const { children } = props;
	return children;
});

export { InnerBlocksNoWrapper };
