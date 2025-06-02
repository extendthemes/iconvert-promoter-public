// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useCallback } from '@wordpress/element';
import cleanDeep from 'clean-deep';
import deepdash from 'deepdash-es';
import deepmerge from 'deepmerge';
import lodash, {
	cloneDeepWith,
	debounce,
	flatten,
	isArray,
	isNull,
	isObject,
	isUndefined,
	mergeWith,
	omit,
	padEnd,
	set,
	uniq,
} from 'lodash';
import isEqual from 'react-fast-compare';
import semver from 'semver';
import getSlug from 'speakingurl';
import tinycolor from 'tinycolor2';
import { useTransformLinkControlValue } from './menu-item-content';
import {
	refreshBlockStyleRefs,
	normalizeVariation,
} from './refresh-style-refs';

import {
	dispatch as rootDispatch,
	select as rootSelect,
	select,
} from '@wordpress/data';

const combineMerge = (target, source, options) => {
	const destination = target.slice();

	source.forEach((item, index) => {
		if (typeof destination[index] === 'undefined') {
			destination[index] = options.cloneUnlessOtherwiseSpecified(
				item,
				options
			);
		} else if (options.isMergeableObject(item)) {
			destination[index] = deepmerge(target[index], item, options);
		} else if (target.indexOf(item) === -1) {
			destination.push(item);
		}
	});
	return destination;
};

const deepmergeAll = (objArray, options) => {
	return deepmerge.all(
		objArray.filter(
			(item) => !(isUndefined(item) || isNull(item))
		),
		{
			arrayMerge: combineMerge,
			...options,
		}
	);
};

const kubioCloneDeep = (obj) => {
	return cloneDeepWith(obj, (o) => {
		if (
			!Array.isArray(o) &&
			_.isObject(o) &&
			o?.constructor?.name !== 'Object'
		) {
			return o;
		}
	});
};

let _ = lodash || window.lodash;

const fromHtmlEntities = function (string) {
	return (string + '').replace(/&#\d+;/gm, function (s) {
		return String.fromCharCode(s.match(/\d+/gm)[0]);
	});
};

const checkIfPathValueIsArrayElement = function (value, path) {
	// [NUMBER]
	const match1 = /(.*)(\[(\d+)]$)/g.exec(path);
	//.NUMBER
	const match2 = /(.*)(\.(\d+)$)/g.exec(path);
	let pathValueIsArrayElement = false;

	let elementParentPath = null;
	let index = null;
	let elementParent = null;
	if (match1) {
		elementParentPath = match1[1];
		index = match1[3];
		elementParent = _.get(value, elementParentPath);
		if (Array.isArray(elementParent)) {
			pathValueIsArrayElement = true;
		}
	}
	if (match2) {
		elementParentPath = match2[1];
		index = match2[3];
		elementParent = _.get(value, elementParentPath);
		if (Array.isArray(elementParent)) {
			pathValueIsArrayElement = true;
		}
	}
	return {
		pathValueIsArrayElement,
		index,
		elementParent,
	};
};

const unsetArraySafe = (value, path) => {
	const { pathValueIsArrayElement, index, elementParent } =
		checkIfPathValueIsArrayElement(value, path);

	if (pathValueIsArrayElement) {
		elementParent.splice(index, 1);
	} else {
		_.unset(value, path);
	}
};

const mergeNoArrays = (...args) => {
	return mergeWith.apply(null, [
		...args,
		function (dest, src) {
			if (isArray(src)) {
				return src;
			}

			if (isArray(dest)) {
				return dest;
			}
		},
	]);
};

const pascalCase = _.flow(_.camelCase, _.upperFirst);

_.pascalCase = pascalCase;

_.unsetArraySafe = unsetArraySafe;

_.cleanDeep = (obj, options = {}) => {
	return cleanDeep(
		obj,
		_.merge(
			{
				emptyArrays: true,
				emptyObjects: false,
				emptyStrings: false,
				nullValues: false,
				undefinedValues: false,
			},
			options
		)
	);
};

