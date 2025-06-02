import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { registerStore, useDispatch, useSelect } from '@wordpress/data';
import { useCallback } from 'react';

const defaultState = {
	projects: [],
	loading: false,
	key: false,
	errors: false,
};

registerStore('kubio/typekit-fonts', {
	reducer: (state = defaultState, action) => {
		return {
			...state,
			[action.type]: action.value,
		};
	},
	actions: {
		setProjects(value) {
			return {
				type: 'projects',
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
		setKey(value) {
			return {
				type: 'key',
				value,
			};
		},
	},
	selectors: {
		getProjects: (state) => state.projects,
		getLoading: (state) => state.loading,
		getKey: (state) => state.key,
		getErrors: (state) => state.errors,
	},
});

const typekitApiCall = async ({ path, key }) => {
	return apiFetch({
		path: addQueryArgs('/kubio/v1/typekit-query', { path, key }),
	});
};

const typekitVariantToGoogleVariant = (value) => {
	let [type, weight] = value.split('');

	switch (type) {
		case 'i':
			type = 'italic';
			break;
		default:
			type = '';
	}

	return parseInt(weight) * 100 + type;
};

const logErrors = (errors) => {
	// eslint-disable-next-line no-console
	console.group(__('Adobe TypeKit Api Errors', 'kubio'));
	// eslint-disable-next-line no-console
	console.error(errors);
	// eslint-disable-next-line no-console
	console.groupEnd();
};

const retrieveTypeKitsProjects = async (key) => {
	if (!key) {
		return new Promise((resolve, reject) =>
			reject(['Api Key is not defined'])
		);
	}

	let response;
	try {
		response = await typekitApiCall({
			path: 'api/v1/json/kits',
			key,
		});
	} catch (e) {
		return new Promise((resolve, reject) =>
			reject(['Unable to call Adobe servers - Retrieve Kits'])
		);
	}

	if (response.errors) {
		return new Promise((resolve, reject) => reject(response.errors));
	}

	const kits = response.kits;
	const promises = [];

	kits.forEach((kit) => {
		promises.push(
			typekitApiCall({
				path: kit.link,
				key,
			})
		);
	});

	try {
		const kitsResponses = await Promise.all(promises);
		const kitsData = [];

		for (let i = 0; i < kitsResponses.length; i++) {
			const kitResponse = kitsResponses[i];
			if (kitResponse.errors) {
				return new Promise((resolve, reject) =>
					reject(kitResponse.errors)
				);
			}
			const kit = kitResponse.kit;

			const families = kit.families.map(({ slug, variations }) => {
				return {
					family: slug,
					variants: variations.map(typekitVariantToGoogleVariant),
					fontType: 'typekit',
				};
			});

			kitsData.push({
				id: kit.id,
				name: kit.name,
				families,
			});
		}
		return new Promise((resolve) => resolve(kitsData));
	} catch (e) {
		return new Promise((resolve, reject) =>
			reject(['Unable to call Adobe servers  - Retrieve Kit data'])
		);
	}
};

const useTypeKitFontsApi = () => {
	const { getProjects, loading, getKey, getErrors } = useSelect((select) => {
		const store = select('kubio/typekit-fonts');

		return {
			getProjects: store.getProjects,
			loading: store.getLoading(),
			getKey: store.getKey,
			getErrors: store.getErrors,
		};
	}, []);

	const {
		setProjects,
		setLoading,
		setKey: setStoreKey,
		setErrors,
	} = useDispatch('kubio/typekit-fonts');

	const retrieve = (key) => {
		setLoading(true);
		retrieveTypeKitsProjects(key)
			.then((kits) => {
				setProjects(kits);
				setLoading(false);
			})
			.catch((callErrors) => {
				setProjects([]);
				logErrors(callErrors);
				setErrors(callErrors);
				setLoading(false);
			});
	};

	const setKey = (value) => {
		if (value) {
			setStoreKey(value);
			retrieve(value);
		}
	};

	const getTypeKitProjects = () => getProjects();

	const refresh = () => {
		retrieve(getKey());
	};

	const isLoading = useCallback(() => loading, [loading]);

	return {
		setKey,
		getTypeKitProjects,
		refresh,
		isLoading,
		getErrors,
	};
};

export { useTypeKitFontsApi };
