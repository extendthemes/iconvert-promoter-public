import { createGroup, isNotEmptyButCanBeZero } from '../utils';

const defaultValue = {
	enabledRotateOption: false,
	x: {
		value: '0',
		unit: 'deg',
	},
	y: {
		value: '0',
		unit: 'deg',
	},
	z: {
		value: '0',
		unit: 'deg',
	},
	perspective: {
		value: '0',
		unit: 'px',
	},
};

function computeRotate( propertyName, data ) {
	let style = '';
	if (
		isNotEmptyButCanBeZero( data.value ) &&
		isNotEmptyButCanBeZero( data.unit )
	) {
		style = `${ propertyName }(${ data.value }${ data.unit })`;
	}

	return style;
}

const getRotateOptionsCss = function ( style = {}, rotateOptionsConfig ) {
	if ( ! rotateOptionsConfig.enabledRotateOption ) {
		return {};
	}
	const rotateX = computeRotate( 'rotateX', rotateOptionsConfig.x );
	const rotateY = computeRotate( 'rotateY', rotateOptionsConfig.y );
	const rotateZ = computeRotate( 'rotateZ', rotateOptionsConfig.z );

	if (
		isNotEmptyButCanBeZero( rotateX ) ||
		isNotEmptyButCanBeZero( rotateY ) ||
		isNotEmptyButCanBeZero( rotateZ )
	) {
		style.transform = `${ rotateX } ${ rotateY } ${ rotateZ }`;
	}

	return style;
};

export default createGroup( {
	groupName: 'rotateOptions',
	toStyle: getRotateOptionsCss,
	default: defaultValue,
} );
