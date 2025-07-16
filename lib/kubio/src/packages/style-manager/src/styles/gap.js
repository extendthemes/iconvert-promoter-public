import { createGroup, isNotEmptyButCanBeZero } from '../utils';
import { LodashBasic } from '../core/lodash-basic';

const defaultValue = {
	value: '',
	unit: 'px',
};

const getGap = function ( style = {}, gapConfig ) {
	const sizeWithDefault = LodashBasic.merge( {}, defaultValue, gapConfig );
	if (
		isNotEmptyButCanBeZero( sizeWithDefault.value ) &&
		isNotEmptyButCanBeZero( sizeWithDefault.unit )
	) {
		const gap = `${ sizeWithDefault.value }${ sizeWithDefault.unit }`;
		style.gap = gap;
		style[ '--kubio-gap-fallback' ] = gap;
	}

	return style;
};

export default createGroup( {
	groupName: 'gap',
	toStyle: getGap,
	default: defaultValue,
} );
