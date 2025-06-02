import { each } from 'lodash';
import { getAjaxURL, getNonce } from './global';
import * as $ from 'jquery';
import { addQueryArgs } from '@wordpress/url';

const ajaxCall = (data) => {
	return new Promise((resolve, reject) => {
		const formData =
			data instanceof window.FormData ? data : new window.FormData();

		formData.append('nonce', getNonce());
		each(data, (value, key) => formData.append(key, value));

		$.ajax({
			method: 'POST',
			url: addQueryArgs(getAjaxURL(), {
				nonce: getNonce(),
				action: formData.get('action'),
			}),
			data: formData,
			contentType: false,
			processData: false,
		})
			.done((response) => {
				if (response.success === false) {
					const error =
						response?.data?.error_message || response?.data?.error;

					reject(error);
				} else {
					resolve(response);
				}
			})
			.fail((response) => {
				reject(
					`${response.status} ( ${response.statusText} ) : ${response.responseText}`
				);
			});
	});
};

export { ajaxCall };