const differenceObj = (object, base) => {
	function changes(_object, _base) {
		return _.transform(_object, function (result, value, key) {
			if (!isEqual(value, _base[key])) {
				result[key] =
					_.isObject(value) && _.isObject(_base[key])
						? changes(value, _base[key])
						: value;
			}
		});
	}

	return changes(object, base);
};

const isValueUnitObject = (toTest) => {
	const keys = Object.keys(toTest);

	return (
		keys.length === 2 &&
		_.difference(keys, ['unit', 'value']).length === 0
	);
};

const _diffUnitValueObjTree = (object, base) => {
	const diff = {};

	Object.keys(object).forEach((key) => {
		const objValue = object[key];
		const baseValue = base?.[key];

		if (!baseValue) {
			diff[key] = objValue;
		} else if (isObject(objValue)) {
			if (!isEqual(objValue, baseValue)) {
				if (isValueUnitObject(objValue)) {
					diff[key] = objValue;
				} else {
					diff[key] = _diffUnitValueObjTree(objValue, baseValue);
				}
			}
		} else if (!isEqual(objValue, baseValue)) {
			diff[key] = objValue;
		}
	});

	return diff;
};

const diffUnitValueObjTree = (object, base) => {
	return _diffUnitValueObjTree(object, base);
};

_.differenceObj = differenceObj;

_.freeze = (value) => {
	// eslint-disable-next-line no-undef
	if (!top.skip) {
		Object.freeze(value);
	}
	return value;
};

_ = deepdash(_);

//https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding
const toFixedNoRounding = (num, fixed = 2) => {
	const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
	return parseFloat(num.toString().match(re)[0]);
};
const toFixed = (num, fixed = 5) => {
	const number = Number.parseFloat(num);
	return Number.parseFloat(number.toFixed(fixed));
};

const toFixedHighPrecision = (num, fixed = 6) => {
	return toFixed(num, fixed);
};

const deviceToMedia = (device) => {
	return device.toLowerCase();
};

const getBackendData = (path, fallback = null) => {
	return _.get(window.kubioUtilsData, path, fallback);
};

const getShowInternalFeatures = (feature = null) => {
	let internalBuild = false;
	const showInternalFeatures =
		internalBuild || getBackendData('showInternalFeatures');

	let featuredEnabled = false;
	if (feature) {
		switch (feature) {
			case 'cloud':
				featuredEnabled =
					KUBIO_ENV.CLOUD_INTERNALS === true ||
					KUBIO_ENV.AI_INTERNALS === true;
				break;
			case 'ai':
				featuredEnabled =
					KUBIO_ENV.CLOUD_INTERNALS === true ||
					KUBIO_ENV.AI_INTERNALS === true;
				break;
		}
	}

	return featuredEnabled || showInternalFeatures;
};

const defaultAssetURL = (rel) => {
	return getBackendData('defaultAssetsURL') + '/' + _.trim(rel, '/');
};

const staticAssetURL = (rel) => {
	return getBackendData('staticAssetsURL') + '/' + _.trim(rel, '/');
};

const useDelayedFunction = (func, delay) => {
	return useCallback(_.debounce(func, delay), [func]);
};

const ucwords = function (str) {
	if (!str) {
		return '';
	}

	str = str.toLowerCase();
	return str.replace(
		/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
		function ($1) {
			return $1.toUpperCase();
		}
	);
};
const setSidesData = (relPath, value) => {
	const sides = ['top', 'bottom', 'left', 'right'];
	const changes = {};
	sides.forEach((side) => {
		set(changes, [side, relPath], value);
	});

	return changes;
};

const unsetSidesData = (data, relPath) => {
	const sides = ['top', 'bottom', 'left', 'right'];
	const changes = {};
	sides.forEach((side) => {
		_.unset(data, `${side}.${relPath}`);
	});

	return changes;
};

const slugify = (text) => {
	const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
	const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
	const p = new RegExp(a.split('').join('|'), 'g');

	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special chars
		.replace(/&/g, '-and-') // Replace & with 'and'
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
};

