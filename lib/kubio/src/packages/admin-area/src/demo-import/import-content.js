import { each, omit } from 'lodash';
import { ajaxCall } from './ajax-call';
import { getSelectedDemoSlug } from './global';
import {
	displayErrorMessageAndStopImport,
	installStatus,
	installSteps,
	setStepUIStatus,
} from './ui';
import { getKubioUrlWithRestPrefix } from '@kubio/constants';
/**
 *
 * @param {FormData|null} initialData
 */
const importContent = async (initialData = null) => {
	let data = {
		action: getKubioUrlWithRestPrefix('kubio-demo-site-import-data'),
		slug: getSelectedDemoSlug(),
		first_call: true,
	};

	try {
		let response = {};

		do {
			if (initialData && data.first_call) {
				each(data, (value, key) => initialData.append(key, value));
				response = await ajaxCall(initialData);
			} else {
				response = await ajaxCall(data);
			}

			data = omit(data, 'first_call');

			// set next before import step
			if (response.before_import_action) {
				setStepUIStatus(installSteps.PREPARING, installStatus.PROGRESS);

				data = {
					...data,
					before_import_action: response.before_import_action,
				};
			} else {
				setStepUIStatus(installSteps.PREPARING, installStatus.DONE);
				setStepUIStatus(installSteps.CONTENT, installStatus.PROGRESS);
				data = omit(data, 'before_import_action');
			}

			if (response.status === 'finished') {
				setStepUIStatus(installSteps.CONTENT, installStatus.DONE);
				break;
			}
		} while (response.status === 'requires-new-ajax-call');
	} catch (e) {
		displayErrorMessageAndStopImport(e);
	}
};

export { importContent };
