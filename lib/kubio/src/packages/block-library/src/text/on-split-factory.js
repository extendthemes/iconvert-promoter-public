import { createBlock } from '@wordpress/blocks';

const onSplitFactory = ({ attributes, name, clientId }) => (
	value,
	isOriginal
) => {
	let newAttributes;

	if (isOriginal || value) {
		newAttributes = {
			...attributes,
			content: value,
		};
	}

	const block = createBlock(name, newAttributes);

	if (isOriginal) {
		block.clientId = clientId;
	}

	return block;
};

export { onSplitFactory };
