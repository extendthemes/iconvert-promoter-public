import { areAllNonEmpty, createGroup } from '../utils';
import { LodashBasic } from '../core/lodash-basic';
import { types } from '../types';

const defaultValue = types.props.boxShadow.default;

const getBoxShadowCss = function ( computedStyle, value ) {
	const boxShadowOptions = value.layers[ 0 ];
	const enabled = value.enabled;
	if ( ! enabled ) {
		return {
			boxShadow: 'none',
		};
	}
	if ( areAllNonEmpty( LodashBasic.omit( value, 'inset' ) ) ) {
		computedStyle.boxShadow = `${ boxShadowOptions.x }px ${ boxShadowOptions.y }px ${ boxShadowOptions.blur }px ${ boxShadowOptions.spread }px ${ boxShadowOptions.color } ${ boxShadowOptions.inset }`;
	}
	return computedStyle;
};

export default createGroup( {
	groupName: 'boxShadow',
	toStyle: getBoxShadowCss,
	default: defaultValue,
} );
