import { composeBlockWithStyle } from '@kubio/core';
import { name as linkName } from '../link/block.json';

const Factory = (options = {}, children = []) => {
	return composeBlockWithStyle(
		linkName,
		{
			attributes: {
				text: 'this is a link',
			},
			...options,
		},
		children
	);
};
const Default = Factory();

export { Default as LinkGroupDefault, Factory as LinkGroupFactory };
