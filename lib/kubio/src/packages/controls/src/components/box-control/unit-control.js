import { noop } from 'lodash';
import { useHover } from 'react-use-gesture';

import { Tooltip } from '@wordpress/components';
import { UnitControlWrapper, UnitControl } from './styles/box-control-styles';

export default function BoxUnitControl( {
	isFirst,
	isLast,
	isOnly,
	onHoverOn = noop,
	onHoverOff = noop,
	label,
	value,
	min = -Infinity,
	...props
} ) {
	const bindHoverGesture = useHover( ( { event, ...state } ) => {
		if ( state.hovering ) {
			onHoverOn( event, state );
		} else {
			onHoverOff( event, state );
		}
	} );

	return (
		<UnitControlWrapper aria-label={ label } { ...bindHoverGesture() }>
			<Tooltip text={ label }>
				<UnitControl
					min={ min }
					className="component-box-control__unit-control"
					hideHTMLArrows
					isFirst={ isFirst }
					isLast={ isLast }
					isOnly={ isOnly }
					value={ value }
					{ ...props }
				/>
			</Tooltip>
		</UnitControlWrapper>
	);
}
