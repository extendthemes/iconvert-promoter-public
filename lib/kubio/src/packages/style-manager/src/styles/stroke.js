import { addPrimitiveValues, createGroup } from '../utils';
import { types } from '../types';

const getStrokeCss = ( style, strokeConfig ) => {
	addPrimitiveValues( style, strokeConfig, types.props.stroke.map );
	return style;
};

const defaultValue = types.props.stroke.default;

export default createGroup( {
	groupName: 'stroke',
	toStyle: getStrokeCss,
	default: defaultValue,
} );
