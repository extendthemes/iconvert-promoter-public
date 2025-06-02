import { HorizontalAlignBase } from './horizontal-align-base';
import { horizontalAlignOptions } from '../ui-utils';

const HorizontalAlign = ( props ) => {
	return (
		<HorizontalAlignBase options={ horizontalAlignOptions } { ...props } />
	);
};

export { HorizontalAlign };
