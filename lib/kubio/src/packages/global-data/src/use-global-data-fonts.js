import { useBlocksOwnerDocument } from '@kubio/editor-data';
import { loadTypeKitFonts, queueCall } from '@kubio/utils';
import { useCallback } from '@wordpress/element';
import { addAction, removeAction } from '@wordpress/hooks';
import { castArray, find, flatten, indexOf, once, uniq } from 'lodash';
import isEqual from 'react-fast-compare';
import {
	renderGoogleUsedFonts,
	renderTypekitFonts,
} from './global-style-render';
import googleFonts from './google-fonts';
import useGlobalDataEntity from './use-global-data-entity';
import { useTypeKitFontsApi } from './use-typekit-fonts-api';

const useGlobalDataFonts = () => {
	const { getPathValue, setPathValue } = useGlobalDataEntity();
	const ownerDocument = useBlocksOwnerDocument();

	const getSiteFonts = () => {
		getPathValue('fonts');
	};
	const setSiteFonts = useCallback(
		(value) => {
			setPathValue('fonts', value);
		},
		[setPathValue]
	);

	const getGoogleFonts = useCallback(() => getPathValue('fonts.google', []), [
		getPathValue,
	]);

	const renderTypekit = useCallback(
		(project) => {
			renderTypekitFonts(project, ownerDocument);
		},
		[ownerDocument]
	);

	const addGoogleFont = useCallback(
		(fonts) => {
			const currentFonts = getGoogleFonts();

			const newFonts = castArray(fonts);
			const nextFonts = [...currentFonts];

			newFonts.forEach((nextFont) => {
				if (!find(nextFonts, { family: nextFont.family })) {
					nextFonts.push(nextFont);
				} else {
					const existingFont = find(nextFonts, {
						family: nextFont.family,
					});
					const nextVariants = existingFont.variants;

					nextFont.variants.forEach((variant) => {
						if (
							!nextVariants.includes(variant) &&
							!nextVariants.includes(variant.toString())
						) {
							nextVariants.push(variant);
						}
					});

					nextFonts[indexOf(nextFonts, existingFont)] = {
						...existingFont,
						variants: nextVariants,
					};
				}
			});

			renderGoogleUsedFonts(nextFonts, ownerDocument);
			if (!isEqual(currentFonts, nextFonts)) {
				setPathValue('fonts.google', nextFonts);
			}
		},
		[setPathValue, getGoogleFonts, ownerDocument]
	);

	// typekit

	const {
		setKey,
		getTypeKitProjects,
		isLoading: isTypeKitApiLoading,
		refresh: _refreshTypeKitFonts,
		getErrors: getTypeKitApiErrors,
	} = useTypeKitFontsApi();

	const setTypeKitAPIKey = useCallback(
		(key) => {
			setPathValue('fonts.typekit.key', key?.trim());
			setKey(key);
		},
		[setKey, setPathValue]
	);

	const getTypeKitAPIKey = useCallback(
		() => getPathValue('fonts.typekit.key', ''),
		[getPathValue]
	);

	const getTypeKitUsedProject = useCallback(
		() => getPathValue('fonts.typekit.project', {}),
		[getPathValue]
	);

	const setTypekitUsedProject = useCallback(
		(project) => {
			renderTypekit(project);
			setPathValue('fonts.typekit.project', project);
		},
		[setPathValue]
	);

	const onFontsLoadedQueueResolver = useCallback(
		(queue) => {
			const nextFonts = flatten(flatten(queue));
			const normalized = nextFonts.reduce(
				(acc, font) => ({
					...acc,
					[font.family]: [
						...(acc[font.family] || []),
						...font.variants,
					],
				}),
				{}
			);
			addGoogleFont(
				Object.keys(normalized).map((family) => ({
					family,
					variants: uniq(normalized[family]).map(
						(value) => parseInt(value) || 400
					),
				}))
			);
		},
		[addGoogleFont]
	);
	const onFontsLoaded = useCallback(
		queueCall(onFontsLoadedQueueResolver, 300),
		[onFontsLoadedQueueResolver]
	);

	const renderFonts = useCallback(() => {
		renderGoogleUsedFonts(getGoogleFonts(), ownerDocument);
		renderTypekit(getTypeKitUsedProject());
		removeAction('kubio.google-fonts.load', 'kubio.google-fonts.load');
		addAction(
			'kubio.google-fonts.load',
			'kubio.google-fonts.load',
			onFontsLoaded
		);
	}, [ownerDocument, onFontsLoaded]);

	const initFonts = once(() => {
		setKey(getTypeKitAPIKey());
		renderFonts();
	});

	const getTypeKitUsedFonts = useCallback(() => {
		const project = find(getTypeKitProjects(), {
			id: getTypeKitUsedProject(),
		});
		if (project) {
			return project.families;
		}

		return [];
	}, [getTypeKitProjects(), getTypeKitUsedProject()]);

	const refreshTypeKitFonts = () => {
		_refreshTypeKitFonts();
		loadTypeKitFonts(getTypeKitUsedProject());
	};

	const getAvailableGoogleFonts = useCallback(
		() => googleFonts.map((item) => ({ ...item, fontType: 'google' })),
		[]
	);

	const parseVariants = (variants) => {
		const weights = variants.map((item) => {
			item = item.replace('regular', 400);
			item = item.replace(/([0-9]+)italic/, '$1');
			item = item.replace('italic', 400);

			return parseInt(item);
		});

		return uniq(weights);
	};

	const getFontWeights = (family) => {
		const allVariants = [100, 200, 300, 400, 500, 600, 700, 800, 900];

		if (!family) {
			return allVariants;
		}

		const typeKitFont = find(getTypeKitUsedFonts(), { family });

		if (typeKitFont) {
			return parseVariants(typeKitFont.variants);
		}

		const googleFont = find(googleFonts, { family });

		if (googleFont) {
			return parseVariants(googleFont.variants);
		}

		return allVariants;
	};

	return {
		// general
		getFontWeights,
		// google
		getSiteFonts,
		setSiteFonts,
		getGoogleFonts,
		addGoogleFont,
		getAvailableGoogleFonts,
		initFonts,
		renderFonts,
		// typekit
		// -- options
		setTypeKitAPIKey,
		getTypeKitAPIKey,
		setTypekitUsedProject,
		getTypeKitUsedProject,
		// -- api data
		getTypeKitProjects,
		getTypeKitUsedFonts,
		isTypeKitApiLoading,
		refreshTypeKitFonts,
		getTypeKitApiErrors,
	};
};

export default useGlobalDataFonts;
