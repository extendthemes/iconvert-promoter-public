import { useGlobalDataMenuLocations } from '@kubio/global-data';
import apiFetch from '@wordpress/api-fetch';
import { createBlock } from '@wordpress/blocks';
import {
	dispatch as storeDispatch,
	select as storeSelect,
	subscribe,
	useDispatch,
	useSelect,
} from '@wordpress/data';
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { find, flatten, isArray, isUndefined, merge, noop, omit } from 'lodash';
import isEqual from 'react-fast-compare';
import { generate } from 'shortid';
import { gutentagMenuEntity, MENU_ITEM_BLOCK } from './const';
import { getKubioUrlWithRestPrefix } from '@kubio/constants';

const menuEntity = {};

const initialChangeUID = generate();
let loadMenuLocationUID = generate();

const getEntity = () => {
	if (!menuEntity.context) {
		menuEntity.context = createContext();
	}

	return menuEntity;
};

export function useEntityId() {
	return useContext(getEntity().context)?.id;
}

const generateItemInitialData = () => {
	const itemId = -1 * Date.now();
	return {
		id: itemId,
		parent: 0,
		type: 'custom',
		objectId: itemId,
		label: '',
		url: '',
		target: '',
	};
};

const emptyMenuEntity = {
	content: {},
	isResolving: false,
	hasResolved: false,
	lastChange: initialChangeUID,
};

export function useEntity(_id, fields = {}) {
	const providedId = useEntityId();
	const id = _id ?? providedId;

	const { editedEntity, isResolving, hasResolved } = useSelect((select) => {
		return {
			editedEntity: select('core').getEditedEntityRecord(
				gutentagMenuEntity.kind,
				gutentagMenuEntity.name,
				id,
				fields
			),
			isResolving: select('core').isResolving('getEditedEntityRecord', [
				gutentagMenuEntity.kind,
				gutentagMenuEntity.name,
				id,
				fields,
			]),
			hasResolved: select(
				'core'
			).hasFinishedResolution('getEditedEntityRecord', [
				gutentagMenuEntity.kind,
				gutentagMenuEntity.name,
				id,
				fields,
			]),
		};
	});

	const lasChangeUID = editedEntity?.lastChange;
	const data = editedEntity?.data;

	return useMemo(() => {
		if (!parseInt(id)) {
			return emptyMenuEntity;
		}
		return {
			content: data && JSON.parse(data),
			isResolving,
			hasResolved,
			lastChange: lasChangeUID || initialChangeUID,
		};
	}, [data, isResolving, hasResolved, id]);
}

export function useEntityProp(prop, _id, fields = {}) {
	const providedId = useEntityId();
	const id = _id ?? providedId;

	const { content, lastChange } = useEntity(id, fields);
	const value = useMemo(() => content && content[prop], [content]);
	const lastReloadUID = useMemo(
		() => content && (content.lastReloadUID || ''),
		[content]
	);

	const { editEntityRecord } = useDispatch('core');
	const setValue = useCallback(
		(newValue, forceReload = false) => {
			const newContent = {
				...content,
				[prop]: newValue,
				lastReloadUID: forceReload ? generate() : content.lastReloadUID,
			};

			// check if the items are equal desipite their order
			if (prop === 'items') {
				const sortedOldItems = [...(content.items || [])].sort(
					(a, b) => a.id - b.id
				);
				const sortedNextItems = [...(newValue || [])].sort(
					(a, b) => a.id - b.id
				);

				if (isEqual(sortedOldItems, sortedNextItems)) {
					return;
				}
			}

			editEntityRecord(
				gutentagMenuEntity.kind,
				gutentagMenuEntity.name,
				id,
				{
					data: JSON.stringify(newContent),
					lastChange: generate(),
				}
			);
		},
		[id, prop, content]
	);

	return [value, setValue, lastChange, lastReloadUID];
}

const itemsToBlocks = (items, parentId = 0) => {
	if (!isArray(items)) {
		return [];
	}

	return items
		.filter((item) => item.parent === parentId && !isUndefined(item.id))
		.sort((a, b) => a.order - b.order)
		.map(({ id, parent, label, url, target, object, type, objectId }) => {
			return createBlock(
				MENU_ITEM_BLOCK,
				{
					id,
					parent,
					label,
					url,
					target,
					object,
					type,
					objectId,
				},
				itemsToBlocks(items, id)
			);
		});
};

