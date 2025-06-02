import { createGroup, isNotEmptyButCanBeZero } from '../utils';
import { LodashBasic } from '../core/lodash-basic';

const defaultValue = {
	value: '',
	unit: 'px',
};

const getSizeCss = function ( style = {}, sizeConfig ) {
	const sizeWithDefault = LodashBasic.merge( {}, defaultValue, sizeConfig );
	if (
		isNotEmptyButCanBeZero( sizeWithDefault.value ) &&
		isNotEmptyButCanBeZero( sizeWithDefault.unit )
	) {
		const size = `${ sizeWithDefault.value }${ sizeWithDefault.unit }`;
		style.width = size;
		style.minWidth = size;
		style.height = size;
		style.minHeight = size;
	}

	return style;
};

export default createGroup( {
	groupName: 'size',
	toStyle: getSizeCss,
	default: defaultValue,
} );
