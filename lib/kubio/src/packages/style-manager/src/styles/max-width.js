import { createGroup, toValueUnitString } from '../utils';

const defaultValue = {
	unit: 'px',
	value: '',
	useMinFunction: true,
};
const getMaxWidth = ( style = {}, maxHeightConfig ) => {
	const value = toValueUnitString( maxHeightConfig );
	if ( ! value ) {
		return style;
	}
	// if (maxHeightConfig?.useMinFunction) {
	// 	style['max-width'] = `min(100%,${value})`;
	// } else {
	// 	style['max-width'] = value;
	// }
	style[ 'max-width' ] = value;

	return style;
};

export default createGroup( {
	groupName: 'maxWidth',
	toStyle: getMaxWidth,
	default: defaultValue,
} );
