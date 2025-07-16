/**
 * External dependencies
 */
import { noop } from 'lodash';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import UnitControl from './unit-control';
import { getAllValue, isValuesMixed, isValuesDefined } from './utils';

export default function AllInputControl( {
	onChange = noop,
	onFocus = noop,
	onHoverOn = noop,
	onHoverOff = noop,
	values,
	...props
} ) {
	const allValue = getAllValue( values, props?.units );
	const hasValues = isValuesDefined( values );
	const isMixed = hasValues && isValuesMixed( values );

	const handleOnFocus = ( event ) => {
		onFocus( event, { side: 'all' } );
	};

	const handleOnChange = ( next ) => {
		onChange( {
			top: next,
			bottom: next,
			left: next,
			right: next,
		} );
	};

	// In case we switch from mixed values to equal values, we spread the top value to all sides.
	useEffect( () => {
		if ( ! isMixed ) {
			return;
		}

		handleOnChange( values?.top );
	}, [ isMixed ] );

	const handleOnHoverOn = () => {
		onHoverOn( {
			top: true,
			bottom: true,
			left: true,
			right: true,
		} );
	};

	const handleOnHoverOff = () => {
		onHoverOff( {
			top: false,
			bottom: false,
			left: false,
			right: false,
		} );
	};

	return (
		<UnitControl
			{ ...props }
			isOnly
			value={ allValue }
			onChange={ handleOnChange }
			onFocus={ handleOnFocus }
			onHoverOn={ handleOnHoverOn }
			onHoverOff={ handleOnHoverOff }
		/>
	);
}
