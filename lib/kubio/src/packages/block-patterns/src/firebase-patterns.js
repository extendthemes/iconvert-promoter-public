import { ContentMetas as Metas, initAdminStore } from '@kubio/admin-panel';
import {
	getBlocksByName,
	getNamesOfBlocks,
	getProBlocks,
} from '@kubio/block-library';
import { composeBlockWithStyle } from '@kubio/core';
import { isFreeVersion } from '@kubio/pro';
import { getBlocksUsedInTemplate, refreshBlockStyleRefs } from '@kubio/utils';
import { __ } from '@wordpress/i18n';
import _, { intersection } from 'lodash';
import {
	registerPattern,
	registerPatternCategory,
	registerVariation,
	signalVariationsRegistrationsReady,
} from './pattern-registry';

const NamesOfBlocks = getNamesOfBlocks();

const getMappedCategory = (category, type = 'content') => {
	return _.toLower(`kubio-${type}/${category}`);
};

let contentCategoryOrder = [
	'Overlappable',
	'current-template',
	'Hero Accent',
	'About',
	'Features',
	'Content',
	'CTA',
	'Blog',
	'Counters',
	'Portfolio',
	'Photo Gallery',
	'Testimonials',
	'Clients',
	'Team',
	'Contact',
	'F.A.Q.',
	'Pricing',
	'blank',
	'custom',
	'Reusable Sections',
	'Inner Headers',
	'Headers',
	'Footers',
	'Navigation',
];
const extraFreeItemsNames = ['portfolio2 new', 'portfolio3 new'];
const removedTemplatesNames = ['footer5'];

contentCategoryOrder = contentCategoryOrder.concat(
	contentCategoryOrder.map(_.toLower)
);

const TypesByBlockName = {
	'kubio/section': 'content',
	'kubio/header': 'header',
	'kubio/footer': 'footer',
};

const getPresetsByBlock = (presets) => {
	const allByType = _.groupBy(presets, 'component');

	const defaultsByType = {};

	_.each(allByType, (nodes, nodesName) => {
		if (!Array.isArray(nodes)) {
			return;
		}
		nodes.forEach((node) => {
			const nodeMetas = _.get(node, 'meta', []);
			if (nodeMetas.includes(Metas.IS_DEFAULT_PRESET)) {
				defaultsByType[nodesName] = node;
			}
		});
	});

	return {
		defaultsByType,
		allByType,
	};
};

const blocksByName = getBlocksByName();
const blockOriginalTitle = (blockName) => {
	return _.get(blocksByName, blockName + '.settings.title', '');
};

const blockTitle = (blockName) => {
	return blockOriginalTitle(blockName);
};

const blockDescription = (blockName) => {
	return blockOriginalTitle(blockName) + '(from default preset)';
};

const withGroupRegister = (item, group) => {
	return (preset) => {
		const { value } = preset;
		registerVariation(
			group,
			refreshBlockStyleRefs({
				name: group,
				isDefault: true,
				title: blockTitle(group),
				description: blockDescription(group),
				attributes: {},
				innerBlocks: [value],
			})
		);

		const [, itemAttributes, itemInnerBlocks] = value;

		registerVariation(
			item,
			refreshBlockStyleRefs({
				name: item,
				isDefault: true,
				title: blockTitle(item),
				description: blockDescription(item),
				attributes: itemAttributes,
				innerBlocks: itemInnerBlocks,
			})
		);
	};
};

const blocksWithGroup = {
	[NamesOfBlocks.BUTTON]: withGroupRegister(
		NamesOfBlocks.BUTTON,
		NamesOfBlocks.BUTTON_GROUP
	),
	[NamesOfBlocks.LINK]: withGroupRegister(
		NamesOfBlocks.LINK,
		NamesOfBlocks.LINK_GROUP
	),
};

const blocksWithDefaultVariation = [
	NamesOfBlocks.SECTION,
	NamesOfBlocks.HERO,
	NamesOfBlocks.NAVIGATION,
];

const deferedRegisterVariation = (...args) => {
	setTimeout(
		(preset, blockName) => {
			const { value } = preset;
			if (_.has(blocksWithGroup, blockName)) {
				return blocksWithGroup[blockName](preset);
			}
			registerVariation(
				blockName,
				refreshBlockStyleRefs({
					name: blockName,
					isDefault: true,
					title: blockTitle(blockName),
					description: blockTitle(blockName),
					attributes: value[1],
					innerBlocks: value[2],
				})
			);
		},
		1,
		...args
	);
};

