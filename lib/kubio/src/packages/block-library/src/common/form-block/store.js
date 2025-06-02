import { registerStore, useDispatch, useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { get, once } from 'lodash';

const defaultState = {
	forms: {},
	loading: true,
	errors: false,
};

const generateFormStore = ({
	storeKey,
	shortcodeTagByType,
	labelsByType,
	apiPath,
}) => {
	registerStore(storeKey, {
		reducer: (state = defaultState, action) => {
			return {
				...state,
				[action.type]: action.value,
			};
		},
		actions: {
			setForms(value) {
				return {
					type: 'forms',
					value,
				};
			},
			setLoading(value) {
				return {
					type: 'loading',
					value,
				};
			},
			setErrors(value) {
				return {
					type: 'errors',
					value,
				};
			},
		},
		selectors: {
			getForms: (state) => state.forms,
			getLoading: (state) => state.loading,
			getErrors: (state) => state.errors,
			getFormOptions: (state) => {
				const formsByType = state.forms;
				const formTypesOptions = Object.keys(formsByType).map(
					(type) => {
						const items = get(formsByType, type, []).map((item) => {
							return { ...item, value: String(item.value) };
						});
						return {
							label: get(labelsByType, type, type),
							items,
							value: get(shortcodeTagByType, type, type),
						};
					}
				);
				return formTypesOptions;
			},
		},
	});

	const getFormsByType = async () => {
		return apiFetch({
			path: addQueryArgs(apiPath),
		});
	};
	const logErrors = (errors) => {
		// eslint-disable-next-line no-console
		console.group(__('Contact Form Api Errors', 'kubio'));
		// eslint-disable-next-line no-console
		console.error(errors);
		// eslint-disable-next-line no-console
		console.groupEnd();
	};

	const useFormApi = () => {
		const { getForms, getLoading, getErrors, getFormOptions } = useSelect(
			(select) => {
				return select(storeKey);
			}
		);

		const { setForms, setLoading, setErrors } = useDispatch(storeKey);

		const retrieve = () => {
			setLoading(true);
			getFormsByType()
				.then((formsByType) => {
					setForms(formsByType);
					setLoading(false);
				})
				// eslint-disable-next-line no-console
				.catch((callErrors) => {
					setForms({});
					logErrors(callErrors);
					setErrors(callErrors);
					setLoading(false);
				});
		};

		const isLoading = () => getLoading();
		const init = once(() => {
			retrieve();
		});

		return {
			init,
			getForms,
			getFormOptions,
			retrieve,
			isLoading,
			getErrors,
		};
	};
	return { useFormApi };
};

export { generateFormStore };
