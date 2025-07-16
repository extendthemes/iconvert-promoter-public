import { buttonSize } from './inspectors/content/button-size/config';
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
const horizontalPaddingOptions = {
	min: 0,
	max: 100,
	step: 1,
	capMax: false,
};

const verticalPaddingOptions = {
	min: 0,
	max: 30,
	step: 1,
	capMax: false,
};

const iconPosition = {
	values: iconPositionValues,
	options: iconPositionOptions,
};

const properties = {
	iconPosition,
	buttonSize,
	horizontalPaddingOptions,
	verticalPaddingOptions,
};

export { properties };
