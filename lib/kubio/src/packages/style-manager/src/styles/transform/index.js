import {
	createGroup,
	isNotEmptyButCanBeZero,
	joinNonEmpty,
	toValueUnitString,
	toValueUnitStringFunction,
} from '../../utils';
import { types } from '../../types';
import { LodashBasic } from '../../core/lodash-basic';

const defaultValue = types.props.transform.default;

const getOriginData = ( originOptions, valuePath, customValuePath ) => {
	let result = '';
	if ( LodashBasic.get( originOptions, valuePath ) === 'custom' ) {
		const originX = LodashBasic.get(
			originOptions,
			`${ customValuePath }`
		);
		result = toValueUnitString( originX );
	} else {
		result = LodashBasic.get( originOptions, valuePath );
	}

	return result;
};

const computeOrigin = function ( originOptions ) {
	const transformOrigin = {
		x: getOriginData( originOptions, 'x.value', 'x.customValue' ),
		y: getOriginData( originOptions, 'y.value', 'y.customValue' ),
		z: getOriginData( originOptions, 'z.value', 'z.customValue' ),
	};
	return transformOrigin;
};

const addDirectionValues = (
	key,
	value,
	defaultUnit = '',
	isUnitLess = false
) => {
	let translateArray = [];
	if ( ! Array.isArray( value ) ) {
		translateArray = [ value ];
	} else {
		translateArray = value;
	}
	const result = [];
	translateArray.forEach( ( translate ) => {
		const str = toValueUnitStringFunction(
			key,
			translate,
			null,
			defaultUnit,
			isUnitLess
		);
		result.push( str );
	} );
	return result;
};

const computeXYZ = function (
	valuesArr,
	{ key, defaultUnit = '', isUnitLess = false } = {}
) {
	let resultArr = [];
	if ( !! valuesArr.length ) {
		valuesArr.forEach( ( item ) => {
			resultArr = resultArr.concat(
				addDirectionValues(
					key + item.axis?.toUpperCase(),
					item?.value,
					defaultUnit,
					isUnitLess
				)
			);
		} );
	}
	return resultArr;
};

const computeTranslate = function ( XYZValues ) {
	return computeXYZ( XYZValues, {
		key: 'translate',
		defaultUnit: 'px',
	} );
};

const computeScale = ( XYZValues = {} ) => {
	return computeXYZ( XYZValues, {
		key: 'scale',
		isUnitLess: true,
	} );
};

const computeRotate = ( rotateValues = {} ) => {
	return computeXYZ( rotateValues, { key: 'rotate', defaultUnit: 'deg' } );
};
const computeRotate2d = ( rotateValues = {} ) => {
	const rotates = [];
	const _2dRotate = toValueUnitStringFunction( 'rotate', rotateValues );
	if ( _2dRotate ) {
		rotates.push( _2dRotate );
	}

	return rotates;
};
const computeSkew = ( skewValues = {} ) => {
	const skews = computeXYZ( skewValues, { key: 'skew', defaultUnit: 'deg' } );
	return skews;
};

const computePerspective = ( perspective ) => {
	if ( perspective?.value && perspective?.unit ) {
		return `perspective(${ perspective?.value }${ perspective?.unit })`;
	}
	return '';
};

const getTransformCss = ( style = {}, value ) => {
	if ( value.none === true ) {
		return {
			transform: 'none',
		};
	}
	const { origin, translate, scale, rotate, rotate2d, skew, perspective } =
		value;
	const perspective_ = computePerspective( perspective );
	const translateArr = computeTranslate( translate );
	const scaleArr = computeScale( scale );
	const rotateArr = computeRotate( rotate );
	//const rotate2dArr = computeRotate2d(rotate2d);
	const skewArr = computeSkew( skew );
	style.transform = joinNonEmpty(
		LodashBasic.concat(
			perspective_,
			translateArr,
			scaleArr,
			//2d transform got converted to transform.rotate.z
			//rotate2dArr,
			rotateArr,
			skewArr
		)
	);

	if ( isNotEmptyButCanBeZero( style.transform ) ) {
		const { x, y, z } = computeOrigin( origin );
		style.transformOrigin = joinNonEmpty( [ x, y, z ] );
	}

	return style;
};

export default createGroup( {
	groupName: 'transform',
	toStyle: getTransformCss,
	default: defaultValue,
} );