const getUniqueSlug = (slug, ownerDocument = document, options = {}) => {
	const defaultOptions = {
		//by default use the data-slug attribute;
		getSlugNode: (slug, ownerDocument) => {
			return ownerDocument.querySelector(`[data-slug='${slug}']`);
		},
	};
	slug = slug.trim();
	const mergedOptions = _.merge({}, defaultOptions, options);
	const { getSlugNode } = mergedOptions;
	// slugify input
	slug = slugify(slug);

	let found = false;
	let index = 1;
	let newSlug = slug;
	while (!found) {
		if (index === 1) {
			if (getSlugNode(slug, ownerDocument) === null) {
				found = true;
			} else {
				index++;
			}
		} else if (
			getSlugNode(slug + '-' + index, ownerDocument) === null
		) {
			newSlug += '-' + index;
			found = true;
		} else {
			index++;
		}
	}
	return newSlug;
};

const generateSlug = (text, ownerDocument = document, options = {}) => {
	let newSlug = getSlug(text);
	newSlug = getUniqueSlug(newSlug, ownerDocument, options);
	return newSlug;
};

const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const transformBlockToTemplate = (
	{ name, innerBlocks = [], attributes = {} } = {},
	{ skipAttributes = false, skipRef = false } = {}
) => {
	if (!name) {
		return false;
	}
	let nextAttributes = {};
	if (!skipAttributes) {
		nextAttributes = kubioCloneDeep(attributes);
		if (skipRef) {
			nextAttributes = {
				...(nextAttributes || {}),
				kubio: omit(nextAttributes?.kubio || {}, [
					'styleRef',
					'hash',
					'id',
				]),
			};
		}
	}

	return [
		name,
		nextAttributes,
		innerBlocks.map((innerBlock) =>
			transformBlockToTemplate(innerBlock, { skipAttributes, skipRef })
		),
	];
};

const transformTemplateToBlock = ([name, attributes, innerBlocks]) => {
	return createBlock(
		name,
		attributes,
		createBlocksFromInnerBlocksTemplate(innerBlocks)
	);
};

const getBlocksUsedInTemplate = ([name, , innerBlocks], isRoot = true) => {
	let response = [name];

	innerBlocks.forEach(([innerBlockName, , innerBlocksChildren]) => {
		response.push(innerBlockName);
		response = response.concat(
			flatten(
				innerBlocksChildren.map((child) =>
					getBlocksUsedInTemplate(child, false)
				)
			)
		);
	});

	if (isRoot) {
		response = uniq(response);
	}

	return response;
};

const delayPromise = (duration) => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), duration);
	});
};

const span = document.createElement('span');
const stripTags = (text) => {
	span.innerHTML = text;

	return span.textContent;
};

const convertHtmlEntitiesToString = (text) => {
	span.innerHTML = text;
	return span.innerText;
};

const toFixedDecimals = (number, decimals = 2) => {
	number = parseFloat(number);

	return parseFloat(number.toFixed(decimals));
};

const monitorValueChange = (key, value) => {
	// eslint-disable-next-line no-undef
	top.kubioMonitoredValues = top.kubioMonitoredValues || {};

	// eslint-disable-next-line no-undef
	const { kubioMonitoredValues } = top;

	if (!kubioMonitoredValues[key]) {
		kubioMonitoredValues[key] = value;
	} else {
		const oldValue = kubioMonitoredValues[key];
		if (isEqual(value, oldValue)) {
			// eslint-disable-next-line no-console
			console.warn(
				'@Kubio - Value change monitor diffs:',
				differenceObj({ value }, { value: oldValue })
			);
		}
	}

	return value;
};

