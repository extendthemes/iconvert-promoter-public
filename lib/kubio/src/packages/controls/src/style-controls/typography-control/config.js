import { __ } from '@wordpress/i18n';

const fontStylesOptions = [
	{ label: __('Arial', 'kubio'), value: 'arial' },
	{ label: __('Helvetica', 'kubio'), value: 'helvetica' },
	{ label: __('Times New Roman', 'kubio'), value: 'Times New Roman' },
];

const weightOptions = [
	{ label: __('100 (thin)', 'kubio'), value: 100 },
	{ label: __('200 (extra light)', 'kubio'), value: 200 },
	{ label: __('300 (light)', 'kubio'), value: 300 },
	{ label: __('400 (normal)', 'kubio'), value: 400 },
	{ label: __('500 (medium)', 'kubio'), value: 500 },
	{ label: __('600 (semi bold)', 'kubio'), value: 600 },
	{ label: __('700 (bold)', 'kubio'), value: 700 },
	{ label: __('800 (extra bold)', 'kubio'), value: 800 },
	{ label: __('900 (heavy)', 'kubio'), value: 900 },
];

const sizeUnitsOptions = [
	{ label: __('PX', 'kubio'), value: 'px' },
	{ label: __('EM', 'kubio'), value: 'em' },
	{ label: __('REM', 'kubio'), value: 'rem' },
];

const sizeUnitsConfig = {
	px: {
		min: 5,
		max: 100,
		step: 1,
	},
	em: {
		min: 0.3,
		max: 10,
		step: 0.1,
	},
	rem: {
		min: 0.3,
		max: 10,
		step: 0.1,
	},
};

const sizeOptions = {
	units: sizeUnitsOptions,
	optionsByUnit: sizeUnitsConfig,
	capMin: true,
};

const transformOptions = [
	{ label: __('Normal', 'kubio'), value: 'none' },
	{ label: __('Uppercase', 'kubio'), value: 'uppercase' },
	{ label: __('Lowercase', 'kubio'), value: 'lowercase' },
	{ label: __('Capitalize', 'kubio'), value: 'capitalize' },
	{ label: __('Default', 'kubio'), value: '' },
];

const styleOptions = [
	{ label: __('Normal', 'kubio'), value: 'normal' },
	{ label: __('Italic', 'kubio'), value: 'italic' },
	{ label: __('Default', 'kubio'), value: '' },
];

const decorationOptions = [
	{ label: __('None', 'kubio'), value: 'none' },
	{ label: __('Underline', 'kubio'), value: 'underline' },
	{ label: __('Overline', 'kubio'), value: 'overline' },
	{ label: __('Line Through', 'kubio'), value: 'line-through' },
	{ label: __('Default', 'kubio'), value: '' },
];

export {
	sizeOptions,
	fontStylesOptions,
	weightOptions,
	sizeUnitsOptions,
	sizeUnitsConfig,
	transformOptions,
	styleOptions,
	decorationOptions,
};
