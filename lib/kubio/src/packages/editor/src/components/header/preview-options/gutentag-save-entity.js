import apiFetch from '@wordpress/api-fetch';
import { omit } from 'lodash';
import { getKubioUrlWithRestPrefix } from '@kubio/constants';

const entityStatus = {
	PUBLISH: 'publish',
	AUTOSAVE: 'autosave',
	DRAFT: 'draft',
};

const autosaveTypes = {
	PREVIEW: 'preview',
	DRAFT: 'draft',
};

const gutentagSaveEntity = (
	postData,
	status = entityStatus.PUBLISH,
	{ fieldsToOmit = ['blocks'], type = autosaveTypes.PREVIEW } = {}
) => {
	return apiFetch({
		path: getKubioUrlWithRestPrefix('kubio/v1/save-entity'),
		method: 'POST',
		data: {
			postData: omit(
				{
					...postData,
					id: postData.id || postData.wp_id,
				},
				['selectionStart', 'selectionEnd'].concat(fieldsToOmit)
			),
			type,
			status,
		},
	});
};

export { gutentagSaveEntity, entityStatus, autosaveTypes };
