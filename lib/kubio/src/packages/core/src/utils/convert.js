import _, { each, get, set } from 'lodash';
import { Utils } from '@kubio/style-manager';

const { toValueUnitString } = Utils;

const stringToUnitValue = ( value ) => {
	if ( _.isEmpty( value ) ) return {};
	const match = ( value + '' ).match( /(^-?[0-9.]*)([a-z|%]*)/ );
	const floatValue = parseFloat( match[ 1 ] );
	return {
		value: floatValue || floatValue === 0 ? floatValue : '',
		unit: match[ 2 ],
	};
};

const convertToValueUnitFormat = ( denormalizedValue ) => {
	const spacingObject = {};
	each( denormalizedValue, ( value, path ) => {
		const space = stringToUnitValue( value );
		set( spacingObject, path, space );
	} );
	return spacingObject;
};

const convertToStringFormat = ( normalizedValue, allowAll = false ) => {
	const inputObject = {};
	each( normalizedValue, ( value, path ) => {
		const boxValue = get( normalizedValue, path, '' );
		const input = toValueUnitString( boxValue, '', '', false, allowAll );
		set( inputObject, path, input );
	} );
	return inputObject;
};

export { convertToValueUnitFormat, convertToStringFormat };