const measureFnPerformanceValue = {};
const measureFnPerformance =
	(func, funcName) =>
		(...args) => {
			measureFnPerformanceValue[funcName] =
				measureFnPerformanceValue[funcName] || [];
			const start = performance.now();
			const result = func(...args);
			const diff = Math.round(1000 * (performance.now() - start)) / 1000;
			measureFnPerformanceValue[funcName].push(diff);

			const total =
				Math.round(
					1000 *
					measureFnPerformanceValue[funcName].reduce(
						(a, b) => a + b,
						0
					)
				) / 1000;

			const avg =
				Math.round(
					(1000 * total) / measureFnPerformanceValue[funcName].length
				) / 1000;

			console.log(
				padEnd(funcName, 20),
				padEnd('CURRENT', 9),
				padEnd(diff + 'ms', 6),
				padEnd('TOTAL', 6),
				padEnd(total + 'ms', 6),
				padEnd('AVG', 6),
				avg + 'ms'
			);
			return result;
		};

/**
 * Queue function calls executions
 *
 * @param          queueResolver  - queue resolver callback
 * @param {number} resolveTimeout - queue resolver execution debounce
 * @param {string} name           - optional queue string name
 * @return {(function(...[*]=): void)|*}
 */
const queueCall = (queueResolver, resolveTimeout, name = '') => {
	let queue = [];

	const resolver = debounce(() => {
		if (name) {
			console.group(`queueCall: resolve - ${name}`);
			console.log('queue:', queue);
			console.trace();
			console.groupEnd();
		}
		const localQueue = [...queue];
		queue = [];
		return queueResolver(localQueue);
	}, resolveTimeout);

	return (...args) => {
		queue.push(args);
		if (name) {
			console.group(`queueCall: update - ${name}`);
			console.log('queue:', queue);
			console.trace();
			console.groupEnd();
		}
		return resolver();
	};
};
const findBlockByName = (blockList, blockName) => {
	if (!Array.isArray(blockList)) {
		blockList = [blockList];
	}
	let foundBlock = blockList.find((item) => item?.name === blockName);

	if (foundBlock) {
		return foundBlock;
	}
	blockList.forEach((block) => {
		if (foundBlock) {
			return;
		}
		if (block?.name === blockName) {
			foundBlock = block;
		}

		const innerBlocks = _.get(block, 'innerBlocks');
		if (Array.isArray(innerBlocks)) {
			const foundInnerBlock = findBlockByName(innerBlocks, blockName);
			if (foundInnerBlock) {
				foundBlock = foundInnerBlock;
			}
		}
	});
	return foundBlock;
};
const findAllBlocksByName = (blockList, blockName, result = []) => {
	if (!Array.isArray(blockList)) {
		blockList = [blockList];
	}
	const foundBlocks = blockList.filter(
		(item) => item?.name === blockName
	);

	if (!_.isEmpty(foundBlocks)) {
		foundBlocks.forEach((block) => {
			result.push(block);
		});
	}
	blockList.forEach((block) => {
		const innerBlocks = _.get(block, 'innerBlocks');
		if (Array.isArray(innerBlocks)) {
			findAllBlocksByName(innerBlocks, blockName, result);
		}
	});
	return result;
};

function findParentWithChildBlockName(block, parentBlock, childBlock) {
	if (block.name === parentBlock) {
		if (block.innerBlocks.some(innerBlock => innerBlock.name === childBlock)) {
			return block;
		}
	}

	if (block.innerBlocks && block.innerBlocks.length > 0) {
		for (const innerBlock of block.innerBlocks) {
			const result = findParentWithChildBlockName(innerBlock, parentBlock, childBlock);
			if (result) return result;
		}
	}
	return null;
}

const walkBlocks = (blocks, callback) => {
	if (!Array.isArray(blocks)) {
		blocks = [blocks];
	}

	blocks.forEach((block) => {
		if (!block) {
			return;
		}

		callback(block);

		const innerBlocks = _.get(block, 'innerBlocks', []);
		walkBlocks(innerBlocks, callback);
	});
};

