import { composeBlockWithStyle } from '@kubio/core';
import NamesOfBlocks from '../../../blocks-list';

const iconListItemFactory = (text, icon) =>
	composeBlockWithStyle(NamesOfBlocks.ICON_LIST_ITEM, {
		attributes: {
			text,
			icon,
		},
	});

const iconListFactory = () => {
	return [
		iconListItemFactory('Icon List item 1', 'font-awesome/plus'),
		iconListItemFactory('Icon List item 2', 'font-awesome/plus'),
		iconListItemFactory('Icon List item 3', 'font-awesome/plus'),
	];
};

export { iconListFactory, iconListItemFactory };