function registerDefaultVariations(blockName) {
	const block = _.get(blocksByName, blockName, {});
	const { template } = block;
	if (!template) {
		return;
	}

	//some template inner blocks use function to generate content. For example on hero the button group uses a function
	//to get the defaultVariation and update it slightly.
	runInnerChildrenTemplateFunctions(template[0]);
	registerVariation(
		blockName,
		refreshBlockStyleRefs({
			name: blockName,
			isDefault: true,
			title: blockTitle(blockName),
			description: blockTitle(blockName),
			attributes: {},
			innerBlocks: template,
		})
	);
}

const addBlankPattern = (patterns, patternCategories) => {
	const block = _.get(blocksByName, NamesOfBlocks.SECTION, {});
	const { template } = block;
	if (!template) {
		return;
	}

	const blankSection = composeBlockWithStyle(
		NamesOfBlocks.SECTION,
		{},
		template
	);

	const blankCategoryValue = 'kubio-content/blank';
	const fromColibri = true;
	const blankCategory = {
		label: __('Blank', 'kubio'),
		name: blankCategoryValue,
	};
	const blankPattern = {
		name: `${blankCategoryValue}/blank-section`,
		title: __('Blank section', 'kubio'),
		categories: [blankCategoryValue],
		description: __('Blank section', 'kubio'),
		screenshot: 'https://content.colibriwp.com/screenshots/blank.png',
		fromColibri,
		fromFirebase: true,
		isProOnFree: false,
		isGutentagPattern: true,
		content: blankSection,
	};
	patterns.push(blankPattern);
	patternCategories.push(blankCategory);
};

const initCustomSections = (patternCategories) => {
	const customCategoryValue = 'kubio-content/custom';
	const customCategory = {
		label: __('Custom sections', 'kubio'),
		name: customCategoryValue,
	};
	patternCategories.push(customCategory);

	return patternCategories;
};

function runInnerChildrenTemplateFunctions(template) {
	const innerChildren = _.get(template, '2', []);
	innerChildren.forEach((innerChild, index) => {
		if (typeof innerChild === 'function') {
			_.set(innerChildren, index, innerChild());
		} else {
			runInnerChildrenTemplateFunctions(innerChild);
		}
	});
}

const initFirebaseData = (variationsOnly = false) => {
	initAdminStore(async ({ sections, headers, footers, presets }) => {
		const { defaultsByType } = getPresetsByBlock(presets);

		_.each(defaultsByType, deferedRegisterVariation);
		//some defaults depend on the other defaultVariations defined above.
		setTimeout(() => {
			blocksWithDefaultVariation.forEach(registerDefaultVariations);
		}, 200);

		if (variationsOnly) {
			return;
		}
		let templates = [].concat(sections, innerHeaders, headers, footers);

		templates = templates.filter(
			(template) =>
				contentCategoryOrder.includes(
					template.category.toLowerCase()
				) && !removedTemplatesNames.includes(template?.name)
		);

		const categories = {};

		const proBlocks = getProBlocks();

		const patterns = templates.map((template) => {
			const type = TypesByBlockName[template.component];
			const mappedCategory = getMappedCategory(template.category, type);
			categories[template.category] = mappedCategory;

			const isFree =
				(template.meta || []).includes(Metas.IS_FREE) ||
				extraFreeItemsNames.includes(template.name);
			const content = _.isString(template.value)
				? JSON.parse(template.value)
				: template.value;

			let isPro = !isFree;
			if (
				isFree &&
				intersection(getBlocksUsedInTemplate(content), proBlocks).length
			) {
				isPro = true;
			}

			const isRestricted = isFreeVersion() && isPro;
			const extraData = {};
			if (template?.context) {
				extraData.context = template.context;
			}
			if (template?.filters) {
				extraData.filters = template.filters;
			}
			let collections = _.get(template, 'collections', []);
			collections = _.difference(collections, ['default']);

			return {
				name: `${mappedCategory}/${template.name}/${template.id}`,
				title: template.name,
				categories: [mappedCategory],
				collections,
				index: template?.index,
				description: 'Placeholder',
				screenshot: template.screenshot,
				fromColibri: !!template?.fromColibri,
				fromFirebase: true,
				isProOnFree: isRestricted,
				isGutentagPattern: true,
				content,
				...extraData,
			};
		});

		let patternCategories = [];
		_.each(categories, (mappedCategory, category) => {
			patternCategories.push({
				label: category,
				name: mappedCategory,
			});
		});

		addBlankPattern(patterns, patternCategories);
		patternCategories = initCustomSections(patternCategories);

		registerPatternCategory(patternCategories);
		registerPattern(patterns);

		signalVariationsRegistrationsReady();
	});
};

export { initFirebaseData };
