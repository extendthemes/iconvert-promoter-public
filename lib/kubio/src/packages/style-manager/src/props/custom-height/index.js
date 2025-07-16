import groups from '../../styles/value-unit-styles';
import { createGroup } from '../../utils';
import { types } from '../../types';

const { minHeight: minHeightStyle } = groups;
const HeightTypes = types.props.customHeight.enums.types;

const defaultValue = types.props.customHeight.default;

const computeHeightStyle = function ( type ) {
	const style = {};
	switch ( type ) {
		case HeightTypes.FIT_TO_CONTENT:
			style.height = 'auto';
			style[ 'min-height' ] = 'unset';
			break;
	}
	return style;
};

const computeStyle = (
	style = {},
	value
	// { node, htmlSupport = true, styledComponent } = {}
) => {
	switch ( value.type ) {
		case HeightTypes.MIN_HEIGHT:
			style = minHeightStyle.parser( value[ HeightTypes.MIN_HEIGHT ] );
			break;
		case HeightTypes.FULL_SCREEN:
			style = minHeightStyle.parser( {
				value: 100,
				unit: 'vh',
			} );
			break;
		case HeightTypes.FIT_TO_CONTENT:
			style = computeHeightStyle( value.type );
			break;
	}

	return style;
};

export default createGroup( {
	groupName: 'customHeight',
	toStyle: computeStyle,
	default: defaultValue,
} );

export {
	computeStyle,
	computeHeightStyle,
	HeightTypes,
	HeightTypes as HeightTypesEnum,
	defaultValue,
};
