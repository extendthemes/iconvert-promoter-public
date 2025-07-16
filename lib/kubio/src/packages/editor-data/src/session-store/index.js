import {
	GLOBAL_SESSION_ID,
	SESSION_STORE_KEY,
	STORE_KEY,
} from '@kubio/constants';
import { useEffectAsync } from '@kubio/core-hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	registerStore,
	select as globalSelect,
	useDispatch,
	useSelect,
} from '@wordpress/data';
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { get, isArray, merge, noop, set } from 'lodash';
import isEqual from 'react-fast-compare';
import { generate as generateId } from 'shortid';

const defaultState = {};

registerStore(SESSION_STORE_KEY, {
	reducer: (state = defaultState, { type, clientId, prop, value }) => {
		switch (type) {
			case 'SET_PROP':
				const dummyValue = 'kubio-dummy-value' + generateId();
				const currentValue = get(
					state,
					`${clientId}.${prop}`,
					dummyValue
				);
				if (
					currentValue === dummyValue ||
					!isEqual(currentValue, value)
				) {
					const newValue = set({}, `${clientId}.${prop}`, value);
					return merge({}, state, newValue);
				}

				return state;
			// return set(cloneDeep(state), [clientId, prop], value);
		}
	},
	actions: {
		setProp(clientId, prop, value) {
			return {
				type: 'SET_PROP',
				clientId,
				prop,
				value,
			};
		},
	},
	selectors: {
		getProp: (state, clientId, prop, fallback) => {
			if (!clientId) {
				return fallback;
			}

			return get(state, `${clientId}.${prop}`, fallback);
		},
	},
});

const useSessionProp = (clientId, prop, fallback = null) => {
	const value = useSelect(
		(select) => select(SESSION_STORE_KEY).getProp(clientId, prop, fallback),
		[]
	);
	const { setProp: setSessionProp } = useDispatch(SESSION_STORE_KEY);

	const setProp = useCallback(
		(clientId_, prop_, nextValue) => {
			const currentValue = globalSelect(SESSION_STORE_KEY).getProp(
				clientId_,
				prop_,
				fallback
			);
			if (!isEqual(currentValue, nextValue)) {
				setSessionProp(clientId_, prop_, nextValue);
			}
		},
		[value]
	);

	const setValue = useCallback(
		(nextValue) => setProp(clientId, prop, nextValue),
		[clientId, prop]
	);

	return [value, setValue];
};

const useSetGlobalSessionProp = (prop) => {
	const [, setValue] = useSessionProp(GLOBAL_SESSION_ID, prop);
	return setValue;
};

const useGetGlobalSessionProp = (prop, fallback = null) => {
	const [value] = useSessionProp(GLOBAL_SESSION_ID, prop, fallback);
	return value;
};

const useGlobalSessionProp = (prop, fallback = null) => {
	return useSessionProp(GLOBAL_SESSION_ID, prop, fallback);
};

/**
 *
 * @return {HTMLDocument} Document - current document
 */
const useBlocksOwnerDocument = () => {
	const blocksOwnerDocument = useGetGlobalSessionProp(
		'blocksOwnerDocument',
		window.document
	);

	return blocksOwnerDocument;
};

const useEditorIsLoadedChanged = (action = noop) => {
	const isReady = useGetGlobalSessionProp('ready', false);
	const [current, setCurrent] = useState(null);

	useEffect(() => {
		if (current === null || isReady !== current) {
			setCurrent(current);
			return action(isReady);
		}
	}, [isReady]);
};

const useOwnerDocumentChanged = (action = noop) => {
	const ownerDocument = useBlocksOwnerDocument();
	const currentDoc = useRef(null);

	useEffect(() => {
		if (
			!currentDoc.current ||
			!ownerDocument.isSameNode(currentDoc.current)
		) {
			currentDoc.current = ownerDocument;
			return action(ownerDocument);
		}
	}, [ownerDocument]);
};

