import { LodashBasic } from '../core/lodash-basic';
import _ from 'lodash';

function isNotEmptyButCanBeZero( value ) {
	return (
		value !== '' && value !== null && value !== undefined && value !== false
	);
}

const areAllNonEmpty = ( values ) => {
	const found = LodashBasic.find(
		values,
		( item ) => ! isNotEmptyButCanBeZero( item )
	);
	return ! found;
};

const joinNonEmpty = ( values, join = ' ' ) => {
	const nonEmpty = LodashBasic.filter( values, isNotEmptyButCanBeZero );
	return nonEmpty.join( join );
};

const toPrimitiveValue = function ( value, isUnitLess = false ) {
	if ( LodashBasic.isObject( value ) ) {
		if (
			LodashBasic.has( value, [ 'value' ] ) ||
			LodashBasic.has( value, [ 'unit' ] )
		) {
			return toValueUnitString( value, '', '', isUnitLess );
		}
	} else {
		return value;
	}
};

const addPrimitiveValues = (
	style,
	value,
	propertiesMap,
	unitLessProperties = []
) => {
	LodashBasic.each( propertiesMap, ( cssName, jsonName ) => {
		if ( isNotEmptyButCanBeZero( value[ jsonName ] ) ) {
			const isUnitLess = unitLessProperties.includes( jsonName );
			const property = toPrimitiveValue( value[ jsonName ], isUnitLess );
			if ( isNotEmptyButCanBeZero( property ) ) {
				style[ cssName ] = property;
			}
		}
	} );
	return style;
};

const addValueUnitString = ( style, key, obj ) => {
	const value = toValueUnitString( obj );
	if ( value ) {
		style[ key ] = value;
	}
	return style;
};

const toValueUnitStringFunction = (
	functionName,
	valueUnit,
	defaultValue = '',
	defaultUnit = '',
	isUnitLess = false
) => {
	const value = toValueUnitString( valueUnit, null, defaultUnit, isUnitLess );
	if ( value ) {
		return `${ functionName }(${ value })`;
	}
	return defaultValue;
};

const toValueUnitString = (
	valueObj,
	defaultValue = '',
	defaultUnit = '',
	isUnitLess = false,
	allowAll = false
) => {
	if ( ! isNotEmptyButCanBeZero( valueObj ) ) {
		return defaultValue;
	}
	if ( LodashBasic.isString( valueObj ) ) {
		if ( valueObj && defaultUnit ) {
			return `${ valueObj }${ defaultUnit }`;
		}

		return valueObj;
	}
	const value = valueObj.value;
	const important = valueObj.important;
	const unit = valueObj.unit || ( ! isUnitLess ? defaultUnit : '' );
	const importantStr = important ? ' !important' : '';
	if (
		isNotEmptyButCanBeZero( value ) &&
		( defaultUnit || isNotEmptyButCanBeZero( unit ) || isUnitLess )
	) {
		return `${ value }${ unit }${ importantStr }`;
	}

	if ( allowAll ) {
		let allowedValue = '';

		if ( isNotEmptyButCanBeZero( value ) ) {
			allowedValue = value;
		}

		if ( isNotEmptyButCanBeZero( unit ) ) {
			allowedValue = allowedValue + unit;
		}

		allowedValue = allowedValue + importantStr;

		return allowedValue;
	}

	return defaultValue;
};

const toValueUnitObject = (
	valueString,
	defaultValue = '',
	defaultUnit = ''
) => {
	valueString = valueString.trim();
	const value = parseFloat( valueString ) || defaultValue;
	const unit =
		valueString.replace( parseFloat( valueString ), '' ) || defaultUnit;

	return { value, unit };
};

const createUnitValueGroup = ( {
	groupName,
	cssName = null,
	default: defaultValue,
} ) => {
	const mergedDefaultValue = LodashBasic.merge(
		{
			value: '',
			unit: 'px',
			important: false,
		},
		defaultValue
	);
	if ( ! cssName ) {
		cssName = LodashBasic.kebabCase( groupName );
	}
	return {
		name: groupName,
		parser: ( value ) => {
			const merged = LodashBasic.merge( {}, mergedDefaultValue, value );
			const style = addValueUnitString( {}, cssName, merged );
			return style;
		},
		default: defaultValue,
	};
};

const createGroup = ( {
	groupName,
	toStyle,
	props,
	default: defaultValue = {},
} ) => {
	if ( props ) {
		defaultValue = LodashBasic.mapValues( props, 'default' );
	}
	return {
		name: groupName,
		parser: ( value, context = {} ) => {
			if ( ! _.isObject( value ) ) {
				return toStyle( {}, value, context );
			}
			const merged = LodashBasic.merge( {}, defaultValue, value );
			const style = toStyle( {}, merged, context );
			return style;
		},
		default: defaultValue,
	};
};

const computeTBLRCss = ( prefix, style = {}, obj ) => {
	LodashBasic.each( obj, ( value, name ) => {
		addValueUnitString( style, prefix + '-' + name, value );
	} );
	return style;
};

const createTBLRDefault = ( sideDefault ) => {
	const defaultValue = {};
	LodashBasic.each( [ 'top', 'bottom', 'left', 'right' ], ( value ) => {
		defaultValue[ value ] = sideDefault;
	} );
	return defaultValue;
};

const mapHideClassesByMedia = ( hiddenByMedia, negateValue = false ) => {
	const hiddenClasses = Object.entries( hiddenByMedia )
		.map( ( [ media, isHidden ] ) => {
			if ( negateValue ) isHidden = ! isHidden;
			return isHidden ? `kubio-hide-on-${ media }` : '';
		} )
		.filter( Boolean );
	return hiddenClasses;
};

export * from './style';

export {
	areAllNonEmpty,
	joinNonEmpty,
	isNotEmptyButCanBeZero,
	addValueUnitString,
	toValueUnitString,
	toValueUnitStringFunction,
	createUnitValueGroup,
	createGroup,
	computeTBLRCss,
	createTBLRDefault,
	toPrimitiveValue,
	addPrimitiveValues,
	toValueUnitObject,
	mapHideClassesByMedia,
};
