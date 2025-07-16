import { registerFormatType } from '@wordpress/rich-text';
import { formats } from './formats';
import { CustomFormatsToolbar } from './custom';

formats.forEach(({ name, ...settings }) => {
	registerFormatType(name, settings);
});

export { CustomFormatsToolbar };
