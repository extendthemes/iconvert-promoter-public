import { Merger, useActiveMedia, withColibri } from '@kubio/core';
import { useBlocksOwnerDocument } from '@kubio/editor-data';
import { getFilteredTypes, ParserUtils } from '@kubio/style-manager';
import { deepmergeAll } from '@kubio/utils';
import { useCallback, useMemo } from '@wordpress/element';
import { kashe } from 'kashe';
import _ from 'lodash';
import renderGlobalStyle from './global-style-render';
import useGlobalDataEntity from './use-global-data-entity';

const customMerger = kashe((sharedData, types) => {
	const { model, statesByComponent } = ParserUtils.normalizeBlockData(
		{
			attributes: {
				kubio: sharedData,
			},
		},
		{
			supports: {
				kubio: types.definitions.globalStyle,
			},
		}
	);

	for (const prop in statesByComponent) {
		statesByComponent[prop] = Object.values(types.enums.states);
	}

	const style = Merger.mergeStyle({}, model.style, { statesByComponent });
	const props = Merger.mergeProps({}, model.props);

	return {
		...sharedData,
		style: style?.shared,
		_style: style?.local,
		props: props?.shared,
		_props: props?.local,
	};
});

const useGlobalDataStyle = () => {
	const {
		getPathValue,
		setPathValue,
		defaultGlobalStyle,
		defaultInitialGlobalStyle,
		globalData,
	} = useGlobalDataEntity();
	const ownerDocument = useBlocksOwnerDocument();

	const globalStyleData = useMemo(() => {
		return getPathValue('globalStyle');
	}, [globalData, getPathValue]);

	const media = useActiveMedia();

	const dataHelperDefaultOptionsContext = useMemo(
		() => ({
			defaultOptions: {
				media,
			},
		}),
		[media]
	);

	const globalStyleHelper = useMemo(
		() =>
			withColibri.init(
				{
					kubio: globalStyleData,
				},
				{},
				'',
				{
					autoSave: true,
					dataHelperDefaultOptionsContext,
					customMerger: (sharedData) =>
						customMerger(sharedData, getFilteredTypes()),
					_updateStoreFunction: (
						clientId,
						hooks,
						data,
						dataHelper
					) => {
						const style = _.get(data, 'kubio', {});
						renderGlobalStyle(dataHelper, ownerDocument);
						setPathValue('globalStyle', style);
					},
				}
			),
		[
			globalStyleData,
			ownerDocument,
			dataHelperDefaultOptionsContext,
			setPathValue,
		]
	);
	const renderStyle = useCallback(
		(doc) => renderGlobalStyle(globalStyleHelper, doc || ownerDocument),
		[globalStyleHelper, ownerDocument]
	);

	const initStyle = useMemo(() => _.once(renderStyle), [renderStyle]);

	const getPropDefaultGlobalValue = useCallback(
		(path, options = {}) => {
			const defaultValuePath =
				globalStyleHelper.getPropsRoot(options) + '.' + path;
			return _.get(defaultGlobalStyle, defaultValuePath);
		},
		[globalStyleHelper]
	);
	const getStyleDefaultGlobalValue = useCallback(
		(path, options = {}) => {
			const defaultValuePath =
				globalStyleHelper.getStyleRoot(options) + '.' + path;
			return _.get(defaultGlobalStyle, defaultValuePath);
		},
		[globalStyleHelper]
	);
	const getPropInitialDefaultGlobalValue = useCallback(
		(path, options = {}) => {
			const defaultValuePath =
				globalStyleHelper.getPropsRoot(options) + '.' + path;
			return _.get(defaultInitialGlobalStyle, defaultValuePath);
		},
		[globalStyleHelper]
	);
	const getStyleInitialDefaultGlobalValue = useCallback(
		(path, options = {}) => {
			const defaultValuePath =
				globalStyleHelper.getStyleRoot(options) + '.' + path;
			return _.get(defaultInitialGlobalStyle, defaultValuePath);
		},
		[globalStyleHelper]
	);
	const resetToInitialData = (path, options = {}) => () => {
		const baseOptions = {
			media,
			mergeData: false,
		};

		const combinedPaths = _.castArray(path);
		const mergedOptions = deepmergeAll([{}, baseOptions, options]);

		_.forEach(combinedPaths, function (combinedPath) {
			const stylePath =
				globalStyleHelper.getStyleRoot(mergedOptions) +
				'.' +
				combinedPath;

			const globalInitialValue = _.get(
				defaultInitialGlobalStyle,
				stylePath
			);

			if (undefined !== globalInitialValue) {
				globalStyleHelper.setStyle(
					combinedPath,
					globalInitialValue,
					mergedOptions
				);
			} else {
				globalStyleHelper.unsetStyle(combinedPath, '', mergedOptions);
			}
		});
	};
	return {
		getPropDefaultGlobalValue,
		getPropInitialDefaultGlobalValue,
		getStyleDefaultGlobalValue,
		getStyleInitialDefaultGlobalValue,
		globalStyle: globalStyleHelper,
		initStyle,
		renderStyle,
		globalStyleData,
		resetToInitialData,
	};
};

export default useGlobalDataStyle;
