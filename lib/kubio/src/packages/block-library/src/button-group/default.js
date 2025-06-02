import { composeBlockWithStyle } from '@kubio/core';

import { name as buttonName } from '../button/block.json';

const ButtonGroupContentFactory = (options = {}, children = []) => {
	return children;
};
const ButtonFactory = (options = {}) => {
	return composeBlockWithStyle(buttonName, {
		attributes: {
			text: 'button text',
		},
		...options,
	});
};
const Default = ButtonGroupContentFactory({}, ButtonFactory());
export {
	Default as ButtonGroupDefault,
	ButtonGroupContentFactory as ButtonGroupFactory,
};
