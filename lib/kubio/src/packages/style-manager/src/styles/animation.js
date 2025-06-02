import { addValueUnitString } from '../utils';
import { merge } from 'lodash';

const getAnimationCss = ( style = {}, { duration, delay } = {} ) => {
	addValueUnitString( style, 'animationDuration', duration );
	addValueUnitString( style, 'animationDelay', delay );
	return style;
};

const seconds = { unit: 's' };

const defaultValue = { duration: seconds, delay: seconds };

const animation = {
	name: 'animation',
	parser( value ) {
		const valueWithDefault = merge( {}, defaultValue, value );
		const style = getAnimationCss( {}, valueWithDefault );
		return style;
	},
	default: defaultValue,
};

export default animation;
