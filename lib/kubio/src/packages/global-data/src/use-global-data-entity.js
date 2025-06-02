import { useCallback, useMemo } from '@wordpress/element';
import { get } from 'lodash';
import { useKubioGlobalDataContext } from './with-global-style/global-data-context';

const useGlobalDataEntity = () => {
	const {
		defaultSettings,
		initialDefaultSettings,
		globalData,
		updateValues,
	} = useKubioGlobalDataContext()?.global || {};

	const getPathValue = useCallback(
		(path, fallback) => {
			return get(globalData, path, get(defaultSettings, path, fallback));
		},
		[globalData]
	);

	const setPathValue = useCallback(
		(path, value) => {
			updateValues({
				[path]: value,
			});
		},
		[updateValues]
	);

	const defaultGlobalStyle = get(defaultSettings, 'globalStyle');
	const defaultInitialGlobalStyle = get(
		initialDefaultSettings,
		'globalStyle'
	);

	return useMemo(() => {
		return {
			defaultGlobalStyle,
			defaultInitialGlobalStyle,
			globalData,
			getPathValue,
			setPathValue,
			setMultiplePathsValues: updateValues,
		};
	}, [defaultGlobalStyle, globalData, getPathValue, setPathValue]);
};

export default useGlobalDataEntity;
