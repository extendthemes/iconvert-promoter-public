import _ from 'lodash';
import { shortcodeToString } from '@kubio/core';
import { __ } from '@wordpress/i18n';
import { StatesEnum } from '@kubio/style-manager';

const fieldsStatesOptions = [
	{ label: __('Normal', 'kubio'), value: StatesEnum.NORMAL },
	{ label: __('Hover', 'kubio'), value: StatesEnum.HOVER },
	{ label: __('Focus', 'kubio'), value: StatesEnum.FOCUS },
];
const fieldsStates = {
	values: StatesEnum,
	options: fieldsStatesOptions,
	default: StatesEnum.NORMAL,
};

const buttonStatesOptions = [
	{ label: __('Normal', 'kubio'), value: StatesEnum.NORMAL },
	{ label: __('Hover', 'kubio'), value: StatesEnum.HOVER },
];
const buttonStates = {
	values: StatesEnum,
	options: buttonStatesOptions,
	default: StatesEnum.NORMAL,
};

const shortcodeControlTypeValues = {
	SHORTCODE: 'shortcode',
	FORM: 'form',
};
const shortcodeControlTypeOptions = [
	{ value: shortcodeControlTypeValues.FORM, label: __('Form', 'kubio') },
	{
		value: shortcodeControlTypeValues.SHORTCODE,
		label: __('Shortcode', 'kubio'),
	},
];

const shortcodeControlType = {
	values: shortcodeControlTypeValues,
	options: shortcodeControlTypeOptions,
};

const formTypeCallback = ({ options, onChangeShortcode, onChangeFormType }) => {
	return (formId) => {
		const getFormShortcode = (formId) => {
			let currentFromType = null;
			options.forEach((type) => {
				const items = _.get(type, 'items', []);
				items.forEach((item) => {
					if (item?.value === formId) {
						currentFromType = type.value;
					}
				});
			});
			const shortcodeTag = {
				tag: currentFromType,
				attrs: {
					named: {
						id: formId,
					},
				},
			};

			return shortcodeToString(shortcodeTag);
		};

		if (formId !== 'custom') {
			onChangeShortcode(getFormShortcode(formId));
		}

		onChangeFormType(formId);
	};
};

const properties = {
	shortcodeControlType,
	fieldsStates,
	buttonStates,
};
export { formTypeCallback, properties };
