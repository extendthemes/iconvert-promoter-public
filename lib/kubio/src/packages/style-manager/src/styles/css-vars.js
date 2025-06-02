import { addValueUnitString, createGroup } from '../utils';
import { LodashBasic } from '../core/lodash-basic';

const defaultValue = {};

const getCssVars = function (style = {}, currentValue = {}) {
	LodashBasic.each(currentValue, (value, property) => {
		const path = `--${property}`;
		if (value?.unit) {
			addValueUnitString(style, path, value);
		} else {
			style[path] = value;
		}
	});

	return style;
};

export default createGroup({
	groupName: 'cssVars',
	toStyle: getCssVars,
	default: defaultValue,
});
