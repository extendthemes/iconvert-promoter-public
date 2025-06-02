import { withSelect } from '@wordpress/data';
import { useDeepMemo } from '@kubio/core';

//the form list is loaded with some delay to let the page boot up faster. This hoc is need to trigger a refresh on the
//contact form/ subscribe form blocks when the forms are updated. Without this the user need to make a change on block
//for the list to be updated
const WithRefreshOnFormListChange = (formListStore) => {
	return withSelect((select) => {
		const { getFormOptions, getLoading } = select(formListStore);
		const formOptions = getFormOptions();
		const isLoading = getLoading();
		const memoisedFormOptions = useDeepMemo(() => {
			return formOptions;
		}, [formOptions]);
		return {
			isLoading,
			formOptions: memoisedFormOptions,
		};
	});
};

export { WithRefreshOnFormListChange };
