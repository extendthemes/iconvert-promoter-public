import { __ } from '@wordpress/i18n';

const iconPositionValues = {
	AFTER: 'after',
	BEFORE: 'before',
};

const iconPositionOptions = [
	{
		label: __( 'After', 'iconvert-promoter' ),
		value: iconPositionValues.AFTER,
	},
	{
		label: __( 'Before', 'iconvert-promoter' ),
		value: iconPositionValues.BEFORE,
	},
];
const iconPosition = {
	values: iconPositionValues,
	options: iconPositionOptions,
};

export const noticesValues = {
	SUCCESS: 'success',
	INFO: 'info',
	ERROR: 'error',
};

const noticesItems = {
	success: 'successNotice',
	info: 'infoNotice',
	error: 'errorNotice',
};
const noticesOptions = [
	{
		label: __( 'Success', 'iconvert-promoter' ),
		value: noticesValues.SUCCESS,
	},
	{
		label: __( 'Existing email', 'iconvert-promoter' ),
		value: noticesValues.INFO,
	},
	{ label: __( 'Error', 'iconvert-promoter' ), value: noticesValues.ERROR },
];
const notices = {
	values: noticesValues,
	items: noticesItems,
	options: noticesOptions,
	default: noticesValues.SUCCESS,
};

const termsValues = {
	NORMAL: 'normal',
	CHECKED: 'checked',
};
const terms = {
	items: {
		normal: 'normal',
		checked: 'checked',
	},
	options: [
		{
			value: termsValues.NORMAL,
			label: __( 'Unchecked', 'iconvert-promoter' ),
		},
		{
			value: termsValues.CHECKED,
			label: __( 'Checked', 'iconvert-promoter' ),
		},
	],
	default: termsValues.NORMAL,
};

const getContextPropDefaultValue = () => ( dataHelper ) => {
	return {
		curentNotice: notices.default,
		curentTerms: terms.default,
	};
};

const onSuccessStates = {
	SHOW_NOTICE: 'showNotice',
	CLOSE_POPUP: 'closePopup',
	REDIRECT: 'redirect',
	OPEN_POPUP: 'openPopup',
	CUSTOM_CONTENT: 'customContent',
};

const linkOpenOptions = [
	{ label: __( 'Same window', 'iconvert-promoter' ), value: 'sameWindow' },
	{ label: __( 'New window', 'iconvert-promoter' ), value: 'newWindow' },
];

const onSuccessOptions = [
	{
		label: __( 'Show notice', 'iconvert-promoter' ),
		value: onSuccessStates.SHOW_NOTICE,
	},
	{
		label: __( 'Close popup', 'iconvert-promoter' ),
		value: onSuccessStates.CLOSE_POPUP,
	},
	{
		label: __( 'Redirect', 'iconvert-promoter' ),
		value: onSuccessStates.REDIRECT,
	},
	{
		label: __( 'Open another popup', 'iconvert-promoter' ),
		value: onSuccessStates.OPEN_POPUP,
	},
	{
		label: __( 'Show custom content', 'iconvert-promoter' ),
		value: onSuccessStates.CUSTOM_CONTENT,
	},
];

export {
	iconPosition,
	notices,
	terms,
	onSuccessOptions,
	onSuccessStates,
	linkOpenOptions,
	getContextPropDefaultValue,
};
