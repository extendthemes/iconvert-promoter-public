import _ from 'lodash';
function customizer( objValue, srcValue ) {
	if ( _.isArray( objValue ) ) {
		return objValue.concat( srcValue );
	}
}

const mergeWithConcatArrays = ( ...objects ) => {
	return _.mergeWith( {}, ...objects, customizer );
};

export { mergeWithConcatArrays };
