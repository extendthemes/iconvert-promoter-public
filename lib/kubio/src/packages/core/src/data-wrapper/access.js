import { UNSET_VALUE } from '@kubio/constants';
import { Media } from '@kubio/style-manager';
import {
	deepmergeAll,
	mergeNoArrays,
	refreshBlockStyleRefs,
	unsetArraySafe,
	_,
} from '@kubio/utils';
import {
	cloneBlock,
	getBlockAttributes,
	getBlockType,
} from '@wordpress/blocks';
import {
	dispatch as globalDispatch,
	select as globalSelect,
} from '@wordpress/data';
import { castArray, debounce, forEach, isEmpty, isFunction, isObject } from 'lodash';
import shortid from 'shortid';
import { WithDataPathTypes } from '../common/hocs';
import { getColibriData } from '../hooks/data';
import { getBlockDefaultElement, getBlockWrapperElement } from '../utils';
import { mergeMainAttribute } from '../utils/merge';

const DUMMY_DEFAULT = {};
const { mediasById } = Media;

const cachedMergedAttributes = new Map();

const composeCacheKey = (styleRef, hash = '') => {
	if (!styleRef) {
		return null;
	}

	return `${styleRef}:${hash}`;
};

const getCachedMergedAttributes = (styleRef, hash) => {
	const key = composeCacheKey(styleRef, hash);
	if (!key) {
		return null;
	}

	return cachedMergedAttributes.get(key) || null;
};

const setCachedMergedAttributes = (styleRef, hash, data) => {
	const key = composeCacheKey(styleRef, hash);
	if (!key) {
		return null;
	}
	cachedMergedAttributes.set(key, data);
};

const removeCachedMergedAttributes = (styleRef) => {
	if (styleRef) {
		[...cachedMergedAttributes.keys()].forEach((key) => {
			if (key.startsWith(`${styleRef}:`)) {
				cachedMergedAttributes.delete(key);
			}
		});
	}
};

const removeCachedAllMergedAttributes = () => {
	cachedMergedAttributes.clear();
};

