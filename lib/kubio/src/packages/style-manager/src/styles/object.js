import { isNotEmptyButCanBeZero } from '../utils';

const object = {
	name: 'object',
	parser( value ) {
		const computedStyle = {};

		if ( isNotEmptyButCanBeZero( value.position ) ) {
			computedStyle.objectPosition = value.position;
		}

		if ( isNotEmptyButCanBeZero( value.fit ) ) {
			computedStyle.objectFit = value.fit;
		}
		return computedStyle;
	},
};

export default object;
