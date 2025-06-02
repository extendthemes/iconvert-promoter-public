/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';
import _ from 'lodash';
import isEqual from 'react-fast-compare';

const getTemplateData = ( state, action ) => {
	const data = _.get( action, 'value', {} );
	if ( ! isEqual( data, state ) ) {
		return data;
	}

	return state;
};
export function isEditableTemplatePartAreaById( state = {}, action ) {
	let result;
	switch ( action.type ) {
		case 'UPDATE_AREA_IS_EDITABLE_STATUS':
			result = {
				...state,
				[ action.templatePartArea ]: action.value,
			};
			return result;
	}
	return state;
}
export function data( state = {}, action ) {
	switch ( action.type ) {
		case 'UPDATE_TEMPLATE_DATA':
			return getTemplateData( state, action );
	}
	return state;
}
export default combineReducers( {
	data,
	isEditableTemplatePartAreaById,
} );
