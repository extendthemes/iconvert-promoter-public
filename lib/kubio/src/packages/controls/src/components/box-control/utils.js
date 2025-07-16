import { __ } from '@wordpress/i18n';
import { isEmpty } from 'lodash';
import isEqual from 'react-fast-compare';

export const LABELS = {
	all: __( 'All', 'kubio' ),
	top: __( 'Top', 'kubio' ),
	bottom: __( 'Bottom', 'kubio' ),
	left: __( 'Left', 'kubio' ),
	right: __( 'Right', 'kubio' ),
	mixed: __( 'Mixed', 'kubio' ),
};

export const DEFAULT_VALUES = {
	top: { value: '', unit: 'px' },
	right: { value: '', unit: 'px' },
	bottom: { value: '', unit: 'px' },
	left: { value: '', unit: 'px' },
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
 * @param {Object} units  Supported units for the box values.
 * @return {string} A value + unit for the 'all' input.
 */
export function getAllValue( values = {}, units ) {
	// if (
	// 	values &&
	// 	Object.keys(values).length === 0 &&
	// 	values.constructor === Object
	// ) {
	// 	return '0px';
	// }
	if ( isEmpty( values ) ) {
		return '';
	}

	const parsedValues = Object.values( values ).map( ( parsedValue ) => {
		const value = _.get( parsedValue, 'value' );
		const unit = _.get( parsedValue, 'unit' );
		return [ value, unit ];
	} );

	const allValues = parsedValues.map( ( value ) => value[ 0 ] );
	const allUnits = parsedValues.map( ( value ) => value[ 1 ] );
	const value = allValues.every( ( v ) => v === allValues[ 0 ] )
		? allValues[ 0 ]
		: '';

	//we use the first unit for both cases when the values are the same and mixed. The first case is obvious, we use
	//the same unit value for when the units are different so the mixed unit is one the used units. For example if
	//the units used are % and em it's weird when you go to mixed to show px because no value had px
	const unit = allUnits[ 0 ];

	const allValue = {
		value,
		unit,
	};
	return allValue;
}

/**
 * Checks to determine if values are mixed.
 *
 * @param {Object} values Box values.
 * @return {boolean} Whether values are mixed.
 */
export function isValuesMixed( values = {} ) {
	// An empty values object means that all sides are empty, or zero which is not mixed.
	if ( isEmpty( values ) ) {
		return false;
	}

	const valuesArr = Object.values( values );

	// In case we don't have all the side values it means that the object is mixed.
	// For example { bottom: "12px", top: "12px"} it is actually a mixed value since left and right are zero.
	if ( valuesArr.length < 4 ) {
		return true;
	}

	// Iterate though all object values and compare them between.
	return valuesArr.some( ( v ) => ! isEqual( v, valuesArr[ 0 ] ) );
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
