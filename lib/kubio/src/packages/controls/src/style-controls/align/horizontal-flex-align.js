import { horizontalAlignFlexOptions } from '../ui-utils';
import { HorizontalAlignBase } from './horizontal-align-base';

const HorizontalFlexAlign = ( props ) => {
	return (
		<HorizontalAlignBase
			options={ horizontalAlignFlexOptions }
			{ ...props }
		/>
	);
};

export { HorizontalFlexAlign };
