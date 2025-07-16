import { createGroup, isNotEmptyButCanBeZero } from '../utils';

const getOpacityCss = ( style = {}, opacityConfig ) => {
	if ( isNotEmptyButCanBeZero( opacityConfig.value ) ) {
		style.opacity = `${ opacityConfig.value }`;
	}
	return style;
};

const defaultValue = {
	value: '',
	unit: '%',
};

export default createGroup( {
	groupName: 'opacity',
	toStyle: getOpacityCss,
	default: defaultValue,
} );
