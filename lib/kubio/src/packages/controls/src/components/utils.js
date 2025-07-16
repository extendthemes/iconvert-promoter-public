import { set } from 'lodash';

const onPathValueChange = ( currentValue, onChange, path = null ) => {
	const setValue = ( _path, value ) => {
		const newValue = set( { ...currentValue }, _path, value );
		onChange( newValue );
	};
	if ( path ) {
		return ( value ) => {
			setValue( path, value );
		};
	}
	return setValue;
};

export { onPathValueChange };
