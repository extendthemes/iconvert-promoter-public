import {
	horizontalTextAlignOptionsSimple,
	horizontalTextAlignOptions,
	horizontalAlignFlexOptionsText,
} from '../ui-utils';
import { HorizontalAlignBase } from './horizontal-align-base';

import { HorizontalTextAlignValues } from '@kubio/style-manager';
import {
	HorizontalAlignCenter,
	HorizontalAlignLeft,
	HorizontalAlignRight,
} from '@kubio/icons';
import { useMemo } from '@wordpress/element';

const textAlignWithHorizontalAlignIcons = horizontalTextAlignOptionsSimple.map(
	( alignOption ) => {
		let icon = alignOption.icon;
		switch ( alignOption.value ) {
			case HorizontalTextAlignValues.LEFT:
				icon = HorizontalAlignLeft;
				break;
			case HorizontalTextAlignValues.CENTER:
				icon = HorizontalAlignCenter;
				break;
			case HorizontalTextAlignValues.RIGHT:
				icon = HorizontalAlignRight;
		}
		return {
			...alignOption,
			icon,
		};
	}
);

const HorizontalTextAlign = ( props = {} ) => {
	const {
		useContentAlignIcons = true,
		useHorizontalAlignFlexOptions = false,
		skipJustify = false,
		...rest
	} = props;

	const options = useMemo( () => {
		let nextOptions;
		if ( useContentAlignIcons ) {
			nextOptions = textAlignWithHorizontalAlignIcons;
		} else if ( useHorizontalAlignFlexOptions ) {
			nextOptions = horizontalAlignFlexOptionsText;
		} else {
			nextOptions = horizontalTextAlignOptions;
			if ( skipJustify ) {
				nextOptions = nextOptions.slice( 0, 3 );
			}
		}

		return nextOptions;
	}, [ useContentAlignIcons, useHorizontalAlignFlexOptions ] );

	return <HorizontalAlignBase options={ options } { ...rest } />;
};

export { HorizontalTextAlign };
