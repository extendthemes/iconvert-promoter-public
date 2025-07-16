import { omit } from 'lodash';

const itemsToTree = (items = [], parent = 0) => {
	return items
		.filter((item) => item.parent === parent)
		.map((item) => ({
			...item,
			children: item.id ? itemsToTree(items, item.id) : [],
		}));
};

const treeToItems = (tree, parent = 0) => {
	return tree
		.map((item, index) => [
			{
				...omit(item, ['children', 'block']),
				order: index + 1,
				parent,
			},
			...treeToItems(item.children || [], item.id),
		])
		.reduce((acc, item) => acc.concat(item), []);
};

export { treeToItems, itemsToTree };
