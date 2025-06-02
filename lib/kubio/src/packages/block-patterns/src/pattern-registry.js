import {
	GLOBAL_SESSION_ID,
	SESSION_STORE_KEY,
	STORE_KEY,
} from '@kubio/constants';
import { queueCall, refreshBlockStyleRefs } from '@kubio/utils';
import { dispatch, select, subscribe } from '@wordpress/data';
import { applyFilters, doAction } from '@wordpress/hooks';
import _, { flatten, omit, unset } from 'lodash';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

let registerPatternInStore = null;
let registerPatternCategoryInStore = null;

const PATTERNS_KEY = '__experimentalBlockPatterns';
const PATTERN_CATEGORIES_KEY = '__experimentalBlockPatternCategories';

let preregisteredPatterns = [];
let preregisteredCategories = [];
const registerStyle = (blockName, variation) => {
	const filter =
		select('core/blocks').getBlockType(blockName)?.stylesFilter ||
		_.identity;
	dispatch('core/blocks').addBlockStyles(blockName, filter(variation));
};

const clearAttributesStyleRef = (attributes) => {
	return omit(attributes, 'kubio.styleRef');
};

const clearInnerBlocksStyleRefs = (innerBlocks) => {
	return innerBlocks.map(([name, attributes, children]) => {
		return [
			name,
			clearAttributesStyleRef(attributes),
			clearInnerBlocksStyleRefs(children),
		];
	});
};

const clearVariationStyleRef = (variation) => {
	return {
		...variation,
		attributes: clearAttributesStyleRef(variation.attributes),
		innerBlocks: clearInnerBlocksStyleRefs(variation.innerBlocks),
	};
};

const registerVariation = (blockName, variation) => {
	variation = clearVariationStyleRef(variation);
	const blockType = select('core/blocks').getBlockType(blockName);
	const filter = blockType?.variationsFilter || _.identity;

	if (blockType && blockType.isPro) {
		return;
	}

	const variationValue = applyFilters(
		'kubio.register-variation',
		filter(variation),
		blockType
	);

	blockName = applyFilters('kubio.register-variation.blockName', blockName);

	const { addBlockVariations } = dispatch('core/blocks');
	addBlockVariations(blockName, variationValue);

	const addRefreshedBLockVariation = (name, blockVariation) =>
		addBlockVariations(name, refreshBlockStyleRefs(blockVariation));

	doAction(
		'kubio.variation-added',
		blockName,
		variationValue,
		addRefreshedBLockVariation
	);
};

const signalVariationsRegistrationsReady = () => {
	dispatch(SESSION_STORE_KEY).setProp(
		GLOBAL_SESSION_ID,
		'variations-loaded',
		true
	);
};

const registerPattern = (pattern) => {
	if (!Array.isArray(pattern)) {
		pattern = [pattern];
	}
	if (registerPatternInStore) {
		registerPatternInStore(pattern);
	} else {
		pattern.forEach((patternItem) => {
			preregisteredPatterns.push(patternItem);
		});
	}
};

const registerPatternCategory = (category) => {
	if (!Array.isArray(category)) {
		category = [category];
	}
	if (registerPatternCategoryInStore) {
		registerPatternCategoryInStore(category);
	} else {
		category.forEach((categoryItem) => {
			preregisteredCategories.push(categoryItem);
		});
	}
};

const initialize = () => {
	const { updateSettings } = dispatch(STORE_KEY);

	const registerPatternsQueueProcess = (queue) => {
		const settings = select(STORE_KEY).getSettings();
		const patterns = settings[PATTERNS_KEY];
		const nextPatterns = flatten(flatten(queue));

		updateSettings({
			...settings,
			[PATTERNS_KEY]: _.uniqBy([...patterns, ...nextPatterns], 'name'),
		});
	};

	const registerPatternCategoryQueueProcess = (queue = []) => {
		const settings = select(STORE_KEY).getSettings();
		const patternCategories = settings[PATTERN_CATEGORIES_KEY];
		const categories = flatten(flatten(queue));

		updateSettings({
			...settings,
			[PATTERN_CATEGORIES_KEY]: _.uniqBy(
				[...patternCategories, ...categories],
				'name'
			),
		});
	};

	registerPatternInStore = queueCall(registerPatternsQueueProcess, 500);

	registerPatternCategoryInStore = queueCall(
		registerPatternCategoryQueueProcess,
		500
	);

	registerPatternInStore(preregisteredPatterns);
	registerPatternCategoryInStore(preregisteredCategories);
	preregisteredPatterns = [];
	preregisteredCategories = [];
	window.kubioPatternsRegistered = true;
};

const debouncedInitialize = _.debounce((unsubscribe) => {
	initialize();
	unsubscribe();
}, 2000);

const initializeGutentagPatterns = () => {
	const unsubscribe = subscribe(() => {
		const { isResolving, getSettings } = select(STORE_KEY);
		if (isResolving && !isResolving() && getSettings().kubioLoaded) {
			debouncedInitialize(unsubscribe);
		}
	});
};

export {
	registerStyle,
	registerPattern,
	registerPatternCategory,
	initializeGutentagPatterns,
	registerVariation,
	signalVariationsRegistrationsReady,
};
