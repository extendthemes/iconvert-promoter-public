import _ from 'lodash';
import { useGlobalFormStyleInherited } from './index';
import { deepmergeAll } from '@kubio/utils';

function useGetFormDataWithInherited({
	dataHelper,
	storeOptions = {},
	globalFormElement,
} = {}) {
	const inheritedFormValue = useGlobalFormStyleInherited({
		...storeOptions,
		styledComponent: globalFormElement,
	});

	const getFormData = (path, defaultValue, options = {}) => {
		const data = dataHelper.getStyle(path, defaultValue, {
			...storeOptions,
			...options,
		});
		const inheritedData = _.get(inheritedFormValue, path);
		let mergedValue;
		if (typeof inheritedData === 'object') {
			mergedValue = deepmergeAll([{}, inheritedData, data]);
		} else {
			mergedValue = data ? data : inheritedData;
		}
		return {
			value: mergedValue,
		};
	};

	return getFormData;
}

export { useGetFormDataWithInherited };