const withSessionProps = () =>
	createHigherOrderComponent(
		(WrappedComponent) => (ownProps) => {
			const { clientId } = ownProps;
			const { getProp } = useSelect(
				(select) => select(SESSION_STORE_KEY),
				[clientId]
			);

			const { setProp } = useDispatch(SESSION_STORE_KEY);

			const sessionProps = {
				getValue: (prop, fallback) => getProp(clientId, prop, fallback),
				setValue: (prop, nextValue) =>
					setProp(clientId, prop, nextValue),
			};

			return (
				<WrappedComponent {...ownProps} sessionProps={sessionProps} />
			);
		},
		'withSessionProps'
	);

const withBlocksOwnerDocument = () =>
	createHigherOrderComponent(
		(WrappedComponent) => (ownProps) => {
			const ownerDocument = useBlocksOwnerDocument();
			return (
				<WrappedComponent {...ownProps} ownerDocument={ownerDocument} />
			);
		},
		'withBlocksOwnerDocument'
	);

const useCurrentPageBodyClasses = () => {
	const currentPagePath = useSelect(
		(select) => select(STORE_KEY).getPage()?.path,
		[]
	);

	const [pagesClasses, setPagesClasses] = useGlobalSessionProp(
		'pagesClasses',
		{}
	);

	useEffect(() => {
		if (!currentPagePath || pagesClasses?.[currentPagePath]) {
			return;
		}

		setPagesClasses({
			...pagesClasses,
			[currentPagePath]: [],
		});

		window
			.fetch(addQueryArgs(currentPagePath, { '__kubio-body-class': 1 }))
			.then((res) => res.json())
			.then((result) => {
				if (isArray(result?.data?.bodyClass)) {
					setPagesClasses({
						...pagesClasses,
						[currentPagePath]: result?.data?.bodyClass,
					});
				}
			});
	}, [currentPagePath, setPagesClasses, pagesClasses]);

	const classes = useMemo(() => pagesClasses?.[currentPagePath] || [], [
		pagesClasses,
		currentPagePath,
	]);

	return classes;
};

const useSetPageTitle = () => {
	const [pagesTitles, setPagesTitles] = useGlobalSessionProp(
		'pagesTitles',
		{}
	);
	return (id, title) =>
		setPagesTitles({
			...pagesTitles,
			[id]: {
				title,
				isLoading: false,
			},
		});
};

const useCurrentPageTitle = (
	placeholder = {
		type: 'placeholder',
		title: __('Page title placeholder', 'kubio'),
	}
) => {
	const currentPagePath = useSelect(
		(select) => select(STORE_KEY).getPage()?.path,
		[]
	);

	const [pagesTitles, setPagesTitles] = useGlobalSessionProp(
		'pagesTitles',
		{}
	);

	useEffectAsync(async () => {
		if (
			!currentPagePath ||
			pagesTitles?.[currentPagePath] ||
			pagesTitles[currentPagePath]?.isLoading
		) {
			return;
		}

		setPagesTitles({
			...pagesTitles,
			[currentPagePath]: {
				isLoading: true,
			},
		});

		window
			.fetch(addQueryArgs(currentPagePath, { '__kubio-page-title': 1 }))
			.then((res) => res.json())
			.then((response) => {
				if (response.data) {
					setPagesTitles({
						...pagesTitles,
						[currentPagePath]: {
							...response.data,
							isLoading: false,
						},
					});
				}
			});
	}, [currentPagePath, pagesTitles, setPagesTitles]);

	const pageTitle = useMemo(() => {
		const title = pagesTitles?.[currentPagePath];

		if (!title || title.isLoading) {
			return placeholder;
		}

		return title;
	}, [pagesTitles, currentPagePath, placeholder]);

	return pageTitle ?? __('Page', 'kubio');
};

export {
	useSessionProp,
	SESSION_STORE_KEY,
	GLOBAL_SESSION_ID,
	withSessionProps,
	useGlobalSessionProp,
	useBlocksOwnerDocument,
	withBlocksOwnerDocument,
	useOwnerDocumentChanged,
	useCurrentPageBodyClasses,
	useCurrentPageTitle,
	useSetGlobalSessionProp,
	useGetGlobalSessionProp,
	useEditorIsLoadedChanged,
	useSetPageTitle,
};
