/**
 * External dependencies
 */

export function getIsEditableTemplatePartArea( state, templatePart ) {
	return _.get(
		state,
		[ 'isEditableTemplatePartAreaById', templatePart ],
		false
	);
}
export function getTemplateData( state ) {
	return state.data || {};
}
