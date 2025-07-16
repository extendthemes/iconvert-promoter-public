import { useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { get } from 'lodash';
import useGlobalDataEntity from './use-global-data-entity';

const useGlobalDataSetting = (settingPath) => {
	const { getPathValue, setPathValue } = useGlobalDataEntity();

	const kubioGlobalSettings = useSelect((select) => {
		return (
			select('core/block-editor').getSettings()?.kubioGlobalSettings ?? {}
		);
	}, []);

	const value = getPathValue(
		`_settings.${settingPath}`,
		get(kubioGlobalSettings, settingPath, null)
	);
	const setValue = useCallback(
		(nextValue) => {
			setPathValue(`_settings.${settingPath}`, nextValue);
		},
		[settingPath, setPathValue]
	);

	return [value, setValue];
};

export default useGlobalDataSetting;
