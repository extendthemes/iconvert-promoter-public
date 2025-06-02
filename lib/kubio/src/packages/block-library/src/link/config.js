import { __ } from '@wordpress/i18n';

const iconPositionValues = {
	AFTER: 'after',
	BEFORE: 'before',
};

const iconPositionOptions = [
	{ label: __('After', 'kubio'), value: iconPositionValues.AFTER },
	{ label: __('Before', 'kubio'), value: iconPositionValues.BEFORE },
];

const iconPosition = {
	values: iconPositionValues,
	options: iconPositionOptions,
};

const properties = {
	iconPosition,
};

export { properties };
