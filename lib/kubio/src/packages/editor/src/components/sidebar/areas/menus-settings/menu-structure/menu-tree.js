import {
	LoadingPlaceholder,
	SmallPlaceholder,
	SortableTree,
} from '@kubio/controls';
import { BaseControl } from '@wordpress/components';
import { useCallback, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cloneDeep } from 'lodash';
import { TreeItem } from './tree-item';
import { itemsToTree, treeToItems } from './utils';

const MenuTree = ({ items = [], setItems, isResolving, hasResolved }) => {
	const [editedItemId, setIsEditedItemId] = useState(-Infinity);

	const itemsTree = useMemo(() => {
		return itemsToTree(items);
	}, [items]);

	const setNextItems = useCallback(
		(nextItems) => {
			setItems(nextItems, true);
		},
		[setItems]
	);

	const onRemoveItem = useCallback(
		(removedItem) => {
			let nextItems = cloneDeep(items)
				.filter((item) => item.id !== removedItem.id)
				.map((item) => {
					if (item.parent === removedItem.id) {
						item.parent = removedItem.parent;
					}

					return item;
				});

			let currentItemOrder = 0;
			nextItems = nextItems.map((item) => {
				if (item.parent === removedItem.parent) {
					currentItemOrder++;
					return {
						...item,
						order: currentItemOrder,
					};
				}

				return item;
			});

			setNextItems(nextItems);
		},
		[setNextItems]
	);

	const onSortEnd = useCallback(
		(newItems) => {
			const nextItems = treeToItems(newItems);
			setNextItems(nextItems);
		},
		[setNextItems]
	);

	const onItemChange = useCallback(
		(updates) => {
			if (!updates.id) {
				// eslint-disable-next-line no-console
				console.error('Can not update item without id');
				return;
			}

			const nextItems = cloneDeep(items).map((item) => {
				if (item.id === updates.id) {
					return {
						...item,
						...updates,
					};
				}

				return item;
			});
			setNextItems(nextItems);
		},
		[setNextItems]
	);

	const renderItem = useCallback(
		({ item }) => {
			return (
				<TreeItem
					item={item}
					onItemChange={onItemChange}
					onRemoveItem={onRemoveItem}
					onTogglePopover={(value) => {
						setIsEditedItemId(value ? item.id : -Infinity);
					}}
				/>
			);
		},
		[setIsEditedItemId, onItemChange, onRemoveItem]
	);

	const hasItems = itemsTree.length > 0;

	const isActive = useCallback(
		(item) => {
			return item.id === editedItemId;
		},
		[editedItemId]
	);

	return (
		<BaseControl>
			<div className={'kubio-inspector-menu-tree'}>
				{isResolving && (
					<LoadingPlaceholder
						message={__('Loading menu …', 'kubio')}
					/>
				)}
				{hasResolved && hasItems && (
					<SortableTree
						items={itemsTree}
						renderItem={renderItem}
						handler={true}
						collapsable={false}
						onChange={onSortEnd}
						isActive={isActive}
					/>
				)}
				{hasResolved && !hasItems && (
					<SmallPlaceholder message={__('Empty menu', 'kubio')} />
				)}
			</div>
		</BaseControl>
	);
};

export { MenuTree };
