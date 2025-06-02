/**
 * External dependencies
 */
import { noop } from 'lodash';
/**
 * Internal dependencies
 */
import UnitControl from './unit-control';
import { getAllValue, isValuesMixed, isValuesDefined } from './utils';
import { useEffect } from '@wordpress/element';

export default function AllInputControl( {
	onChange = noop,
	onFocus = noop,
	onHoverOn = noop,
	onHoverOff = noop,
	values,
	...props
} ) {
	let allValue = getAllValue( values );
	const hasValues = isValuesDefined( values );
	const isMixed = hasValues && isValuesMixed( values );

	const handleOnFocus = ( event ) => {
		onFocus( event, { side: 'all' } );
	};

	const handleOnChange = ( next ) => {
		const nextValues = { ...values };

		nextValues.top = next;
		nextValues.bottom = next;
		nextValues.left = next;
		nextValues.right = next;

		onChange( nextValues );
	};

	useEffect( () => {
		if ( isMixed ) {
			handleOnChange( values?.top );
			allValue = values?.top;
		}
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
