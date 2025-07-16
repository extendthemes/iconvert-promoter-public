import { addValueUnitString, createGroup } from '../utils';

const getTransitionCss = ( style = {}, { duration, delay } ) => {
	addValueUnitString( style, 'transitionDuration', duration );
	addValueUnitString( style, 'transitionDelay', delay );
	return style;
};

const defaultValue = {
	duration: {
		value: '',
		unit: 's',
	},
	delay: {
		value: '',
		unit: 's',
	},
};

export default createGroup( {
	groupName: 'transition',
	toStyle: getTransitionCss,
	default: defaultValue,
} );
