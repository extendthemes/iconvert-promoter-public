import { createGroup } from '../utils';
const defaultValue = '';

const justifyContent = function ( style = {}, value ) {
	if ( value === 'right' ) {
		value = 'flex-end';
	}

	if ( value === 'left' ) {
		value = 'flex-start';
	}

	return {
		justifyContent: value,
	};
};

export default createGroup( {
	groupName: 'justifyContent',
	toStyle: justifyContent,
	default: defaultValue,
} );
