import { set } from 'lodash';

const mergeValue = (currentValue, propName, propValue) => {
	let path = ['layers', 0];
	if (propName) {
		path = path.concat(propName);
	}
	const newValue = set({ ...currentValue }, path, propValue);
	return newValue;
};

export { mergeValue };