const finalizeGroupExecution = debounce(({ silentDispatch }) => {
	ColibriHelper.__paused.state = false;
	ColibriHelper.__paused.helpers.forEach(([helper, options]) => {
		try {
			helper.save({ silentDispatch, ...options });
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
	});

	ColibriHelper.__paused.doneCallbacks.forEach((after) => after());

	ColibriHelper.__paused = {
		state: false,
		helpers: [],
		doneCallbacks: [],
	};
}, 5);

class ColibriHelper {
	/**
	 *
	 * @param  options
	 * @return {this}
	 */
	constructor(options) {
		this.mediasById = mediasById;
		const { data, context, basePath = '' } = options;
		return this.init(data, context, basePath);
	}

	static __paused = {
		state: false,
		helpers: [],
		doneCallbacks: [],
	};

	mergedData() {
		const isBlockOrHasCustomMerger =
			this.blockName || isFunction(this.options.customMerger);

		if (this.sharedData && isBlockOrHasCustomMerger) {
			const cached = getCachedMergedAttributes(
				this.getStyleRef(),
				this.getHash()
			);

			if (cached) {
				return cached;
			}

			const mergerFN = isFunction(this.options.customMerger)
				? this.options.customMerger
				: mergeMainAttribute;

			const obj = mergerFN(this.sharedData, this.blockName);

			setCachedMergedAttributes(
				this.getStyleRef(),
				this.getHash(),
				obj
			);

			return obj;
		}

		return this.sharedData;
	}

	get clientId() {
		return this.options?.clientId || this.clientData?.clientId;
	}

	get defaultStyledComponent() {
		return this.blockName
			? getBlockDefaultElement(this.blockName)?.name
			: '';
	}

	get wrapperStyledComponent() {
		return this.blockName
			? getBlockWrapperElement(this.blockName)?.name
			: '';
	}

	get blockName() {
		if (this.options?.blockType?.name) {
			return this.options.blockType.name;
		}
		if (this.options?.hooks) {
			const { getBlockName } = this.options?.hooks;
			return getBlockName(this.clientId);
		}
	}

	get block() {
		if (this.options?.blockType) {
			return this.options?.blockType;
		}

		if (this.options?.hooks) {
			const { getBlockName, getBlockType } = this.options?.hooks;
			return getBlockType(getBlockName(this.clientId));
		}
	}

	get defaultOptionsFromContext() {
		if (this.options?.hooks) {
			const { defaultOptions = {} } =
				this.options?.hooks?.dataHelperDefaultOptionsContext || {};
			return defaultOptions;
		}
		if (this.options?.dataHelperDefaultOptionsContext) {
			const { defaultOptions = {} } =
				this.options?.dataHelperDefaultOptionsContext || {};
			return defaultOptions;
		}
		return {};
	}

	get hooks() {
		return this.options?.hooks;
	}

	/**
	 *
	 * @param  data
	 * @param  context
	 * @param  basePath
	 * @param  options
	 * @return {ColibriHelper}
	 */

	get defaultAttributes() {
		return getBlockAttributes(this.blockName);
	}

	get blockContextDefaultData() {
		return this.options?.contextProps.default
			? this.options?.contextProps.default(this)
			: {};
	}

	get blockContextData() {
		const {
			getContextProp = _.noop,
			setContextProp = _.noop,
			clientId,
		} = this.options?.contextProps?.data || {};
		if (!clientId || clientId !== this?.clientId) {
			return {
				getter: _.noop,
				setter: _.noop,
			};
		}
		return {
			getter: (relPath, defaultValue, options = {}) => {
				let value = getContextProp(relPath, null, options);
				if (value === null) {
					value = _.get(
						this.blockContextDefaultData,
						relPath,
						defaultValue
					);
				}
				return value;
			},
			setter: setContextProp,
		};
	}

	init(data = {}, context, basePath = '', options = {}) {
		const { clientData, localData, kubio } = data;

		this.context = context;
		this.sharedData = kubio || {};
		this.cleanEmptyArrayRootSharedData();
		this.localData = localData;
		this.clientData = clientData;
		this.basePath = basePath;
		this.options = this.getOptionsWithDefault(options);

		this.mergedData();

		return this;
	}

	cleanEmptyArrayRootSharedData() {
		const paths = ['style', '_style', 'props'];
		paths.forEach((path) => {
			const pathValue = this.sharedData?.[path];
			if (Array.isArray(pathValue) && _.isEmpty(pathValue)) {
				this.sharedData[path] = {};
			}

			_.eachDeep(
				pathValue || {},
				(value, key, parentValue) => {
					if (Array.isArray(value) && value?.length === 0) {
						//unset empty array
						_.unset(parentValue, key);
					}
				},
				{ leavesOnly: true }
			);
		});
	}
	update(data = {}, options = {}) {
		const { clientData, localData, kubio } = data;

		this.sharedData = kubio || {};
		this.localData = localData;
		this.clientData = clientData;

		this.options = this.getOptionsWithDefault(options);

		this.mergedData();

		return this;
	}

	getOptionsWithDefault(options) {
		const base = {
			autoSave: true,
			forceLoadStoreData: false,
			_updateStoreFunction: null,
		};

		if (!isObject(options)) {
			return base;
		}

		Object.keys(base).forEach((key) => {
			if (!options.hasOwnProperty(key)) {
				options[key] = base[key];
			}
		});

		return options;
	}

	walk(callback) {
		this.group(() => {
			_.each(this.withChildren(), (blockDataHelper) => {
				blockDataHelper.walk(callback);
				callback(blockDataHelper);
			});
		});
	}

	/**
	 *
	 * @param  options
	 * @return {ColibriHelper}
	 */
	withParent() {
		let parentHelper;
		if (this.options?.parentDataHelper) {
			parentHelper = this.options?.parentDataHelper();
		}

		if (parentHelper) {
			return parentHelper;
		}

		const parentId =
			this.options?.rootClientId ||
			this.hooks?.getBlockRootClientId(this.clientId);

		_.set(this.clientData, ['parentId'], parentId);
		return this.withClientId(parentId);
	}

	/**
	 * @return {ColibriHelper[]}
	 */

	withChildren(options) {
		const childrenClientIds =
			this.hooks?.getBlockOrder(this.clientId) || [];

		return childrenClientIds.map((clientId) => {
			return this.withClientId(clientId, {
				...(options || {}),
				parentDataHelper: () => this,
			});
		});
	}

	/**
	 * @return {ColibriHelper}
	 */
	findChildByClientId(clientId) {

		if (this.clientId === clientId) {
			return this;
		}

		const children = this.withChildren();
		if (children) {
			for (const key in children) {
				const found = children[key].findChildByClientId(clientId);
				if (found) {
					return found;
				}
			}
		}

		return null;
	}

	/**
	 *
	 * @return {ColibriHelper[]}
	 */
	withSiblings() {
		return this.withParent().withChildren();
	}

	/**
	 *
	 * @param {string}  clientId
	 * @param {boolean} flushCache
	 * @return {ColibriHelper[]}
	 */

	withClientId(clientId, options = {}) {
		const clientData = this.clientData;
		const extraOptions = _.pick(options, [
			'autoSave',
			'forceLoadStoreData',
			'blockName',
			'parentDataHelper',
			'invalidateCache',
		]);

		const thisOptions = _.omit(this.options, [
			'blockType',
			'contextProps',
			'parentDataHelper',
		]);

		const mergedOptions = deepmergeAll([
			{},
			{
				...thisOptions,
				rootClientId: null,
			},
			{
				clientId,
				loadColibriData: true,
			},
			extraOptions,
		]);
		const requestedClientData = getColibriData(
			mergedOptions,
			options?.hooks || this.hooks
		);

		_.set(
			clientData,
			['loaded', 'colibriDataById', clientId],
			requestedClientData
		);
		return requestedClientData;
	}

	/**
	 * @param {string|string[]}            path
	 * @param {"prop"|"style"}             type
	 * @param {DataModifiersOptions}       options
	 * @param {string|number|Array|Object} defaultValue
	 */
	usePath(type, path, options = {}, defaultValue = undefined) {
		path = castArray(path);

		const { styledComponent } = options;
		const styledComponentArray = _.castArray(styledComponent);
		options.styledComponent = styledComponentArray[0];

		if (
			options?.state === 'normal' ||
			(options.hasOwnProperty('state') && !options.state)
		) {
			delete options.state;
		}

		// check if we have an enforced type via the Control component.
		let { castType } = options;

		if (!castType) {
			// otherwise fallback on the type from the config.
			castType = options?.attributeConfig?.type;
		}

		const newValue = this.maybeTypeCastValue(
			this.get(type, path[0], defaultValue, options),
			castType
		);

		const props = {
			value: newValue,
			onReset: (localPath, localOptions = {}) => {
				path.forEach((pathItem) => {
					let mergedPath = pathItem;
					let mergedOptions = options;
					if (!isEmpty(localOptions)) {
						mergedOptions = deepmergeAll([
							{},
							options,
							localOptions,
						]);
					}
					if (localPath && typeof localPath === 'string') {
						mergedPath = [pathItem, localPath].join('.');
					}

					const isAutosave = this.options?.autoSave || false;
					this.options.autoSave = false;
					//this.set(type, mergedPath, UNSET_VALUE, mergedOptions);
					styledComponentArray.forEach((component) => {
						this.set(type, mergedPath, UNSET_VALUE, {
							...mergedOptions,
							styledComponent: component,
						});
					});
					this.options.autoSave = isAutosave;
					if (isAutosave) {
						this.save({
							skipSharedStyle: options.local,
						});
					}
				});
			},
			onChange: (nextValue, localPath, localOptions = {}) => {
				const value = this.maybeTypeCastValue(nextValue, castType);
				let mergedOptions = options;
				if (!isEmpty(localOptions)) {
					mergedOptions = deepmergeAll([
						{},
						options,
						localOptions,
					]);
				}
				const isAutosave = this.options?.autoSave || false;
				this.options.autoSave = false;
				path.forEach((pathItem) => {
					let mergedPath = pathItem;
					if (localPath && typeof localPath === 'string') {
						mergedPath = [pathItem, localPath].join('.');
					}
					//this.set(type, mergedPath, value, mergedOptions);
					styledComponentArray.forEach((component) => {
						this.set(type, mergedPath, value, {
							...mergedOptions,
							styledComponent: component,
						});
					});
				});
				this.options.autoSave = isAutosave;
				if (isAutosave) {
					const applyLiveStyling =
						type.startsWith('style') ||
						type.startsWith('_style');
					this.save(
						{
							skipSharedStyle: options.local,
						},
						applyLiveStyling
					);
				}
				options?.onChange?.(nextValue);
			},
		};

		return props;
	}

	getHash() {
		return this.sharedData?.hash || '';
	}

	getStyleRef() {
		return this.sharedData?.styleRef || '';
	}

	/**
	 * Type casts the value if necessary.
	 *
	 * @param {string|number|Array|Object} value
	 * @param {string}                     castType
	 * @return {number | string} The casted value.
	 */
	maybeTypeCastValue(value, castType) {
		switch (castType) {
			case 'number':
				value = parseFloat(value);
				break;
			case 'string':
				value = String(value);
				break;
			case 'array':
			case 'object':
			default:
				break;
		}

		return value;
	}

	/**
	 * @param {string}               path
	 * @param {DataModifiersOptions} options
	 * @param                        defaultValue
	 */
	usePropPath(path, options = {}, defaultValue = undefined) {
		return this.usePath(
			WithDataPathTypes.PROP,
			path,
			options,
			defaultValue
		);
	}

	/**
	 * @param {string}               path
	 * @param {DataModifiersOptions} options
	 * @param                        defaultValue
	 */
	useStylePath(path, options = {}, defaultValue = undefined) {
		return this.usePath(
			WithDataPathTypes.STYLE,
			path,
			options,
			defaultValue
		);
	}

	getAttributesNames() {
		return Object.keys(this.localData);
	}

	getAttributes(attributes = []) {
		const attrs = attributes.reduce((accumulator, attribute) => {
			return {
				...accumulator,
				[attribute]: this.getAttribute(attribute),
			};
		}, {});

		return attrs;
	}

	useAttributes(attributes = []) {
		const useAttributes = attributes.reduce((accumulator, attribute) => {
			return {
				...accumulator,
				[attribute]: this.useAttributePath(attribute),
			};
		}, {});

		return useAttributes;
	}

	useAttributePath(path, options = {}, defaultValue = undefined) {
		return this.usePath(
			WithDataPathTypes.ATTRIBUTE,
			path,
			options,
			defaultValue
		);
	}

	/**
	 * @param                        path
	 * @param                        relPath
	 * @param                        defaultValue
	 * @param {DataModifiersOptions} options
	 * @return {*}
	 */
	getStyle(relPath, defaultValue, options) {
		const mergedOptions = this.mergeDefaultOptions(options, true);

		let style = this.getPathValue(
			this.getStyleRoot(options, true) +
			(relPath ? '.' + relPath : ''),
			options,
			DUMMY_DEFAULT
		);

		if (style === DUMMY_DEFAULT && !mergedOptions?.ancestor) {
			style = defaultValue;
		}

		if ((!style || _.isObject(style)) && mergedOptions?.ancestor) {
			const noAncestorOptions = {
				...options,
				ancestor: '',
			};

			const normalStateValue = this.getPathValue(
				this.getStyleRoot(noAncestorOptions, true) +
				(relPath ? '.' + relPath : ''),
				noAncestorOptions,
				defaultValue
			);

			if (_.isObject(normalStateValue)) {
				style = deepmergeAll([{}, normalStateValue, style]);
			} else if (style === DUMMY_DEFAULT) {
				style = normalStateValue;
			}
		}

		return style;
	}
	getLocalStyle(relPath, defaultValue, options = {}) {
		return this.getStyle(relPath, defaultValue, {
			...options,
			local: true,
		});
	}
	getStyleByMedia(relPath, defaultValue, options) {
		const byMedia = {};
		_.each(this.mediasById, (media, id) => {
			byMedia[id] = this.getStyle(
				relPath,
				defaultValue,
				deepmergeAll([
					{},
					options,
					{
						media: id,
					},
				])
			);
		});

		return byMedia;
	}

	/**
	 *
	 * @param {"prop"|"style"}       type
	 * @param                        path
	 * @param                        defaultValue
	 * @param {DataModifiersOptions} options
	 * @return {*}
	 */
	get(type, path, defaultValue, options) {
		switch (type) {
			case WithDataPathTypes.PROP:
				return this.getProp(path, defaultValue, options);
			case WithDataPathTypes.STYLE:
				return this.getStyle(path, defaultValue, options);
			case WithDataPathTypes.ATTRIBUTE:
				return this.getAttribute(path, defaultValue, options);
			case WithDataPathTypes.CONTEXT:
				return this.getContextProp(path, defaultValue, options);
		}
	}

	getByMedia(type, path, defaultValue, options) {
		switch (type) {
			case WithDataPathTypes.PROP:
				return this.getPropByMedia(path, defaultValue, options);
			case WithDataPathTypes.STYLE:
				return this.getStyleByMedia(path, defaultValue, options);
		}
	}

	/**
	 *
	 * @param                        type
	 * @param                        path
	 * @param                        value
	 * @param {DataModifiersOptions} options
	 * @return {*}
	 */
	set(type, path, value, options = {}) {
		switch (type) {
			case WithDataPathTypes.PROP:
				this.setProp(path, value, options);
				break;
			case WithDataPathTypes.STYLE:
				this.setStyle(path, value, options);
				break;
			case WithDataPathTypes.ATTRIBUTE:
				this.setAttribute(path, value, options);
				break;
			case WithDataPathTypes.CONTEXT:
				this.setContextProp(path, value, options);
				break;
		}
	}

	/**
	 * @param                        path
	 * @param                        relPath
	 * @param                        defaultValue
	 * @param {DataModifiersOptions} options
	 * @return {*}
	 */
	getProp(relPath, defaultValue = undefined, options = {}) {
		const defaultOptions = {
			media: 'desktop',
		};
		const mergedOptions = deepmergeAll([{}, defaultOptions, options]);
		if (mergedOptions?.media === 'current') {
			delete mergedOptions.media;
		}
		return this.getPropInMedia(relPath, defaultValue, mergedOptions);
	}

	/**
	 *
	 * @param                        relPath
	 * @param                        defaultValue
	 * @param {DataModifiersOptions} options
	 * @return {{}}
	 */
	getPropByMedia(relPath, defaultValue = undefined, options) {
		const byMedia = {};

		_.each(this.mediasById, (media, id) => {
			byMedia[id] = this.getProp(
				relPath,
				defaultValue,
				deepmergeAll([
					{},
					options,
					{
						media: id,
					},
				])
			);
		});

		return byMedia;
	}

	/**
	 *
	 * @param                        relPath
	 * @param                        defaultValue
	 * @param {DataModifiersOptions} options
	 * @return {{}}
	 */
	getLocalPropByMedia(relPath, defaultValue, options = {}) {
		return this.getPropByMedia(relPath, defaultValue, {
			...options,
			local: true,
		});
	}

	/**
	 * @param  options
	 * @param  useDefaultStyleComponent
	 * @return {*}
	 */
	mergeDefaultOptions(options, useDefaultStyleComponent = false) {
		const merged = _.defaultsDeep({}, options, {
			...this.defaultOptionsFromContext,
			local: false,
			fromRoot: false,
			styledComponent: useDefaultStyleComponent
				? this.defaultStyledComponent
				: undefined,
		});
		return merged;
	}

	/**
	 * @param {string}               relPath
	 * @param {any}                  value
	 * @param {DataModifiersOptions} options
	 * @return {any} value
	 */
	setStyle(relPath, value, options = {}) {
		const absPath =
			this.getStyleRoot(options) + (relPath ? '.' + relPath : '');
		return this.setPathValue(absPath, value, options);
	}

	unsetStyle(relPath, value, options) {
		const mergedOptions = {
			unset: true,
			...options,
		};
		this.setStyle(relPath, value, mergedOptions);
	}

	/**
	 * Sets style that only applies only to the current node, linked nodes don't inherit this style
	 *
	 * @global
	 * @param {string}               relPath
	 * @param {any}                  value
	 * @param {DataModifiersOptions} options
	 */
	setLocalStyle(relPath, value, options = {}) {
		this.setStyle(relPath, value, { ...options, local: true });
	}

	/**
	 * @param                        relPath
	 * @param {any}                  value
	 * @param {DataModifiersOptions} options
	 * @param                        path
	 * @return {ColibriHelper}
	 */
	setProp(relPath, value, options = {}) {
		const defaultOptions = {
			media: 'desktop',
		};
		const mergedOptions = deepmergeAll([{}, defaultOptions, options]);

		if (mergedOptions?.media === 'current') {
			delete mergedOptions.media;
		}

		this.setPropInMedia(relPath, value, mergedOptions);
	}

	unsetProp(relPath, value, options) {
		const mergedOptions = {
			unset: true,
			...options,
		};

		this.setProp(relPath, value, mergedOptions);
	}

	/**
	 * @param {string}               relPath
	 * @param {any=}                 defaultValue
	 * @param {DataModifiersOptions} options
	 * @param {any}                  value
	 */
	setPropInMedia(relPath, value, options) {
		const absPath =
			this.getPropsRoot(options) + (relPath ? '.' + relPath : '');
		this.setPathValue(absPath, value, options);
	}

	/**
	 *
	 * @param  relPath
	 * @param  defaultValue
	 * @param  options
	 * @return {*}
	 */
	getPropInMedia(relPath, defaultValue, options) {
		const absPath =
			this.getPropsRoot(options, true) +
			(relPath ? '.' + relPath : '');
		const value = this.getPathValue(absPath, options, defaultValue);
		return value;
	}

	/**
	 * @param {string}               relPath
	 * @param                        path
	 * @param {DataModifiersOptions} options
	 * @param {any}                  value
	 * @param                        defaultValue
	 */
	getPathValue(path, options, defaultValue) {
		const fromRoot = _.get(options, 'fromRoot', false);
		const attr = _.get(options, 'attr', false);
		let source = null;
		if (attr) {
			source = this.localData;
		} else if (fromRoot) {
			source = this.sharedData;
		} else {
			source = this.mergedData(options?.ancestor);
		}
		const value = _.get(source, path, defaultValue);
		return value;
	}

	/**
	 * @param {string}               path
	 * @param {any}                  value
	 * @param {DataModifiersOptions} options
	 * @return {ColibriHelper}
	 */
	setPathValue(path, value, options) {
		let unset = _.get(options, 'unset', false);
		const local = _.get(options, 'local', false);
		const attr = _.get(options, 'attr', false);
		const mergeArrays = _.get(options, 'mergeArrays', false);
		const skipSharedStyle = _.get(options, 'skipSharedStyle', local);
		const ignoredPathOnUnset = _.get(
			options,
			'ignoredPathOnUnset',
			false
		);

		if (!unset && value === UNSET_VALUE) {
			unset = true;
		}

		const mergeData = _.get(options, 'mergeData', true);

		const arg = {
			local,
			attr,
			mergeData,
			mergeArrays,
			skipSharedStyle,
			ignoredPathOnUnset,
		};

		if (unset) {
			arg.unset = [path];
		}

		if (mergeData) {
			const obj = {};
			_.set(obj, path, window.structuredClone(value));
			arg.changes = obj;
		} else {
			arg.path = path;
			arg.value = window.structuredClone(value);
		}

		return this.applyChanges(arg);
	}

	mergeInMainAttribute(style) {
		this.sharedData = deepmergeAll([this.sharedData, style]);
		if (this.options?.autoSave) {
			this.save({
				skipSharedStyle: false,
			});
		}
	}

	/**
	 *
	 * @param  data
	 * @return {ColibriHelper}
	 */
	applyChanges(data) {
		const mergeData = _.get(data, 'mergeData', true);
		const mergeArrays = _.get(data, 'mergeArrays', false);
		const isAttribute = _.get(data, 'attr', false);
		const skipSharedStyle = _.get(data, 'skipSharedStyle', false);
		const ignoredPathOnUnset = _.get(data, 'ignoredPathOnUnset', false);

		const target = isAttribute ? this.localData : this.sharedData;
		let newValue;

		if (mergeData) {
			if (!mergeArrays) {
				newValue = mergeNoArrays({}, target, data.changes);
			} else {
				newValue = deepmergeAll([{}, target, data.changes]);
			}
			/** if mergeData is set to false replace it instead*/
		} else {
			const dataCopy = window.structuredClone(target);
			_.set(dataCopy, data.path, data.value);
			newValue = dataCopy;
		}

		if (data.unset) {
			let safeData = {};
			if (!_.isEmpty(ignoredPathOnUnset)) {
				safeData = window.structuredClone(target);
			}

			const paths = _.castArray(data.unset);
			_.each(paths, (path) => {
				if (isAttribute) {
					const defaultValue = _.get(this.defaultAttributes, path);
					_.set(newValue, path, defaultValue);
				} else {
					unsetArraySafe(newValue, path);
				}

				if (!_.isEmpty(ignoredPathOnUnset)) {
					const newPath = _.join([path, ignoredPathOnUnset], '.');

					if (_.has(safeData, newPath)) {
						_.set(newValue, newPath, _.get(safeData, newPath));
					}
				}
			});
		}

		if (isAttribute) {
			this.hasDirtyLocalData = true;
			this.localData = newValue;
		} else {
			this.hasDirtySharedData = true;
			this.sharedData = newValue;
		}

		if (this.options?.autoSave) {
			this.save({ skipSharedStyle });
		}

		removeCachedMergedAttributes(this.getStyleRef());

		return this;
	}

	save(options) {
		if (ColibriHelper.__paused.state) {
			const helperIndex = ColibriHelper.__paused.helpers.findIndex(
				([helper]) => helper === this
			);

			if (helperIndex >= 0) {
				ColibriHelper.__paused.helpers.splice(helperIndex, 1);
			}

			ColibriHelper.__paused.helpers.push([this, options]);
			return;
		}

		const mergedOptions = deepmergeAll([
			{},
			{
				skipSharedStyle: false,
			},
			options,
		]);
		if (
			this.options?._updateStoreFunction &&
			typeof this.options?._updateStoreFunction === 'function'
		) {
			const updateStoreArgs = [
				this.options.clientId,
				this.options.hooks,
				this.export(),
				this,
				mergedOptions,
			];

			this.options._updateStoreFunction(...updateStoreArgs);
		}
	}

	/**
	 *
	 * @param                 root
	 * @param {DataModifiers} options
	 * @return {any}
	 */

	getRootPropertyPath(root, options) {
		const { ancestor, media, state, styledComponent } = options;
		const paths = [].concat(root);

		if (ancestor) {
			paths.push('ancestor.' + ancestor);
		}

		if (styledComponent) {
			paths.push('descendants.' + styledComponent);
		}

		if (state && state !== 'normal') {
			paths.push('states.' + state);
		}

		if (media && media !== 'desktop') {
			paths.push('media.' + media);
		}

		return paths.join('.');
	}

	/**
	 * @param {string}               relPath
	 * @param {any}                  value
	 * @param {DataModifiersOptions} options
	 */
	setLocalProp(relPath, value, options = {}) {
		const defaultOptions = {
			local: true,
			attr: true,
		};
		const mergedOptions = deepmergeAll([{}, defaultOptions, options]);
		return this.setPathValue(relPath, value, mergedOptions);
	}

	/**
	 * @param {string}                relPath
	 * @param {any=}                  defaultValue
	 * @param {DataModifiersOptions=} options
	 */
	getLocalProp(relPath, defaultValue, options = {}) {
		const defaultOptions = {
			local: true,
		};
		const mergedOptions = deepmergeAll([{}, defaultOptions, options]);
		return this.getProp(relPath, defaultValue, mergedOptions);
	}

	/**
	 * @param {string}               relPath
	 * @param {any}                  value
	 * @param {DataModifiersOptions} options
	 */
	setAttribute(relPath, value, options = {}) {
		const defaultOptions = {
			attr: true,
		};
		const mergedOptions = deepmergeAll([{}, defaultOptions, options]);
		return this.setPathValue(relPath, value, mergedOptions);
	}

	setAttributes(attributes = {}, options = {}) {
		const data = {
			changes: attributes,
			attr: true,
			...options,
		};
		this.applyChanges(data);
	}

	/**
	 * @param {string}                relPath
	 * @param {any=}                  value
	 * @param                         defaultValue
	 * @param {DataModifiersOptions=} options
	 */
	getAttribute(relPath, defaultValue, options = {}) {
		const defaultOptions = {
			attr: true,
		};
		const mergedOptions = deepmergeAll([{}, defaultOptions, options]);
		return this.getPathValue(relPath, mergedOptions, defaultValue);
	}

	getContextProp(relPath, defaultValue, options = {}) {
		const { getter } = this.blockContextData;
		return getter(relPath, defaultValue, options);
	}

	setContextProp(relPath, value, options = {}) {
		const { setter } = this.blockContextData;
		return setter(relPath, value, options);
	}

	useContextPath(relPath, options, defaultValue) {
		return this.usePath(
			WithDataPathTypes.CONTEXT,
			relPath,
			options,
			defaultValue
		);
	}

	rootPaths(local) {
		return local
			? {
				props: '_props',
				style: '_style',
			}
			: {
				props: 'props',
				style: 'style',
			};
	}

	propsRoot() {
		return '';
	}

	getPath(
		type,
		isRead,
		{ ancestor, media, state, styledComponent, local } = {}
	) {
		const root = [];

		root.push(this.rootPaths(local)[type]);

		return this.getRootPropertyPath(root, {
			ancestor,
			media,
			state,
			styledComponent,
			local,
		});
	}

	getStyleRoot(options, isRead = false) {
		return this.getPath(
			'style',
			isRead,
			this.mergeDefaultOptions(options, true)
		);
	}

	getPropsRoot(options, isRead = false) {
		return this.getPath(
			'props',
			isRead,
			_.defaultsDeep(
				{},
				//filter valid props options
				_.pick(options, ['media', 'local', 'fromRoot']),
				// { ancestor: '' },
				{
					media: this.defaultOptionsFromContext?.media,
				}
			)
		);
	}

	async duplicate(options = {}) {
		const defaultOptions = {
			clientId: this?.clientId,
			unlink: false,
			selectDuplicate: true,
		};
		const mergedOptions = deepmergeAll([{}, defaultOptions, options]);
		const { unlink, selectDuplicate, clientId } = mergedOptions;

		const { insertBlocks } = globalDispatch('core/block-editor');
		const { getBlockIndex, getBlock, getBlockRootClientId } =
			globalSelect('core/block-editor');

		let nextBlock = cloneBlock(
			window.structuredClone(getBlock(clientId))
		);
		const parentClientId = getBlockRootClientId(clientId);

		if (unlink) {
			nextBlock = refreshBlockStyleRefs(nextBlock);
		} else {
			nextBlock = refreshBlockStyleRefs(nextBlock, {
				onlyHashes: true,
			});
		}

		const duplicateMapper = getBlockType(
			nextBlock.name
		)?.kubioDuplicateMapper;

		if (duplicateMapper) {
			nextBlock = duplicateMapper(nextBlock);
		}

		// trigger insert late to create only one undo step
		await insertBlocks(
			[nextBlock],
			getBlockIndex(clientId, parentClientId) + 1,
			parentClientId,
			selectDuplicate
		);

		const newItemDataHelper = this.withClientId(nextBlock.clientId, {
			block: nextBlock,
		});

		return newItemDataHelper;
	}

	//when using block duplicate the id is also copied we must generate a new id
	unlinkBlockAfterDuplicate(shouldSave = true, unlinkChildren = true) {
		if (unlinkChildren) {
			this.withChildren().forEach((childDataHelper) => {
				childDataHelper.unlinkBlockAfterDuplicate();
			});
		}
		this.sharedData = deepmergeAll([
			{},
			this.sharedData,
			{
				styleRef: shortid.generate(),
			},
		]);
		this.hasDirtySharedData = true;
		if (shouldSave) {
			this.save();
		}
	}

	export(useNewIds) {
		const styleRef = this.sharedData?.styleRef || shortid.generate();
		let kubio;
		if (!useNewIds) {
			kubio = {
				styleRef,
				...this.sharedData,
				hash: this.generateHash(),
			};
		} else {
			kubio = {
				...this.sharedData,
				styleRef: shortid.generate(),
				hash: this.generateHash(),
			};
		}

		return {
			kubio,
			localData: { ...this.localData },
		};
	}

	generateHash() {
		return shortid.generate();
	}

	mergeInBlock(block) {
		const exported = this.export();
		block.attributes = {
			kubio: exported.kubio,
			...exported.localData,
		};
		return block;
	}

	exportAsTemplate(withChildren = true, useNewIds = false) {
		const exported = this.export(useNewIds);
		return [
			this.blockName,
			{
				kubio: exported.kubio,
				...exported.localData,
			},
			withChildren
				? this.withChildren().map((child) => {
					return child.exportAsTemplate(
						withChildren,
						useNewIds
					);
				})
				: [],
		];
	}

	kubioSupports(support, fallback = false) {
		return _.get(
			this.block,
			`supports.kubio.supports.${support}`,
			fallback
		);
	}

	supports(support, fallback = false) {
		return _.get(this.block, `supports.${support}`, fallback);
	}

	/**
	 *	Group data helper actions into a single commit & also allow silentDispatch
	 *  The silent dispatch will be applied on all actions inside group.
	 * 	A group can use multiple data helpers ( like parentHelper, childHelper, etc) and will use the same silentDispatch state
	 *
	 * @param {*} actions
	 * @param {*} param1
	 */
	group(actions, { silentDispatch = false, after = null } = {}) {
		ColibriHelper.__paused.state = true;

		if (after) {
			ColibriHelper.__paused.doneCallbacks.push(after);
		}

		finalizeGroupExecution.cancel();
		try {
			actions();
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}

		finalizeGroupExecution({ silentDispatch });
	}

	/**
	 *
	 * 	Shorthand for group method with silentDispatch forced true
	 *
	 * @param {*} actions
	 * @param {*} options
	 */
	silent(actions, options = {}) {
		this.group(actions, {
			...options,
			silentDispatch: true,
		});
	}
}

const helper = new ColibriHelper({});

/**
 *
 * @type {function(): ColibriHelper}
 */

const getInstance = (data, options) => {
	return new ColibriHelper({});
};
/*,( colibri, options ) => {
		return false; //colibri?.hash + JSON.stringify( options );
	}*/

/**
 *
 * @type {{init: (function(*=, *=, *=, *=): ColibriHelper)}}
 */
const withColibri = {
	init: (data, context, basePath, options) => {
		return getInstance(data, options).init(
			data,
			context,
			basePath,
			options
		);
	},
};

export {
	withColibri,
	helper,
	ColibriHelper,
	getCachedMergedAttributes,
	removeCachedMergedAttributes,
	removeCachedAllMergedAttributes,
};
