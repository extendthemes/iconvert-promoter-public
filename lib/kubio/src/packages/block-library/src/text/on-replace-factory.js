import { Log } from '@kubio/log';
import { refreshBlockStyleRefs } from '@kubio/utils';
import { createBlock, isUnmodifiedDefaultBlock } from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';
import _ from 'lodash';
import NamesOfBlocks from '../blocks-list';

const onReplaceMap = {
	'core/paragraph': {
		block: NamesOfBlocks.TEXT,
		attributes: ({ content }) => ({
			content,
		}),
	},
	'core/heading': {
		block: NamesOfBlocks.HEADING,
		attributes: ({ content, level }) => ({
			content,
			kubio: {
				props: {
					level,
				},
			},
		}),
	},

	'core/separator': {
		block: NamesOfBlocks.DIVIDER,
		attributes: () => ({
			kubio: {
				props: { type: 'line' },
			},
			iconName: 'font-awesome/star',
		}),
	},

	'core/image': {
		block: NamesOfBlocks.IMAGE,
		attributes: ({ url, alt, caption }) => ({
			alt,
			caption: caption.trim().length ? caption : '',
			captionEnabled: !!caption.trim().length,
			url,
		}),
	},

	[NamesOfBlocks.TEXT]: {
		block: NamesOfBlocks.TEXT,
	},

	[NamesOfBlocks.HEADING]: {
		block: NamesOfBlocks.HEADING,
	},
};

const mapBlocks = (
	blocks,
	clientId,
	{ originalAttributes, originalName, newStyleRefs = true }
) => {
	return (blocks || []).map((block) => {
		if (block.clientId === clientId) {
			return block;
		}

		const name = onReplaceMap[block.name]?.block;
		const attributesMapper = onReplaceMap[block.name]?.attributes;

		// block is mapping to itself
		if (name === block.name) {
			return block;
		}

		// if you encounter an unmapped block return as is
		if (!name) {
			Log.info(
				'unhandled on replace for block',
				block.name,
				'in',
				originalName
			);
			return block;
		}

		const attributesBase = name === originalName ? originalAttributes : {};
		const newAttributes = _.merge(
			attributesBase,
			attributesMapper ? attributesMapper(block.attributes) : {}
		);

		const nextBlock = createBlock(
			name,
			newAttributes,
			mapBlocks(block.innerBlocks, clientId, {
				originalAttributes,
				originalName,
				newStyleRefs,
			})
		);

		if (newStyleRefs) {
			refreshBlockStyleRefs(nextBlock);
		}

		return nextBlock;
	});
};

const onReplaceFactory = ({
	clientId,
	attributes: originalAttributes,
	name: originalName,
}) => (blocks, indexToSelect, initialPosition) => {
	// console.log(blocks, indexToSelect, initialPosition);
	const { replaceBlocks, __unstableMarkLastChangeAsPersistent } = dispatch(
		'core/block-editor'
	);
	if (blocks.length && !isUnmodifiedDefaultBlock(blocks[blocks.length - 1])) {
		__unstableMarkLastChangeAsPersistent();
	}

	const mappedBlocks = mapBlocks(blocks, clientId, {
		originalAttributes,
		originalName,
	});

	// unlink pasted blocks
	_.forEach(mappedBlocks, (block, key) => {
		mappedBlocks[key] = refreshBlockStyleRefs(block);
	});

	replaceBlocks([clientId], mappedBlocks, indexToSelect, initialPosition);
};

export { onReplaceFactory };