function convertColibriColorPalette(colibriColorPalette) {
	const paletteArray = Object.values(colibriColorPalette);
	const kubioColorPalette = paletteArray.map((color, index) => {
		const rgbColor = tinycolor(color).toRgb();
		const rgbArray = [rgbColor?.r, rgbColor?.g, rgbColor?.b];
		return {
			slug: `kubio-color-${index + 1}`,
			color: rgbArray,
		};
	});

	return kubioColorPalette;
}
function getObjectDifference(object, base) {
	function changes(object, base) {
		return _.transform(object, function (result, value, key) {
			if (!_.isEqual(value, base[key])) {
				if (_.isObject(value) && _.isObject(base[key])) {
					/**
					 *  We treat object with unit and value as a primitive. If there are not equal we set the whole object as different
					 *	Because you may have the same unit but different value and you can get cases with no unit.
					 *  For example you can have unit em and two values 1.2 and 2.3 in the difference only the value will be copied
					 *  and the style manager will presume the unit is px
					 */
					if (
						value.hasOwnProperty('value') &&
						value.hasOwnProperty('unit')
					) {
						result[key] = value;
						return;
					}

					result[key] = changes(value, base[key]);
					return;
				}

				//When a primitive, not an object
				result[key] = value;
			}
		});
	}
	return changes(object, base);
}

function removeThemeColorsFromObject(
	data,
	{ parseVariableColor, colorPalette, colorPaletteVariants }
) {
	_.eachDeep(
		data,
		(value, key, parentValue) => {
			if (
				typeof value === 'string' &&
				value.includes('kubio-color-')
			) {
				const parsedValue = parseVariableColor(value, {
					colorPalette,
					colorPaletteVariants,
				});
				parentValue[key] = parsedValue;
			}
		},
		{ leavesOnly: true }
	);
	return data;
}

function removeThemeColorsFromBlocks(options = {}) {
	const defaultOptions = {
		shouldUpdateAttributes: true,
	};
	const mergedOptions = _.merge({}, defaultOptions, options);
	let {
		blocks,
		colorPalette,
		parseVariableColor,
		updateBlockAttributes,
		getBlockAttributes,
		generateColorVariants,
		shouldUpdateAttributes,
	} = mergedOptions;
	const colorPaletteVariants = generateColorVariants(colorPalette);
	blocks = kubioCloneDeep(blocks);
	blocks.forEach((block) => {
		let attributes = shouldUpdateAttributes
			? kubioCloneDeep(getBlockAttributes(block.clientId))
			: block?.attributes || {};

		attributes = removeThemeColorsFromObject(attributes, {
			parseVariableColor,
			colorPalette,
			colorPaletteVariants,
		});

		if (shouldUpdateAttributes) {
			updateBlockAttributes(block.clientId, attributes);
		}

		const innerBlocks = block?.innerBlocks || [];

		block.innerBlocks = removeThemeColorsFromBlocks({
			...options,
			blocks: innerBlocks,
		});
	});
	return blocks;
}

const __experimentalDeepMemize = (callback) => {
	const calls = new Map();

	return (...args) => {
		for (const [key, value] of calls.entries()) {
			if (isEqual(key, args)) {
				return value;
			}
		}

		const result = callback(...args);
		calls.set(args, result);
		return result;
	};
};

const onOpenTemplateGalleryWithParams = (params = {}) => {
	const mergedParams = _.merge(
		{
			page: undefined,
			disabledPages: [],
			sections: {
				category: undefined,
				tag: undefined,
				categoryType: undefined,
				onActionFunc: undefined,
			},
		},
		params
	);

	document.body.dispatchEvent(
		new CustomEvent('openTemplateGallery', {
			detail: mergedParams,
		})
	);
};
const getNextSectionNameAndIdForPattern = (pattern) => {
	const { getBlock, getClientIdsWithDescendants } =
		rootSelect('core/block-editor');

	const hooks = {
		getBlock,
		getClientIdsWithDescendants,
	};

	const { getSettings = _.noop } = rootSelect('kubio/edit-site') || {};
	const settings = getSettings() || {};

	const patternCategories =
		settings.__experimentalBlockPatternCategories || [];

	const categoryLabel =
		_.find(patternCategories, {
			name: pattern.categories[0],
		})?.label ?? 'Custom Section';

	return getNextSectionNameAndId(categoryLabel, hooks);
};
const getNextSectionNameAndId = (nameRoot, hooks = {}) => {
	const { getClientIdsWithDescendants = _.noop, getBlock = _.noop } = hooks;
	const currentIds = getClientIdsWithDescendants()
		.map((id) => getBlock(id)?.attributes?.anchor)
		.filter(Boolean);

	const currentIdRoot = slugify(nameRoot);
	let currentSuffixIndex = 0;
	let currentSuffix = '';

	while (
		currentIds.indexOf(`${currentIdRoot}${currentSuffix}`) !== -1
	) {
		currentSuffixIndex++;
		currentSuffix = `-${currentSuffixIndex}`;
	}

	return {
		name: currentSuffixIndex
			? `${nameRoot} ${currentSuffixIndex}`
			: nameRoot,
		anchor: `${currentIdRoot}${currentSuffix}`,
	};
};

