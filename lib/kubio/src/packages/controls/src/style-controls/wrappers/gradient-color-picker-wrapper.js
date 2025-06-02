import { withColibriPathWithOptions } from '@kubio/core';
import { GradientColorPicker } from '../gradient-color-picker';

const GradientColorPickerWithPath = withColibriPathWithOptions({
	mergeArrays: true,
})(GradientColorPicker);

export { GradientColorPickerWithPath };
