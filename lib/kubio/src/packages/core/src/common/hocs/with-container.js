import { compose } from '@wordpress/compose';
import { withSeparators } from './with-separators';
import { withBackground } from './with-background';

const withContainerBase = () => {
	return compose( withSeparators(), withBackground() );
};

export { withContainerBase };