const removeEmptyObjects = (obj) => {
	return _(obj)
		.pickBy(_.isObject) // pick objects only
		.mapValues(removeEmptyObjects) // call only for object values
		.omitBy(_.isEmpty) // remove all empty objects
		.assign(
			_.omitBy(
				obj,
				(item) => _.isObject(item) && !Array.isArray(item)
			)
		) // assign back primitive values
		.value();
};
/**
 * Experimental function to remove empty objects
 *
 * @param obj
 */
const removeEmptyObjectV2 = (obj) => {
	if (!_.isObject(obj) && !Array.isArray(obj)) {
		return obj;
	}
	const shouldNotBeRemovedFilter = (value) => {
		const isNotAnObject = !_.isObject(value);
		const isNonEmptyObject = _.isObject(value) && !_.isEmpty(value);
		return (
			isNotAnObject ||
			isNonEmptyObject ||
			(Array.isArray(value) && !_.isEmpty(value))
		);
	};

	if (Array.isArray(obj)) {
		return obj
			.map((item) => removeEmptyObjectV2(item))
			.filter(shouldNotBeRemovedFilter);
	}

	//transform properties into key-values pairs and filter out empty objects
	const entries = Object.entries(obj).filter(([, value]) => {
		return shouldNotBeRemovedFilter(value);
	});
	//map through all the remaining properties and check if the value is an object.
	//if value is object, use recursion to remove empty properties
	const clean = entries
		.map(([key, v]) => {
			const value =
				_.isObject(v) || Array.isArray(v)
					? removeEmptyObjectV2(v)
					: v;
			return [key, value];
		})
		.filter(([key, value]) => {
			return shouldNotBeRemovedFilter(value);
		});
	//transform the key-value pairs back to an object.
	return Object.fromEntries(clean);
};
const cleanFontFamilyFromBlocks = (block) => {
	return internalCleanFontFamilyFromBlocks(block);
	// return internalCleanFontFamilyFromBlocks(_.cloneDeep(block));
};
//This removes the font family from blocks. It's intended that it does not clone de block. Because it may be very intensive
//if we start doing multiple blocks and it does not harm if the original is modified to be without family.
const internalCleanFontFamilyFromBlocks = (block) => {
	if (Array.isArray(block)) {
		return block.map((item) => {
			return cleanFontFamilyFromBlocks(item);
		});
	}

	const kubioAttribute = _.get(block, 'attributes.kubio');
	if (!kubioAttribute) {
		return block;
	}
	// @TODO: cloneDeep
	block = kubioCloneDeep(block);
	const style = _.get(kubioAttribute, 'style', {});
	_.eachDeep(
		style,
		(value, key, parentValue) => {
			if (key === 'family') {
				_.unset(parentValue, key);
			}
		},
		{ leavesOnly: true }
	);
	block.innerBlocks = block.innerBlocks.map((item) =>
		cleanFontFamilyFromBlocks(item)
	);
	return block;
};
const isAdvancedMode = () => {
	const { getKubioEditorMode } = rootSelect('kubio/edit-site') || {};
	const isAdvanced = getKubioEditorMode?.() === 'full';
	return isAdvanced;
};

