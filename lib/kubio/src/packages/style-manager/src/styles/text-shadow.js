import { createGroup, isNotEmptyButCanBeZero } from '../utils';
import { types } from '../types/index';

const defaultValue = types.props.textShadow.default;

const getTextShadowCss = function ( computedStyle, options ) {
	if ( ! options.enabled ) {
		return computedStyle;
	}
	const textShadowOptions = options;
	if (
		isNotEmptyButCanBeZero( textShadowOptions.x ) &&
		isNotEmptyButCanBeZero( textShadowOptions.y ) &&
		isNotEmptyButCanBeZero( textShadowOptions.blur ) &&
		isNotEmptyButCanBeZero( textShadowOptions.color )
	) {
		computedStyle.textShadow = `${ textShadowOptions.x }px ${ textShadowOptions.y }px ${ textShadowOptions.blur }px
        ${ textShadowOptions.color }`;
	}
	return computedStyle;
};

export default createGroup( {
	groupName: 'textShadow',
	toStyle: getTextShadowCss,
	default: defaultValue,
} );
