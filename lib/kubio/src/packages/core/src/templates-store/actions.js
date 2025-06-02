export function lockTemplatePartArea( templatePartArea ) {
	return {
		type: 'UPDATE_AREA_IS_EDITABLE_STATUS',
		templatePartArea,
		value: false,
	};
}
export function unlockTemplatePartArea( templatePartArea ) {
	return {
		type: 'UPDATE_AREA_IS_EDITABLE_STATUS',
		templatePartArea,
		value: true,
	};
}

export function updateTemplateData( data ) {
	return {
		type: 'UPDATE_TEMPLATE_DATA',
		value: data,
	};
}