const toggleAdvancedMode = () => {
	const { setKubioEditorMode } = rootDispatch('kubio/edit-site');

	setKubioEditorMode?.(isAdvancedMode() ? 'simple' : 'full');
};
const getColorPalettesAreEqual = (palette1, palette2) => {
	if (!isArray(palette1) || !isArray(palette2)) {
		return false;
	}

	if (palette1.length !== palette2.length) {
		return false;
	}

	return palette1.every((item, index) => {
		return _.isEqual(item.color, palette2[index].color);
	});
};
const wpVersionCompare = (compareAgainst, comparator = '=') => {
	const result = semver.compare(
		semver.coerce(window.kubioUtilsData.wpVersion),
		semver.coerce(compareAgainst)
	);

	// check for equality with operators: =, <=, >=
	if (comparator.includes('=') && result === 0) {
		return true;
	}

	// check for <
	if (comparator.includes('<') && result === -1) {
		return true;
	}

	if (comparator.includes('>') && result === 1) {
		return true;
	}

	return false;
};

export const showSupplementaryUpgradeToPRO = () => {
	return window.kubioUtilsData.supplementary_upgrade_to_pro;
};

const AI_IN_PRO = KUBIO_ENV.IS_FREE && window?.kubioUtilsData?.aiStage2;
const SHOW_ADVANCED_IN_PRO = window?.kubioUtilsData?.advancedMode === false;

export * from './compare-versions';
export * from './dom';
export * from './hooks';
export * from './is-gutentag-prefixed';
export * from './has-kubio-support';
export * from './components';
export * from './serializer';
export * from './web-fonts-loader';
export * from './patterns';
export {
	fromHtmlEntities,
	mergeNoArrays,
	toFixedNoRounding,
	toFixed,
	toFixedHighPrecision,
	deviceToMedia,
	defaultAssetURL,
	useDelayedFunction,
	ucwords,
	unsetArraySafe,
	differenceObj,
	diffUnitValueObjTree,
	removeThemeColorsFromObject,
	removeThemeColorsFromBlocks,
	pascalCase,
	cleanDeep,
	_,
	setSidesData,
	unsetSidesData,
	getUniqueSlug,
	slugify,
	generateSlug,
	capitalizeFirstLetter,
	transformBlockToTemplate,
	delayPromise,
	transformTemplateToBlock,
	refreshBlockStyleRefs,
	stripTags,
	toFixedDecimals,
	useTransformLinkControlValue,
	AI_IN_PRO,
	monitorValueChange,
	measureFnPerformance,
	findBlockByName,
	findParentWithChildBlockName,
	convertColibriColorPalette,
	getObjectDifference,
	queueCall,
	removeEmptyObjects,
	removeEmptyObjectV2,
	isAdvancedMode,
	toggleAdvancedMode,
	__experimentalDeepMemize,
	getNextSectionNameAndId,
	getNextSectionNameAndIdForPattern,
	getBlocksUsedInTemplate,
	deepmergeAll,
	semver,
	wpVersionCompare,
	walkBlocks,
	normalizeVariation,
	cleanFontFamilyFromBlocks,
	getColorPalettesAreEqual,
	getShowInternalFeatures,
	findAllBlocksByName,
	staticAssetURL,
	onOpenTemplateGalleryWithParams,
	getBackendData,
	convertHtmlEntitiesToString,
	kubioCloneDeep,
	SHOW_ADVANCED_IN_PRO
};

export const isPatternAvailableInCurrentTheme = (pattern) => {
	const currentThemeName = select('core')?.getCurrentTheme()?.template;
	const currentStylesheetName =
		select('core')?.getCurrentTheme()?.stylesheet;

	const isThemeSpecific = pattern?.internalTags.some((tag) =>
		tag.startsWith('theme-')
	);

	if (currentThemeName && isThemeSpecific) {
		const isForTheme =
			pattern?.internalTags.includes(`theme-${currentThemeName}`) ||
			pattern?.internalTags.includes(
				`theme-${currentStylesheetName}`
			);

		if (!isForTheme) {
			return false;
		}
	}

	return true;
};
