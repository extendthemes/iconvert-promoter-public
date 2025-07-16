import { dispatch, select, subscribe } from '@wordpress/data';
import { debounce, difference, find, cloneDeep, isUndefined } from 'lodash';
import { refreshBlockStyleRefs } from '@kubio/utils';

const retrieveVariationOrCreateNewOne = (blockName) => {
	let variation = find(select('core/blocks').getBlockVariations(blockName), {
		isDefault: true,
	});

	if (!variation) {
		variation = {
			name: blockName.replace(/\//gim, '-'),
			isDynamicallyGenerated: true,
			isDefault: true,
			attributes: {
				kubio: {
					styleRef: '',
				},
			},
			innerBlocks: [],
		};
	}

	return variation;
};

let lastCheckedRefs = [];
let lastSelection = null;
const handleUpdates = debounce(() => {
	const {
		getClientIdsWithDescendants,
		getBlock,
		isTyping,
		getSelectedBlockClientId,
	} = select('core/block-editor');

	// skip for typing
	if (isTyping()) {
		return;
	}

	// skip for selection change
	const currentBlockSelection = getSelectedBlockClientId();
	if (currentBlockSelection !== lastSelection) {
		lastSelection = currentBlockSelection;
		return;
	}

	const { removeBlockVariations, addBlockVariations } = dispatch(
		'core/blocks'
	);

	const currentRefs = getClientIdsWithDescendants();
	const diff = difference(currentRefs, lastCheckedRefs);

	if (diff.length) {
		lastCheckedRefs = [...currentRefs];

		const diffData = diff.map(getBlock).reduce((acc, block) => {
			const ref = block.attributes?.kubio?.styleRef;
			const { name } = block;
			const accRefs = acc[name]?.refs || [];
			if (ref) {
				acc = {
					...acc,
					[name]: {
						refs: [...accRefs, ref],
						variation: isUndefined(acc.variation)
							? retrieveVariationOrCreateNewOne(name)
							: acc.variation,
					},
				};
			}

			return acc;
		}, {});

		Object.keys(diffData).forEach((blockName) => {
			const { variation, refs } = diffData[blockName];
			const variationRef = variation.attributes?.kubio?.styleRef;

			if (variationRef && refs.includes(variationRef)) {
				const newDefaultVariation = variation.isDynamicallyGenerated
					? variation
					: {
							// set the block name as variation name so monitor can properly refresh the stylerefs
							...refreshBlockStyleRefs(
								cloneDeep({
									...variation,
									name: blockName,
								})
							),
							name: variation.name,
					  };

				removeBlockVariations(blockName, [variation?.name]);
				addBlockVariations(blockName, newDefaultVariation);
			}
		});
	}
}, 10);

const monitorBlockInsertion = () => {
	// subscribe(handleUpdates);
};

export { monitorBlockInsertion };
