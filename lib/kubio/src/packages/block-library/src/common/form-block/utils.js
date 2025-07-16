import _ from 'lodash';
import { __ } from '@wordpress/i18n';
import { properties } from './config';

const fieldsSelector = [
	'input:not([type=hidden]):not([type=submit]):not([type=button])',
	'textarea',
	'select',
].join(',');

const TEXTAREA_PREVIEW_VALUE =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const updateFieldsPreviewValue = (nodeRef) => {
	const nodeDom = nodeRef?.current;
	if (!nodeDom) {
		return;
	}
	const fields = _.toArray(nodeDom.querySelectorAll(fieldsSelector));
	fields.forEach((field) => {
		try {
			if (field.tagName === 'TEXTAREA') {
				field.value = TEXTAREA_PREVIEW_VALUE;
			}
			if (field.tagName === 'INPUT') {
				field.value = __('Preview Value', 'kubio');
			}
		} catch (e) {}
	});
};

const getContextPropDefaultValue = (properties) => (dataHelper) => {
	const shortcode = dataHelper.getAttribute('shortcode');
	const formId = dataHelper.getAttribute('formId');
	const { shortcodeControlType } = properties;
	const controlTypeDefaultValue =
		shortcode && !formId
			? shortcodeControlType.values.SHORTCODE
			: shortcodeControlType.values.FORM;

	return {
		currentState: {
			notice: properties.notices.default,
			button: properties.buttonStates.default,
			fields: properties.fieldsStates.default,
		},
		shortcodeControlType: controlTypeDefaultValue,
	};
};
export { updateFieldsPreviewValue, getContextPropDefaultValue };
