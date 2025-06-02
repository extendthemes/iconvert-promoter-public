import { __ } from '@wordpress/i18n';
import { cloneDeep, each, isEmpty, isNumber, unset } from 'lodash';
import isEqual from 'react-fast-compare';
import { parseUnit } from '../utils/unit-control-utils';

export const LABELS = {
	all: __( 'All', 'kubio' ),
	top: __( 'Top', 'kubio' ),
	bottom: __( 'Bottom', 'kubio' ),
	left: __( 'Left', 'kubio' ),
	right: __( 'Right', 'kubio' ),
	mixed: __( 'Mixed', 'kubio' ),
};

export const DEFAULT_VALUES = {
	top: null,
	right: null,
	bottom: null,
	left: null,
};

export const DEFAULT_VISUALIZER_VALUES = {
	top: false,
	right: false,
	bottom: false,
	left: false,
};

/**
 * Gets an items with the most occurance within an array
 * https://stackoverflow.com/a/20762713
 *
 * @param {Array<any>} arr Array of items to check.
 * @return {any} The item with the most occurances.
 */
function mode( arr ) {
	return arr
		.sort(
			( a, b ) =>
				arr.filter( ( v ) => v === a ).length -
				arr.filter( ( v ) => v === b ).length
		)
		.pop();
}

/**
 * Gets the 'all' input value and unit from values data.
 *
 * @param {Object} values Box values.
 * @return {string} A value + unit for the 'all' input.
 */
export function getAllValue( values = {} ) {
	const parsedValues = Object.values( values ).map( parseUnit );

	const allValues = parsedValues.map( ( value ) => value[ 0 ] );
	const allUnits = parsedValues.map( ( value ) => value[ 1 ] );

	const value = allValues.every( ( v ) => v === allValues[ 0 ] )
		? allValues[ 0 ]
		: '';
	const unit = mode( allUnits );

	/**
	 * The isNumber check is important. On reset actions, the incoming value
	 * may be null or an empty string.
	 *
	 * Also, the value may also be zero (0), which is considered a valid unit value.
	 *
	 * isNumber() is more specific for these cases, rather than relying on a
	 * simple truthy check.
	 */
	const allValue = isNumber( value ) ? `${ value }${ unit }` : null;

	return allValue;
}

export function isValuesMixed( value = {} ) {
	const sides = [];
	each( value, ( sideData, sidePath ) => {
		const cloneData = cloneDeep( sideData );
		unset( cloneData, 'radius' );
		sides.push( cloneData );
	} );
	const firstElement = _.get( sides, 0 );
	return sides.some( ( sideData ) => ! isEqual( sideData, firstElement ) );
}

/**
 * Checks to determine if values are defined.
 *
 * @param {Object} values Box values.
 * @return {boolean} Whether values are mixed.
 */
export function isValuesDefined( values ) {
	return (
		values !== undefined &&
		! isEmpty( Object.values( values ).filter( Boolean ) )
	);
}

export const borderStylesOptions = [
	{ label: __( 'None', 'kubio' ), value: 'none' },
	{ label: __( 'Solid', 'kubio' ), value: 'solid' },
	{ label: __( 'Dashed', 'kubio' ), value: 'dashed' },
	{ label: __( 'Dotted', 'kubio' ), value: 'dotted' },
	{ label: __( 'Double', 'kubio' ), value: 'double' },
	{ label: __( 'Groove', 'kubio' ), value: 'groove' },
	{ label: __( 'Ridge', 'kubio' ), value: 'ridge' },
	{ label: __( 'Inset', 'kubio' ), value: 'inset' },
	{ label: __( 'Outset', 'kubio' ), value: 'outset' },
	{ label: __( 'Hidden', 'kubio' ), value: 'hidden' },
];
