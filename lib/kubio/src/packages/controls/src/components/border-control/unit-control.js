/**
 * External dependencies
 */
import { noop } from 'lodash';
import { useHover } from 'react-use-gesture';

/**
 * Internal dependencies
 */
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

// function Tooltip( { children, text } ) {
// 	if ( ! text ) return children;
//
// 	/**
// 	 * Wrapping the children in a `<div />` as Tooltip as it attempts
// 	 * to render the <UnitControl />. Using a plain `<div />` appears to
// 	 * resolve this issue.
// 	 *
// 	 * Originally discovered and referenced here:
// 	 * https://github.com/WordPress/gutenberg/pull/24966#issuecomment-685875026
// 	 */
// 	return (
// 		<BaseTooltip text={ text } position="top">
// 			<div>{ children }</div>
// 		</BaseTooltip>
// 	);
// }