const blocksToItems = (blocks, parent = 0) => {
	return flatten(
		blocks.map(({ attributes, innerBlocks }, order) => {
			const attrs = merge(generateItemInitialData(), attributes);
			return [
				{
					...omit(attrs, 'kubio'),
					order: order + 1,
					parent,
				},
				...blocksToItems(innerBlocks, attributes.id),
			];
		})
	);
};

const useMenuBlockEditor = (_id, fields = {}) => {
	const providerId = useEntityId();
	const id = _id ?? providerId;

	const { isResolving, hasResolved } = useEntity(id, fields);

	const [items, setItems, lastChangeUID, lastReloadUID] = useEntityProp(
		'items',
		id,
		fields
	);
	const [menu, setMenu] = useEntityProp('menu', id, fields);

	const onChange = useCallback(
		(nextBlocks) => {
			const nextItems = blocksToItems(nextBlocks);
			if (!isEqual(items, nextItems)) {
				setItems(nextItems);
			}
		},
		[setItems, items]
	);

	return {
		id,
		items,
		setItems,
		onChange,
		menu,
		setMenu,
		onInput: noop,
		itemsToBlocks,
		isResolving,
		hasResolved,
		lastChangeUID,
		lastReloadUID,
	};
};

const getPrimaryMenuLocationSlug = () => {
	return storeSelect('core/block-editor').getSettings()
		.kubioPrimaryMenuLocation;
};

const usePrimaryMenuBlockEditor = () => {
	const primaryMenuLocation = getPrimaryMenuLocationSlug();
	const { getMenuLocations } = useMenusLocations();
	const menuLocations = getMenuLocations();

	const menuId = useMemo(
		() => find(menuLocations, { name: primaryMenuLocation })?.menu,
		[menuLocations?.length || 0]
	);

	const menuBlockEditor = useMenuBlockEditor(menuId);

	return {
		...menuBlockEditor,
		exists: !!menuId,
	};
};

const createPrimaryMenu = async (menuName = __('Main menu', 'kubio')) => {
	const { saveMenu } = storeDispatch('core');
	const menu = await saveMenu({ name: menuName });
	const location = getPrimaryMenuLocationSlug();
	let id = null;
	if (menu) {
		id = menu.id;
		await apiFetch({
			path: getKubioUrlWithRestPrefix(`kubio/v1/menu/save-menu-location`),
			method: 'POST',
			data: {
				location,
				id,
			},
		});
		loadMenuLocationUID = generate();
		await storeSelect('core').getMenuLocations({ _: loadMenuLocationUID });
	}
};

const useMenusLocations = () => {
	const { menuLocations, setMenuLocations } = useGlobalDataMenuLocations();
	const {
		getMenuLocations,
		isResolvingLocation,
		hasResolvedLocations,
	} = useSelect((select) => ({
		getMenuLocations: select('core').getMenuLocations,
		isResolvingLocation: select('core').isResolving('getMenuLocations'),
		hasResolvedLocations: select('core').hasFinishedResolution(
			'getMenuLocations'
		),
	}));

	const updateLocationMenu = (location, id) => {
		const newLocations = menuLocations.map((menuLocation) => {
			const newMenuLocation = { ...menuLocation };
			if (newMenuLocation.name === location) {
				newMenuLocation.menu = parseInt(id);
			}

			return newMenuLocation;
		});

		setMenuLocations(newLocations);
	};

	return {
		menuLocations: menuLocations || [],
		getMenuLocations,
		isResolvingLocation,
		hasResolvedLocations,
		updateLocationMenu,
	};
};

const registerMenuEntity = () => {
	const unsubscribe = subscribe(() => {
		const coreSelect = storeSelect('core');
		const coreDispatch = storeDispatch('core');

		if (!coreSelect || !coreDispatch) {
			return;
		}

		const gutentagEntities = coreSelect.getEntitiesConfig('kubio');
		const { addEntities } = coreDispatch;
		const registeredMenuEntity = find(gutentagEntities, {
			name: gutentagMenuEntity.name,
		});
		if (!registeredMenuEntity) {
			addEntities([gutentagMenuEntity]);
			unsubscribe();
		}
	});
};

const MenuEntityProvider = ({ id, children }) => {
	const Provider = getEntity().context.Provider;
	const value = useMemo(() => {
		return { id };
	}, [id]);
	return <Provider value={value}>{children}</Provider>;
};

registerMenuEntity();

export {
	MenuEntityProvider,
	useMenuBlockEditor,
	generateItemInitialData,
	usePrimaryMenuBlockEditor,
	useMenusLocations,
	createPrimaryMenu,
};
